import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { questionService } from '../../../../core/services/modules/questionService';
import { questionAnswerService } from '../../../../core/services/modules/questionAnswerService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const resolveCollectionFromPayload = (payload) => {
    const resolved = payload?.data ?? payload;

    if (Array.isArray(resolved)) return resolved;
    if (Array.isArray(resolved?.data)) return resolved.data;
    if (Array.isArray(resolved?.items)) return resolved.items;
    if (Array.isArray(resolved?.content)) return resolved.content;

    return [];
};

const toTimestamp = (value) => {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
};

const resolveLatestStudentQuestionAnswer = (question) => {
    const answers = Array.isArray(question?.studentQuestionAnswers)
        ? question.studentQuestionAnswers.filter(Boolean)
        : [];

    if (!answers.length) {
        return question?.answer || null;
    }

    return [...answers].sort((a, b) => {
        const aTime =
            toTimestamp(a?.updatedAt) ||
            toTimestamp(a?.createdAt) ||
            toTimestamp(a?.submittedAt);
        const bTime =
            toTimestamp(b?.updatedAt) ||
            toTimestamp(b?.createdAt) ||
            toTimestamp(b?.submittedAt);

        if (aTime !== bTime) return bTime - aTime;

        const aId = Number(a?.questionAnswerId ?? a?.id ?? 0);
        const bId = Number(b?.questionAnswerId ?? b?.id ?? 0);
        return bId - aId;
    })[0] || null;
};

const normalizeQuestion = (question, fallbackIndex = 0) => {
    if (!question || typeof question !== 'object') return null;

    const questionId = question?.questionId ?? question?.id;
    if (questionId == null) return null;

    const latestAnswer = resolveLatestStudentQuestionAnswer(question);

    return {
        ...question,
        questionId: String(questionId),
        answer: latestAnswer,
        content:
            question?.content ||
            question?.questionContent ||
            question?.title ||
            `Câu hỏi ${fallbackIndex + 1}`,
    };
};

const normalizeQuestionFromPayload = (payload) => {
    const resolved = payload?.data ?? payload;

    if (Array.isArray(resolved)) {
        return normalizeQuestion(resolved[0], 0);
    }

    if (resolved && typeof resolved === 'object') {
        return normalizeQuestion(resolved, 0);
    }

    return null;
};

const normalizeQuestionListFromPayload = (payload) => {
    const questions = resolveCollectionFromPayload(payload);

    return questions
        .map((question, index) => normalizeQuestion(question, index))
        .filter(Boolean);
};

const upsertAnswerInQuestion = (question, nextAnswer) => {
    if (!question || !nextAnswer || nextAnswer?.questionId == null) return question;

    if (String(question?.questionId) !== String(nextAnswer.questionId)) {
        return question;
    }

    const safeStudentQuestionAnswers = Array.isArray(question?.studentQuestionAnswers)
        ? question.studentQuestionAnswers
        : [];

    const incomingAnswerId = nextAnswer?.questionAnswerId ?? nextAnswer?.id;
    const existingIndex = safeStudentQuestionAnswers.findIndex((item) => {
        const itemId = item?.questionAnswerId ?? item?.id;
        return incomingAnswerId != null && itemId != null && String(itemId) === String(incomingAnswerId);
    });

    let nextStudentQuestionAnswers = safeStudentQuestionAnswers;
    if (existingIndex >= 0) {
        nextStudentQuestionAnswers = [...safeStudentQuestionAnswers];
        nextStudentQuestionAnswers[existingIndex] = {
            ...nextStudentQuestionAnswers[existingIndex],
            ...nextAnswer,
        };
    } else {
        nextStudentQuestionAnswers = [...safeStudentQuestionAnswers, nextAnswer];
    }

    return {
        ...question,
        answer: nextAnswer,
        studentQuestionAnswers: nextStudentQuestionAnswers,
    };
};

const createInitialState = () => ({
    questionDetail: null,
    relatedQuestions: [],
    loadingDetail: false,
    detailError: null,
    loadingRelated: false,
    relatedError: null,
    submitAnswerLoading: {},
    submitAnswerError: {},
    submittedAnswer: null,
});

const initialState = createInitialState();

export const fetchPublicStudentQuestionDetail = createAsyncThunk(
    'questionDetail/fetchPublicStudentQuestionDetail',
    async (questionId, thunkAPI) => {
        return handleAsyncThunk(
            () => questionService.getPublicStudentQuestionDetail(questionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy chi tiết câu hỏi thất bại',
            }
        );
    }
);

export const fetchPublicStudentQuestionRelated = createAsyncThunk(
    'questionDetail/fetchPublicStudentQuestionRelated',
    async ({ questionId, limit = 8 } = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => questionService.getPublicStudentRelatedQuestions(questionId, { limit }),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy câu hỏi liên quan thất bại',
            }
        );
    }
);

export const submitQuestionDetailAnswer = createAsyncThunk(
    'questionDetail/submitQuestionDetailAnswer',
    async (payload = {}, thunkAPI) => {
        const request = typeof payload === 'object' && payload !== null ? payload : {};

        const sanitizedPayload = {
            ...request,
            attemptId: undefined,
        };

        return handleAsyncThunk(
            () => questionAnswerService.submitPublicStudentQuestionAnswer(sanitizedPayload),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Nộp câu trả lời thất bại',
            }
        );
    }
);

const questionDetailSlice = createSlice({
    name: 'questionDetail',
    initialState,
    reducers: {
        clearQuestionDetailState: () => createInitialState(),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicStudentQuestionDetail.pending, (state) => {
                state.loadingDetail = true;
                state.detailError = null;
                state.questionDetail = null;
            })
            .addCase(fetchPublicStudentQuestionDetail.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.detailError = null;
                state.questionDetail = normalizeQuestionFromPayload(action.payload);
            })
            .addCase(fetchPublicStudentQuestionDetail.rejected, (state, action) => {
                state.loadingDetail = false;
                state.detailError = action.payload || action.error.message;
                state.questionDetail = null;
            })
            .addCase(fetchPublicStudentQuestionRelated.pending, (state) => {
                state.loadingRelated = true;
                state.relatedError = null;
                state.relatedQuestions = [];
            })
            .addCase(fetchPublicStudentQuestionRelated.fulfilled, (state, action) => {
                state.loadingRelated = false;
                state.relatedError = null;
                state.relatedQuestions = normalizeQuestionListFromPayload(action.payload);
            })
            .addCase(fetchPublicStudentQuestionRelated.rejected, (state, action) => {
                state.loadingRelated = false;
                state.relatedError = action.payload || action.error.message;
                state.relatedQuestions = [];
            })
            .addCase(submitQuestionDetailAnswer.pending, (state, action) => {
                const questionId =
                    typeof action.meta.arg === 'object' && action.meta.arg !== null
                        ? action.meta.arg.questionId
                        : undefined;

                if (questionId != null) {
                    const questionKey = String(questionId);
                    state.submitAnswerLoading[questionKey] = true;
                    state.submitAnswerError[questionKey] = null;
                }
            })
            .addCase(submitQuestionDetailAnswer.fulfilled, (state, action) => {
                const questionId =
                    typeof action.meta.arg === 'object' && action.meta.arg !== null
                        ? action.meta.arg.questionId
                        : undefined;

                if (questionId != null) {
                    const questionKey = String(questionId);
                    state.submitAnswerLoading[questionKey] = false;
                    state.submitAnswerError[questionKey] = null;
                }

                const nextSubmittedAnswer = action.payload?.data || action.payload || null;
                state.submittedAnswer = nextSubmittedAnswer;

                state.questionDetail = upsertAnswerInQuestion(state.questionDetail, nextSubmittedAnswer);
                state.relatedQuestions = state.relatedQuestions.map((question) =>
                    upsertAnswerInQuestion(question, nextSubmittedAnswer)
                );
            })
            .addCase(submitQuestionDetailAnswer.rejected, (state, action) => {
                const questionId =
                    typeof action.meta.arg === 'object' && action.meta.arg !== null
                        ? action.meta.arg.questionId
                        : undefined;

                if (questionId != null) {
                    const questionKey = String(questionId);
                    state.submitAnswerLoading[questionKey] = false;
                    state.submitAnswerError[questionKey] = action.payload || action.error.message;
                }
            });
    },
});

export const { clearQuestionDetailState } = questionDetailSlice.actions;

export const selectQuestionDetail = (state) => state.questionDetail.questionDetail;
export const selectQuestionDetailRelatedQuestions = (state) => state.questionDetail.relatedQuestions;
export const selectQuestionDetailLoadingDetail = (state) => state.questionDetail.loadingDetail;
export const selectQuestionDetailError = (state) => state.questionDetail.detailError;
export const selectQuestionDetailLoadingRelated = (state) => state.questionDetail.loadingRelated;
export const selectQuestionDetailRelatedError = (state) => state.questionDetail.relatedError;
export const selectQuestionDetailSubmitAnswerLoadingByQuestionId = (state, questionId) => {
    if (questionId == null) return false;
    return Boolean(state.questionDetail.submitAnswerLoading[String(questionId)]);
};
export const selectQuestionDetailSubmitAnswerErrorByQuestionId = (state, questionId) => {
    if (questionId == null) return null;
    return state.questionDetail.submitAnswerError[String(questionId)] || null;
};

export default questionDetailSlice.reducer;

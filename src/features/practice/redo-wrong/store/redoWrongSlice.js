import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { questionService } from '../../../../core/services/modules/questionService';
import { questionAnswerService } from '../../../../core/services/modules/questionAnswerService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toSafeNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveCollectionFromPayload = (payload) => {
    const resolved = payload?.data ?? payload;

    if (Array.isArray(resolved)) return resolved;
    if (Array.isArray(resolved?.data)) return resolved.data;
    if (Array.isArray(resolved?.items)) return resolved.items;
    if (Array.isArray(resolved?.content)) return resolved.content;

    return [];
};

const mergeUniqueByKey = (previous = [], incoming = [], keyName = 'id') => {
    const map = new Map();

    previous.forEach((item) => {
        map.set(String(item?.[keyName]), item);
    });

    incoming.forEach((item) => {
        map.set(String(item?.[keyName]), item);
    });

    return Array.from(map.values());
};

const resolvePagination = (payload, fallbackQuery = {}, fallbackTotal = 0) => {
    const source =
        payload?.meta ||
        payload?.pagination ||
        payload?.data?.meta ||
        payload?.data?.pagination ||
        {};

    const page = toSafeNumber(source?.page ?? source?.currentPage, toSafeNumber(fallbackQuery?.page, 1));
    const limit = toSafeNumber(source?.limit ?? source?.pageSize, toSafeNumber(fallbackQuery?.limit, 10));
    const total = toSafeNumber(source?.total ?? source?.totalItems ?? source?.itemCount, fallbackTotal);
    const computedTotalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
    const totalPages = toSafeNumber(source?.totalPages ?? source?.pageCount, computedTotalPages);

    const hasNextPage = Boolean(source?.hasNextPage ?? source?.hasNext ?? (page < totalPages));
    const hasPrevPage = Boolean(source?.hasPrevPage ?? source?.hasPrevious ?? source?.hasPrev ?? (page > 1));

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: source?.nextPage ?? (hasNextPage ? page + 1 : null),
        prevPage: source?.prevPage ?? source?.previousPage ?? (hasPrevPage ? page - 1 : null),
    };
};

// ─── Normalizers ─────────────────────────────────────────────────────────────

const resolveLatestStudentQuestionAnswer = (question) => {
    const answers = Array.isArray(question?.studentQuestionAnswers)
        ? question.studentQuestionAnswers.filter(Boolean)
        : [];

    if (!answers.length) {
        return question?.answer || null;
    }

    const toTimestamp = (value) => {
        if (!value) return 0;
        const timestamp = Date.parse(value);
        return Number.isFinite(timestamp) ? timestamp : 0;
    };

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

const normalizeQuestions = (payload) => {
    const questions = resolveCollectionFromPayload(payload);

    return questions
        .map((question, index) => {
            const questionId = question?.questionId ?? question?.id;
            const latestAnswer = resolveLatestStudentQuestionAnswer(question);

            if (questionId == null) return null;

            return {
                ...question,
                questionId: String(questionId),
                answer: latestAnswer,
                content:
                    question?.content ||
                    question?.questionContent ||
                    question?.title ||
                    `Câu hỏi ${index + 1}`,
            };
        })
        .filter(Boolean);
};

const upsertAnswerInQuestions = (questions = [], nextAnswer) => {
    if (!Array.isArray(questions)) return [];
    if (!nextAnswer || nextAnswer?.questionId == null) return questions;

    const questionKey = String(nextAnswer.questionId);

    return questions.map((question) => {
        if (String(question?.questionId) !== questionKey) return question;

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
    });
};

// ─── Initial State Factories ─────────────────────────────────────────────────

const createInitialQuestionsPagination = () => ({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
});

const createInitialState = () => ({
    questions: [],
    questionsPagination: createInitialQuestionsPagination(),
    loadingQuestions: false,
    questionsError: null,
    submitAnswerLoading: {},
    submitAnswerError: {},
    submittedAnswer: null,
    // ── Statistics ──
    statistics: null,
    statisticsLoading: false,
    statisticsError: null,
});

const initialState = createInitialState();

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchRedoWrongQuestions = createAsyncThunk(
    'redoWrong/fetchQuestions',
    async (payload = {}, thunkAPI) => {
        const request = typeof payload === 'object' ? payload : {};
        const query = {
            page: toSafeNumber(request?.page, 1),
            limit: toSafeNumber(request?.limit, 10),
            isCorrect: 'false',
        };

        return handleAsyncThunk(
            () => questionService.getPublicStudentQuestions(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách câu sai thất bại',
            }
        );
    }
);

export const fetchRedoWrongStatistics = createAsyncThunk(
    'redoWrong/fetchStatistics',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.getPublicStudentQuestionAnswerStatistics(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy thống kê câu sai thất bại',
            }
        );
    }
);

export const submitRedoWrongQuestionAnswer = createAsyncThunk(
    'redoWrong/submitQuestionAnswer',
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

// ─── Slice ───────────────────────────────────────────────────────────────────

const redoWrongSlice = createSlice({
    name: 'redoWrong',
    initialState,
    reducers: {
        clearRedoWrongState: () => createInitialState(),
    },
    extraReducers: (builder) => {
        builder
            // ── Questions (wrong answers) ──
            .addCase(fetchRedoWrongQuestions.pending, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, 10);

                state.loadingQuestions = true;
                state.questionsError = null;

                if (requestedPage === 1) {
                    state.questions = [];
                    state.questionsPagination = {
                        ...createInitialQuestionsPagination(),
                        limit: requestedLimit,
                    };
                }
            })
            .addCase(fetchRedoWrongQuestions.fulfilled, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, 10);
                const questions = normalizeQuestions(action.payload);
                const mergedQuestions =
                    requestedPage === 1
                        ? questions
                        : mergeUniqueByKey(state.questions, questions, 'questionId');
                const normalizedPagination = resolvePagination(
                    action.payload,
                    { page: requestedPage, limit: requestedLimit },
                    mergedQuestions.length
                );

                state.loadingQuestions = false;
                state.questionsError = null;
                state.questions = mergedQuestions;
                state.questionsPagination = normalizedPagination;
            })
            .addCase(fetchRedoWrongQuestions.rejected, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);

                state.loadingQuestions = false;
                state.questionsError = action.payload || action.error.message;

                if (requestedPage === 1) {
                    state.questions = [];
                    state.questionsPagination = {
                        ...createInitialQuestionsPagination(),
                        limit: 10,
                    };
                }
            })

            // ── Statistics ──
            .addCase(fetchRedoWrongStatistics.pending, (state) => {
                state.statisticsLoading = true;
                state.statisticsError = null;
            })
            .addCase(fetchRedoWrongStatistics.fulfilled, (state, action) => {
                state.statisticsLoading = false;
                state.statistics = action.payload?.data ?? null;
                state.statisticsError = null;
            })
            .addCase(fetchRedoWrongStatistics.rejected, (state, action) => {
                state.statisticsLoading = false;
                state.statisticsError = action.payload || action.error.message;
            })

            // ── Submit answer ──
            .addCase(submitRedoWrongQuestionAnswer.pending, (state, action) => {
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
            .addCase(submitRedoWrongQuestionAnswer.fulfilled, (state, action) => {
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

                if (nextSubmittedAnswer?.questionId != null) {
                    state.questions = upsertAnswerInQuestions(state.questions, nextSubmittedAnswer);
                }
            })
            .addCase(submitRedoWrongQuestionAnswer.rejected, (state, action) => {
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

export const {
    clearRedoWrongState,
} = redoWrongSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectRedoWrongQuestions = (state) => state.redoWrong.questions;
export const selectRedoWrongQuestionsPagination = (state) => state.redoWrong.questionsPagination;
export const selectRedoWrongLoadingQuestions = (state) => state.redoWrong.loadingQuestions;
export const selectRedoWrongQuestionsError = (state) => state.redoWrong.questionsError;
export const selectRedoWrongSubmitAnswerLoading = (state) => state.redoWrong.submitAnswerLoading;
export const selectRedoWrongSubmitAnswerError = (state) => state.redoWrong.submitAnswerError;
export const selectRedoWrongSubmittedAnswer = (state) => state.redoWrong.submittedAnswer;
export const selectRedoWrongStatistics = (state) => state.redoWrong.statistics;
export const selectRedoWrongStatisticsLoading = (state) => state.redoWrong.statisticsLoading;
export const selectRedoWrongStatisticsError = (state) => state.redoWrong.statisticsError;

export default redoWrongSlice.reducer;

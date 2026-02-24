import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doCompetitionService } from '../../../core/services/modules/doCompetitionService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

/**
 * Initial State
 */
const initialState = {
    currentAttempt: null,
    remainingTime: null,
    // Competition info
    competition: null,
    // Exam data (tách riêng)
    exam: null,
    sections: [],
    unassignedQuestions: [],
    loading: false,
    error: null,
    startAttemptLoading: false,
    startAttemptError: null,
    remainingTimeLoading: false,
    remainingTimeError: null,
    examLoading: false,
    examError: null,
    // Answers data
    answers: [],
    answersLoading: false,
    answersError: null,
    // Submit answer
    submitAnswerLoading: false,
    submitAnswerError: null,
};

/**
 * Async Thunks
 */

/**
 * Start a new competition attempt
 */
export const startCompetitionAttempt = createAsyncThunk(
    'doCompetition/startAttempt',
    async (competitionId, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.startAttempt(competitionId),
            thunkAPI,
            {
                showSuccess: false, // Không hiển thị toast, sẽ xử lý ở component
                errorTitle: 'Bắt đầu làm bài thất bại',
            }
        );
    }
);

/**
 * Get remaining time for current attempt
 */
export const getRemainingTime = createAsyncThunk(
    'doCompetition/getRemainingTime',
    async (submitId, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.getRemainingTime(submitId),
            thunkAPI,
            {
                showSuccess: false,
                showError: false, // Không hiển thị lỗi, xử lý trong component
            }
        );
    }
);

/**
 * Get answers for a competition submit
 */
export const getCompetitionAnswers = createAsyncThunk(
    'doCompetition/getAnswers',
    async (submitId, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.getAnswers(submitId),
            thunkAPI,
            {
                showSuccess: false,
                showError: true,
                errorTitle: 'Tải câu trả lời thất bại',
            }
        );
    }
);

/**
 * Submit or update an answer for a question
 */
export const submitCompetitionAnswer = createAsyncThunk(
    'doCompetition/submitAnswer',
    async ({ submitId, answerId, questionId, body }, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.submitAnswer(submitId, answerId ?? 0, body),
            thunkAPI,
            {
                showSuccess: false,
                showError: true,
                errorTitle: 'Nộp câu trả lời thất bại',
            }
        );
    }
);

/**
 * Get competition exam content
 */
export const getCompetitionExam = createAsyncThunk(
    'doCompetition/getExam',
    async (competitionId, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.getExam(competitionId),
            thunkAPI,
            {
                showSuccess: false,
                showError: true,
                errorTitle: 'Tải đề thi thất bại',
            }
        );
    }
);

/**
 * Do Competition Slice
 */
const doCompetitionSlice = createSlice({
    name: 'doCompetition',
    initialState,
    reducers: {
        clearCurrentAttempt: (state) => {
            state.currentAttempt = null;
            state.error = null;
        },
        setCurrentAttempt: (state, action) => {
            state.currentAttempt = action.payload;
        },
        clearRemainingTime: (state) => {
            state.remainingTime = null;
            state.remainingTimeError = null;
        },
        clearExam: (state) => {
            state.competition = null;
            state.exam = null;
            state.sections = [];
            state.unassignedQuestions = [];
            state.examError = null;
        },
        clearAnswers: (state) => {
            state.answers = [];
            state.answersError = null;
        },
        clearSubmitAnswerError: (state) => {
            state.submitAnswerError = null;
        },
        /**
         * Optimistic update: patch q.answer immediately before API responds
         * payload: { questionId, body }
         * body may contain selectedStatementIds | trueFalseAnswers | answer
         */
        applyOptimisticAnswer: (state, action) => {
            const { questionId, body } = action.payload;
            const patch = (q) => {
                if (q.questionId !== questionId) return q;
                const merged = { ...(q.answer ?? {}), ...body };
                // Derive isAnswered from merged content
                const isAnswered =
                    (merged.selectedStatementIds?.length > 0) ||
                    (merged.trueFalseAnswers?.length > 0) ||
                    (merged.answer != null && merged.answer !== '');
                return { ...q, answer: { ...merged, isAnswered }, isSubmitError: undefined };
            };
            state.sections = state.sections.map((s) => ({
                ...s,
                questions: (s.questions ?? []).map(patch),
            }));
            state.unassignedQuestions = state.unassignedQuestions.map(patch);
        },
        clearErrors: (state) => {
            state.error = null;
            state.startAttemptError = null;
            state.remainingTimeError = null;
            state.examError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Start Competition Attempt
            .addCase(startCompetitionAttempt.pending, (state) => {
                state.startAttemptLoading = true;
                state.startAttemptError = null;
            })
            .addCase(startCompetitionAttempt.fulfilled, (state, action) => {
                state.startAttemptLoading = false;
                state.currentAttempt = action.payload.data;
                state.loading = false;
            })
            .addCase(startCompetitionAttempt.rejected, (state, action) => {
                state.startAttemptLoading = false;
                state.startAttemptError = action.payload || action.error.message;
            })
            // Get Remaining Time
            .addCase(getRemainingTime.pending, (state) => {
                state.remainingTimeLoading = true;
                state.remainingTimeError = null;
            })
            .addCase(getRemainingTime.fulfilled, (state, action) => {
                state.remainingTimeLoading = false;
                state.remainingTime = action.payload.data;
            })
            .addCase(getRemainingTime.rejected, (state, action) => {
                state.remainingTimeLoading = false;
                state.remainingTimeError = action.payload || action.error.message;
            })
            // Get Competition Exam
            .addCase(getCompetitionExam.pending, (state) => {
                state.examLoading = true;
                state.examError = null;
            })
            .addCase(getCompetitionExam.fulfilled, (state, action) => {
                state.examLoading = false;
                const data = action.payload.data;

                // Lưu competition info
                state.competition = data.competition || null;

                // Tách exam data thành 3 phần
                const examData = data.exam || {};
                state.exam = {
                    examId: examData.examId,
                    title: examData.title,
                    description: examData.description,
                    totalQuestions: examData.totalQuestions,
                };
                state.sections = examData.sections || [];
                state.unassignedQuestions = examData.questions || [];
            })
            .addCase(getCompetitionExam.rejected, (state, action) => {
                state.examLoading = false;
                state.examError = action.payload || action.error.message;
            })
            // Get Competition Answers
            .addCase(getCompetitionAnswers.pending, (state) => {
                state.answersLoading = true;
                state.answersError = null;
            })
            .addCase(getCompetitionAnswers.fulfilled, (state, action) => {
                state.answersLoading = false;
                const data = action.payload.data ?? [];
                state.answers = data;

                // Build map questionId -> answer for O(1) lookup
                const answersMap = {};
                data.forEach((a) => {
                    answersMap[a.questionId] = a;
                });

                // Gắn answer trực tiếp vào từng câu hỏi trong sections
                state.sections = state.sections.map((section) => ({
                    ...section,
                    questions: (section.questions ?? []).map((q) => ({
                        ...q,
                        answer: answersMap[q.questionId] ?? null,
                    })),
                }));

                // Gắn answer vào câu hỏi không thuộc section
                state.unassignedQuestions = state.unassignedQuestions.map((q) => ({
                    ...q,
                    answer: answersMap[q.questionId] ?? null,
                }));
            })
            .addCase(getCompetitionAnswers.rejected, (state, action) => {
                state.answersLoading = false;
                state.answersError = action.payload || action.error.message;
            })
            // Submit Competition Answer
            .addCase(submitCompetitionAnswer.pending, (state) => {
                state.submitAnswerLoading = true;
                state.submitAnswerError = null;
            })
            .addCase(submitCompetitionAnswer.fulfilled, (state, action) => {
                state.submitAnswerLoading = false;
                const updatedAnswer = action.payload.data;
                if (!updatedAnswer) return;

                const qId = updatedAnswer.questionId;

                // Cập nhật answers array
                const idx = state.answers.findIndex((a) => a.questionId === qId);
                if (idx !== -1) {
                    state.answers[idx] = updatedAnswer;
                } else {
                    state.answers.push(updatedAnswer);
                }

                // Hạm gán lại answer và xóa isSubmitError khi thành công
                const patch = (q) =>
                    q.questionId === qId
                        ? { ...q, answer: updatedAnswer, isSubmitError: undefined }
                        : q;

                state.sections = state.sections.map((section) => ({
                    ...section,
                    questions: (section.questions ?? []).map(patch),
                }));
                state.unassignedQuestions = state.unassignedQuestions.map(patch);
            })
            .addCase(submitCompetitionAnswer.rejected, (state, action) => {
                state.submitAnswerLoading = false;
                state.submitAnswerError = action.payload || action.error.message;

                // Đánh dấu câu hỏi bị lỗi để UI hiển thị cảnh báo
                const qId = action.meta.arg.questionId;
                if (!qId) return;

                const markError = (q) =>
                    q.questionId === qId ? { ...q, isSubmitError: true } : q;

                state.sections = state.sections.map((section) => ({
                    ...section,
                    questions: (section.questions ?? []).map(markError),
                }));
                state.unassignedQuestions = state.unassignedQuestions.map(markError);
            });
    },
});

/**
 * Actions
 */
export const {
    clearCurrentAttempt,
    setCurrentAttempt,
    clearRemainingTime,
    clearExam,
    clearAnswers,
    clearErrors,
    clearSubmitAnswerError,
    applyOptimisticAnswer,
} = doCompetitionSlice.actions;

/**
 * Selectors
 */
export const selectCurrentAttempt = (state) => state.doCompetition.currentAttempt;
export const selectRemainingTime = (state) => state.doCompetition.remainingTime;
export const selectCompetition = (state) => state.doCompetition.competition;
export const selectExam = (state) => state.doCompetition.exam;
export const selectSections = (state) => state.doCompetition.sections;
export const selectUnassignedQuestions = (state) => state.doCompetition.unassignedQuestions;
export const selectDoCompetitionLoading = (state) => state.doCompetition.loading;
export const selectDoCompetitionError = (state) => state.doCompetition.error;
export const selectStartAttemptLoading = (state) => state.doCompetition.startAttemptLoading;
export const selectStartAttemptError = (state) => state.doCompetition.startAttemptError;
export const selectRemainingTimeLoading = (state) => state.doCompetition.remainingTimeLoading;
export const selectRemainingTimeError = (state) => state.doCompetition.remainingTimeError;
export const selectExamLoading = (state) => state.doCompetition.examLoading;
export const selectExamError = (state) => state.doCompetition.examError;
export const selectAnswers = (state) => state.doCompetition.answers;
export const selectAnswersLoading = (state) => state.doCompetition.answersLoading;
export const selectAnswersError = (state) => state.doCompetition.answersError;
export const selectSubmitAnswerLoading = (state) => state.doCompetition.submitAnswerLoading;
export const selectSubmitAnswerError = (state) => state.doCompetition.submitAnswerError;

export default doCompetitionSlice.reducer;

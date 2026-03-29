import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examAttemptService } from '../../../../core/services/modules/examAttemptService';
import { examService } from '../../../../core/services/modules/examService';
import { questionAnswerService } from '../../../../core/services/modules/questionAnswerService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const buildQuestionAnswerMap = (questionAnswers = []) => {
    if (!Array.isArray(questionAnswers)) return {};

    return questionAnswers.reduce((acc, item) => {
        const questionId = item?.questionId;
        if (questionId != null) {
            acc[String(questionId)] = item;
        }
        return acc;
    }, {});
};

const applyAnswersToQuestions = (questions = [], questionAnswerMap = {}) => {
    if (!Array.isArray(questions)) return [];

    return questions.map((question) => {
        const questionKey = question?.questionId != null ? String(question.questionId) : null;
        const answer = questionKey ? questionAnswerMap[questionKey] || null : null;

        return {
            ...question,
            answer,
        };
    });
};

const hydrateExamContentWithAnswers = (examContent, questionAnswers = []) => {
    if (!examContent || typeof examContent !== 'object') return examContent;

    const questionAnswerMap = buildQuestionAnswerMap(questionAnswers);

    const nextExamContent = {
        ...examContent,
        questions: applyAnswersToQuestions(examContent?.questions, questionAnswerMap),
    };

    if (Array.isArray(examContent?.sections)) {
        nextExamContent.sections = examContent.sections.map((section) => {
            if (!Array.isArray(section?.questions)) return section;

            return {
                ...section,
                questions: applyAnswersToQuestions(section.questions, questionAnswerMap),
            };
        });
    }

    return nextExamContent;
};

const upsertQuestionAnswerInList = (questionAnswers = [], nextAnswer) => {
    if (!nextAnswer || nextAnswer?.questionId == null) {
        return Array.isArray(questionAnswers) ? questionAnswers : [];
    }

    const safeList = Array.isArray(questionAnswers) ? questionAnswers : [];
    const questionKey = String(nextAnswer.questionId);
    const existingIndex = safeList.findIndex((item) => String(item?.questionId) === questionKey);

    if (existingIndex === -1) {
        return [...safeList, nextAnswer];
    }

    const nextList = [...safeList];
    nextList[existingIndex] = {
        ...nextList[existingIndex],
        ...nextAnswer,
    };
    return nextList;
};

const upsertQuestionAnswerInExamContent = (examContent, nextAnswer) => {
    if (!examContent || typeof examContent !== 'object') return examContent;
    if (!nextAnswer || nextAnswer?.questionId == null) return examContent;

    const questionKey = String(nextAnswer.questionId);

    const patchQuestion = (question) => {
        if (String(question?.questionId) !== questionKey) return question;
        return {
            ...question,
            answer: nextAnswer,
        };
    };

    const nextExamContent = {
        ...examContent,
        questions: Array.isArray(examContent?.questions)
            ? examContent.questions.map(patchQuestion)
            : examContent?.questions,
    };

    if (Array.isArray(examContent?.sections)) {
        nextExamContent.sections = examContent.sections.map((section) => {
            if (!Array.isArray(section?.questions)) return section;
            return {
                ...section,
                questions: section.questions.map(patchQuestion),
            };
        });
    }

    return nextExamContent;
};

export const fetchPublicStudentExamAttemptDetail = createAsyncThunk(
    'practiceAttempt/fetchPublicStudentExamAttemptDetail',
    async (attemptId, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttemptDetail(attemptId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay chi tiet luot lam bai that bai',
            }
        );
    }
);

export const fetchPublicStudentExam = createAsyncThunk(
    'practiceAttempt/fetchPublicStudentExam',
    async (payload, thunkAPI) => {
        const examId = typeof payload === 'object' && payload !== null ? payload.examId : payload;
        const questionIds = typeof payload === 'object' && payload !== null ? payload.questionIds : undefined;

        return handleAsyncThunk(
            () => examService.getPublicStudentExam(examId, questionIds ? { questionIds } : {}),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay noi dung de thi that bai',
            }
        );
    }
);

export const submitPublicStudentQuestionAnswer = createAsyncThunk(
    'practiceAttempt/submitPublicStudentQuestionAnswer',
    async (payload, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.submitPublicStudentQuestionAnswer(payload),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Nop cau tra loi that bai',
            }
        );
    }
);

export const fetchPublicStudentQuestionAnswersByAttempt = createAsyncThunk(
    'practiceAttempt/fetchPublicStudentQuestionAnswersByAttempt',
    async (attemptId, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.getPublicStudentQuestionAnswersByAttempt(attemptId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay danh sach cau tra loi theo luot lam bai that bai',
            }
        );
    }
);

export const submitPublicStudentExamAttempt = createAsyncThunk(
    'practiceAttempt/submitPublicStudentExamAttempt',
    async (attemptId, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.submitPublicStudentExamAttempt(attemptId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Nop bai that bai',
            }
        );
    }
);

const initialState = {
    attemptDetail: null,
    loading: false,
    error: null,
    currentAttemptId: null,
    hasFetchedAttemptDetail: false,
    hasFetchedAttemptDetailSuccess: false,
    examContent: null,
    examContentLoading: false,
    examContentError: null,
    currentExamContentId: null,
    hasFetchedExamContent: false,
    hasFetchedExamContentSuccess: false,
    questionAnswersByAttempt: null,
    questionAnswersByAttemptLoading: false,
    questionAnswersByAttemptError: null,
    currentQuestionAnswersAttemptId: null,
    hasFetchedQuestionAnswersByAttempt: false,
    hasFetchedQuestionAnswersByAttemptSuccess: false,
    submitAnswerLoading: {},
    submitAnswerError: {},
    submittedAnswer: null,
    submitAttemptLoading: false,
    submitAttemptError: null,
    submittedAttempt: null,
};

const practiceAttemptSlice = createSlice({
    name: 'practiceAttempt',
    initialState,
    reducers: {
        clearPracticeAttempt: (state) => {
            state.attemptDetail = null;
            state.loading = false;
            state.error = null;
            state.currentAttemptId = null;
            state.hasFetchedAttemptDetail = false;
            state.hasFetchedAttemptDetailSuccess = false;
            state.examContent = null;
            state.examContentLoading = false;
            state.examContentError = null;
            state.currentExamContentId = null;
            state.hasFetchedExamContent = false;
            state.hasFetchedExamContentSuccess = false;
            state.questionAnswersByAttempt = null;
            state.questionAnswersByAttemptLoading = false;
            state.questionAnswersByAttemptError = null;
            state.currentQuestionAnswersAttemptId = null;
            state.hasFetchedQuestionAnswersByAttempt = false;
            state.hasFetchedQuestionAnswersByAttemptSuccess = false;
            state.submitAnswerLoading = {};
            state.submitAnswerError = {};
            state.submittedAnswer = null;
            state.submitAttemptLoading = false;
            state.submitAttemptError = null;
            state.submittedAttempt = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicStudentExamAttemptDetail.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.currentAttemptId = action.meta.arg || null;
                state.hasFetchedAttemptDetail = true;
                state.hasFetchedAttemptDetailSuccess = false;
                state.questionAnswersByAttempt = null;
                state.questionAnswersByAttemptLoading = false;
                state.questionAnswersByAttemptError = null;
                state.currentQuestionAnswersAttemptId = null;
                state.hasFetchedQuestionAnswersByAttempt = false;
                state.hasFetchedQuestionAnswersByAttemptSuccess = false;
                state.hasFetchedExamContent = false;
                state.hasFetchedExamContentSuccess = false;
            })
            .addCase(fetchPublicStudentExamAttemptDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.attemptDetail = action.payload?.data || action.payload || null;
                state.currentAttemptId = action.meta.arg || null;
                state.hasFetchedAttemptDetail = true;
                state.hasFetchedAttemptDetailSuccess = true;
            })
            .addCase(fetchPublicStudentExamAttemptDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.hasFetchedAttemptDetail = true;
                state.hasFetchedAttemptDetailSuccess = false;
            })
            .addCase(fetchPublicStudentExam.pending, (state) => {
                state.examContentLoading = true;
                state.examContentError = null;
                state.examContent = null;
                state.hasFetchedExamContent = true;
                state.hasFetchedExamContentSuccess = false;
            })
            .addCase(fetchPublicStudentExam.fulfilled, (state, action) => {
                state.examContentLoading = false;
                const rawExamContent = action.payload?.data || action.payload || null;
                const questionAnswers = state.questionAnswersByAttempt?.questionAnswers || [];
                state.examContent = hydrateExamContentWithAnswers(rawExamContent, questionAnswers);
                state.currentExamContentId =
                    typeof action.meta.arg === 'object' && action.meta.arg !== null
                        ? action.meta.arg.examId || null
                        : action.meta.arg || null;
                state.hasFetchedExamContent = true;
                state.hasFetchedExamContentSuccess = true;
            })
            .addCase(fetchPublicStudentExam.rejected, (state, action) => {
                state.examContentLoading = false;
                state.examContentError = action.payload || action.error.message;
                state.examContent = null;
                state.hasFetchedExamContent = true;
                state.hasFetchedExamContentSuccess = false;
            })
            .addCase(fetchPublicStudentQuestionAnswersByAttempt.pending, (state, action) => {
                state.questionAnswersByAttemptLoading = true;
                state.questionAnswersByAttemptError = null;
                state.currentQuestionAnswersAttemptId = action.meta.arg || null;
                state.hasFetchedQuestionAnswersByAttempt = true;
                state.hasFetchedQuestionAnswersByAttemptSuccess = false;
            })
            .addCase(fetchPublicStudentQuestionAnswersByAttempt.fulfilled, (state, action) => {
                state.questionAnswersByAttemptLoading = false;
                state.questionAnswersByAttemptError = null;
                state.questionAnswersByAttempt = action.payload?.data || action.payload || null;
                state.currentQuestionAnswersAttemptId = action.meta.arg || null;
                state.hasFetchedQuestionAnswersByAttempt = true;
                state.hasFetchedQuestionAnswersByAttemptSuccess = true;

                if (state.examContent) {
                    const questionAnswers = state.questionAnswersByAttempt?.questionAnswers || [];
                    state.examContent = hydrateExamContentWithAnswers(state.examContent, questionAnswers);
                }
            })
            .addCase(fetchPublicStudentQuestionAnswersByAttempt.rejected, (state, action) => {
                state.questionAnswersByAttemptLoading = false;
                state.questionAnswersByAttemptError = action.payload || action.error.message;
                state.hasFetchedQuestionAnswersByAttempt = true;
                state.hasFetchedQuestionAnswersByAttemptSuccess = false;
            })
            .addCase(submitPublicStudentQuestionAnswer.pending, (state, action) => {
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
            .addCase(submitPublicStudentQuestionAnswer.fulfilled, (state, action) => {
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
                    state.examContent = upsertQuestionAnswerInExamContent(state.examContent, nextSubmittedAnswer);

                    if (state.questionAnswersByAttempt && typeof state.questionAnswersByAttempt === 'object') {
                        state.questionAnswersByAttempt = {
                            ...state.questionAnswersByAttempt,
                            questionAnswers: upsertQuestionAnswerInList(
                                state.questionAnswersByAttempt?.questionAnswers,
                                nextSubmittedAnswer
                            ),
                        };
                    }
                }
            })
            .addCase(submitPublicStudentQuestionAnswer.rejected, (state, action) => {
                const questionId =
                    typeof action.meta.arg === 'object' && action.meta.arg !== null
                        ? action.meta.arg.questionId
                        : undefined;

                if (questionId != null) {
                    const questionKey = String(questionId);
                    state.submitAnswerLoading[questionKey] = false;
                    state.submitAnswerError[questionKey] = action.payload || action.error.message;
                }
            })
            .addCase(submitPublicStudentExamAttempt.pending, (state) => {
                state.submitAttemptLoading = true;
                state.submitAttemptError = null;
            })
            .addCase(submitPublicStudentExamAttempt.fulfilled, (state, action) => {
                state.submitAttemptLoading = false;
                state.submitAttemptError = null;

                const nextSubmittedAttempt = action.payload?.data || action.payload || null;
                state.submittedAttempt = nextSubmittedAttempt;

                if (state.attemptDetail && nextSubmittedAttempt && typeof nextSubmittedAttempt === 'object') {
                    state.attemptDetail = {
                        ...state.attemptDetail,
                        ...nextSubmittedAttempt,
                    };
                }
            })
            .addCase(submitPublicStudentExamAttempt.rejected, (state, action) => {
                state.submitAttemptLoading = false;
                state.submitAttemptError = action.payload || action.error.message;
            });
    },
});

export const { clearPracticeAttempt } = practiceAttemptSlice.actions;

export const selectPracticeAttemptDetail = (state) => state.practiceAttempt.attemptDetail;
export const selectPracticeAttemptLoading = (state) => state.practiceAttempt.loading;
export const selectPracticeAttemptError = (state) => state.practiceAttempt.error;
export const selectCurrentPracticeAttemptId = (state) => state.practiceAttempt.currentAttemptId;
export const selectHasFetchedPracticeAttemptDetail = (state) => state.practiceAttempt.hasFetchedAttemptDetail;
export const selectHasFetchedPracticeAttemptDetailSuccess = (state) => state.practiceAttempt.hasFetchedAttemptDetailSuccess;
export const selectPracticeExamContent = (state) => state.practiceAttempt.examContent;
export const selectPracticeExamContentLoading = (state) => state.practiceAttempt.examContentLoading;
export const selectPracticeExamContentError = (state) => state.practiceAttempt.examContentError;
export const selectCurrentPracticeExamContentId = (state) => state.practiceAttempt.currentExamContentId;
export const selectHasFetchedPracticeExamContent = (state) => state.practiceAttempt.hasFetchedExamContent;
export const selectHasFetchedPracticeExamContentSuccess = (state) => state.practiceAttempt.hasFetchedExamContentSuccess;
export const selectPracticeQuestionAnswersByAttempt = (state) => state.practiceAttempt.questionAnswersByAttempt;
export const selectPracticeQuestionAnswersByAttemptLoading = (state) => state.practiceAttempt.questionAnswersByAttemptLoading;
export const selectPracticeQuestionAnswersByAttemptError = (state) => state.practiceAttempt.questionAnswersByAttemptError;
export const selectCurrentPracticeQuestionAnswersAttemptId = (state) => state.practiceAttempt.currentQuestionAnswersAttemptId;
export const selectHasFetchedPracticeQuestionAnswersByAttempt = (state) => state.practiceAttempt.hasFetchedQuestionAnswersByAttempt;
export const selectHasFetchedPracticeQuestionAnswersByAttemptSuccess = (state) => state.practiceAttempt.hasFetchedQuestionAnswersByAttemptSuccess;
export const selectPracticeSubmitAnswerLoading = (state) => state.practiceAttempt.submitAnswerLoading;
export const selectPracticeSubmitAnswerError = (state) => state.practiceAttempt.submitAnswerError;
export const selectPracticeSubmitAnswerLoadingByQuestionId = (state, questionId) => {
    if (questionId == null) return false;
    return Boolean(state.practiceAttempt.submitAnswerLoading[String(questionId)]);
};
export const selectPracticeSubmitAnswerErrorByQuestionId = (state, questionId) => {
    if (questionId == null) return null;
    return state.practiceAttempt.submitAnswerError[String(questionId)] || null;
};
export const selectPracticeSubmittedAnswer = (state) => state.practiceAttempt.submittedAnswer;
export const selectPracticeSubmitAttemptLoading = (state) => state.practiceAttempt.submitAttemptLoading;
export const selectPracticeSubmitAttemptError = (state) => state.practiceAttempt.submitAttemptError;
export const selectPracticeSubmittedAttempt = (state) => state.practiceAttempt.submittedAttempt;

export default practiceAttemptSlice.reducer;

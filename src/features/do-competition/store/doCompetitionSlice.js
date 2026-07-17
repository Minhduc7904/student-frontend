import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { doCompetitionService } from '../../../core/services/modules/doCompetitionService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const getSocketRemainingSeconds = (time) => {
    const directSeconds = Number(time?.remainingSeconds);
    if (Number.isFinite(directSeconds)) return Math.max(0, Math.floor(directSeconds));

    if (typeof time?.formattedRemaining === 'string') {
        const parts = time.formattedRemaining.split(':').map(Number);
        const isValid = parts.length >= 2 && parts.length <= 3 && parts.every(Number.isFinite);
        if (isValid) {
            const [hours, minutes, seconds = 0] = parts.length === 3 ? parts : [0, ...parts];
            return Math.max(0, hours * 3600 + minutes * 60 + seconds);
        }
    }

    const remainingMinutes = Number(time?.remainingMinutes);
    return Number.isFinite(remainingMinutes) ? Math.max(0, Math.floor(remainingMinutes * 60)) : 0;
};

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
    // Computed counts
    totalAnswered: 0,
    totalErrors: 0,
    // Submit answer
    submitAnswerLoading: false,
    submitAnswerError: null,
    // Finish submit
    finishSubmitLoading: false,
    finishSubmitError: null,
    finishSubmitResult: null,
    // Submit result
    submitResult: null,
    submitResultLoading: false,
    submitResultError: null,
    // Socket-first competition room state. Legacy REST screen does not depend on these fields.
    socketConnection: 'connecting',
    socketRemainingSeconds: 0,
    socketTimeInitialized: false,
    socketTimeSyncVersion: 0,
    socketTimeIsOver: false,
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
        try {
            const response = await doCompetitionService.startAttempt(competitionId);
            return response.data ? response.data : response;
        } catch (error) {
            const responseData = error?.response?.data;
            return thunkAPI.rejectWithValue({
                message: responseData?.message ?? error?.message ?? 'Không thể bắt đầu làm bài',
                code: responseData?.data?.code ?? responseData?.code ?? null,
                competitionSubmitId: responseData?.data?.competitionSubmitId ?? responseData?.competitionSubmitId ?? null,
            });
        }
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
 * Get result of a competition submit
 */
export const getSubmitResult = createAsyncThunk(
    'doCompetition/getSubmitResult',
    async (submitId, thunkAPI) => {
        return handleAsyncThunk(
            () => doCompetitionService.getSubmitResult(submitId),
            thunkAPI,
            {
                showSuccess: false,
                showError: true,
                errorTitle: 'Tải kết quả bài thi thất bại',
            }
        );
    }
);

/**
 * Finish a competition submit
 */
export const finishCompetition = createAsyncThunk(
    'doCompetition/finishSubmit',
    async ({ submitId, homeworkContentId }, thunkAPI) => {
        const body = homeworkContentId ? { homeworkContentId } : {};
        return handleAsyncThunk(
            () => doCompetitionService.finishSubmit(submitId, body),
            thunkAPI,
            {
                showSuccess: false,
                showError: true,
                errorTitle: 'Nộp bài thất bại',
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
 * Helper: tính totalAnswered & totalErrors từ sections + unassignedQuestions
 */
const recomputeCounts = (state) => {
    let answered = 0;
    let errors = 0;
    const count = (q) => {
        if (q.answer?.isAnswered && q.answerSyncStatus !== 'pending' && q.answerSyncStatus !== 'error') answered++;
        if (q.isSubmitError) errors++;
    };
    state.sections.forEach((s) => (s.questions ?? []).forEach(count));
    state.unassignedQuestions.forEach(count);
    state.totalAnswered = answered;
    state.totalErrors = errors;
};

/**
 * Do Competition Slice
 */
const doCompetitionSlice = createSlice({
    name: 'doCompetition',
    initialState,
    reducers: {
        resetCompetitionAttemptState: () => ({ ...initialState }),
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
            recomputeCounts(state);
        },
        socketConnectionChanged: (state, action) => {
            state.socketConnection = action.payload;
        },
        socketExamLoaded: (state, action) => {
            const event = action.payload ?? {};
            const data = event.exam ?? event;
            // Socket consumers can dispatch either the full event or its `exam` property.
            const examData = data.exam ?? data;
            state.competition = event.competition ?? data.competition ?? state.competition ?? null;
            state.exam = {
                examId: examData.examId,
                title: examData.title,
                description: examData.description,
                totalQuestions: examData.totalQuestions,
            };
            const savedAnswers = {};
            const currentQuestions = {};
            state.answers.forEach((answer) => {
                savedAnswers[answer.questionId] = answer;
            });
            state.sections.forEach((section) => (section.questions ?? []).forEach((question) => {
                currentQuestions[question.questionId] = question;
            }));
            state.unassignedQuestions.forEach((question) => {
                currentQuestions[question.questionId] = question;
            });
            const hydrateQuestion = (question) => {
                const currentQuestion = currentQuestions[question.questionId];
                if (currentQuestion?.answerSyncStatus === 'pending' || currentQuestion?.answerSyncStatus === 'error') {
                    return {
                        ...question,
                        answer: currentQuestion.answer,
                        answerRevision: currentQuestion.answerRevision,
                        answerSyncStatus: currentQuestion.answerSyncStatus,
                        isSubmitError: currentQuestion.isSubmitError,
                    };
                }
                const answer = savedAnswers[question.questionId] ?? question.answer ?? null;
                return {
                    ...question,
                    answer,
                    answerSyncStatus: answer?.isAnswered ? 'saved' : question.answerSyncStatus ?? 'idle',
                };
            };
            state.sections = (examData.sections ?? []).map((section) => ({
                ...section,
                questions: (section.questions ?? []).map(hydrateQuestion),
            }));
            state.unassignedQuestions = (examData.questions ?? []).map(hydrateQuestion);
            state.examLoading = false;
            state.examError = null;
            recomputeCounts(state);
        },
        socketAttemptSubscribed: (state, action) => {
            const answers = action.payload?.answers ?? [];
            const answersMap = {};
            answers.forEach((answer) => {
                answersMap[answer.questionId] = answer;
            });

            const hydrateQuestion = (question) => {
                if (question.answerSyncStatus === 'pending' || question.answerSyncStatus === 'error') return question;
                const answer = answersMap[question.questionId] ?? null;
                return {
                    ...question,
                    answer,
                    answerSyncStatus: answer?.isAnswered ? 'saved' : 'idle',
                    isSubmitError: false,
                };
            };

            state.answers = answers;
            state.sections = state.sections.map((section) => ({
                ...section,
                questions: (section.questions ?? []).map(hydrateQuestion),
            }));
            state.unassignedQuestions = state.unassignedQuestions.map(hydrateQuestion);
            recomputeCounts(state);
        },
        socketTimeSynced: (state, action) => {
            const time = action.payload ?? {};
            const remainingSeconds = getSocketRemainingSeconds(time);
            state.socketRemainingSeconds = remainingSeconds;
            state.socketTimeInitialized = true;
            state.socketTimeSyncVersion += 1;
            state.socketTimeIsOver = time.isOverTime === true || remainingSeconds === 0;
        },
        socketTickTime: (state) => {
            if (state.socketRemainingSeconds > 0) state.socketRemainingSeconds -= 1;
        },
        socketAnswerChanged: (state, action) => {
            const { questionId, body, revision } = action.payload;
            const patchQuestion = (question) => {
                if (question.questionId !== questionId) return question;
                const answer = { ...(question.answer ?? {}), ...body };
                answer.isAnswered = Boolean(
                    answer.selectedStatementIds?.length ||
                    answer.trueFalseAnswers?.length ||
                    (answer.answer != null && answer.answer !== '')
                );
                return {
                    ...question,
                    answer,
                    answerRevision: revision,
                    answerSyncStatus: 'pending',
                    isSubmitError: false,
                };
            };
            state.sections = state.sections.map((section) => ({ ...section, questions: (section.questions ?? []).map(patchQuestion) }));
            state.unassignedQuestions = state.unassignedQuestions.map(patchQuestion);
            recomputeCounts(state);
        },
        socketAnswerSaved: (state, action) => {
            const { questionId, answer, revision } = action.payload;
            const patchQuestion = (question) => {
                if (question.questionId !== questionId) return question;
                const serverAnswer = answer ?? {};
                if ((question.answerRevision ?? 0) > revision) {
                    return {
                        ...question,
                        answer: { ...question.answer, competitionAnswerId: serverAnswer.competitionAnswerId ?? serverAnswer.answerId ?? question.answer?.competitionAnswerId },
                    };
                }
                const mergedAnswer = { ...question.answer, ...serverAnswer };
                return {
                    ...question,
                    answer: mergedAnswer,
                    answerSyncStatus: mergedAnswer.isAnswered ? 'saved' : 'idle',
                    isSubmitError: false,
                };
            };
            state.sections = state.sections.map((section) => ({ ...section, questions: (section.questions ?? []).map(patchQuestion) }));
            state.unassignedQuestions = state.unassignedQuestions.map(patchQuestion);
            recomputeCounts(state);
        },
        socketAnswerFailed: (state, action) => {
            const { questionId, revision } = action.payload;
            const patchQuestion = (question) => {
                if (question.questionId !== questionId || (question.answerRevision ?? 0) !== revision) return question;
                return { ...question, answerSyncStatus: 'error', isSubmitError: true };
            };
            state.sections = state.sections.map((section) => ({ ...section, questions: (section.questions ?? []).map(patchQuestion) }));
            state.unassignedQuestions = state.unassignedQuestions.map(patchQuestion);
            recomputeCounts(state);
        },
        socketFinishStarted: (state) => {
            state.finishSubmitLoading = true;
            state.finishSubmitError = null;
            state.finishSubmitResult = null;
        },
        socketFinishFailed: (state, action) => {
            state.finishSubmitLoading = false;
            state.finishSubmitError = action.payload;
        },
        socketFinishSucceeded: (state, action) => {
            state.finishSubmitLoading = false;
            state.finishSubmitError = null;
            state.finishSubmitResult = action.payload;
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
                state.currentAttempt = null;
            })
            .addCase(startCompetitionAttempt.fulfilled, (state, action) => {
                state.startAttemptLoading = false;
                state.currentAttempt = action.payload.data;
                state.loading = false;
            })
            .addCase(startCompetitionAttempt.rejected, (state, action) => {
                state.startAttemptLoading = false;
                state.startAttemptError = action.payload || action.error.message;
                state.currentAttempt = null;
            })
            // Get Remaining Time
            .addCase(getRemainingTime.pending, (state) => {
                state.remainingTimeLoading = true;
                state.remainingTimeError = null;
                state.remainingTime = null;
            })
            .addCase(getRemainingTime.fulfilled, (state, action) => {
                state.remainingTimeLoading = false;
                state.remainingTime = action.payload.data;
            })
            .addCase(getRemainingTime.rejected, (state, action) => {
                state.remainingTimeLoading = false;
                state.remainingTimeError = action.payload || action.error.message;
                state.remainingTime = null;
            })
            // Get Competition Exam
            .addCase(getCompetitionExam.pending, (state) => {
                state.examLoading = true;
                state.examError = null;
                state.competition = null;
                state.exam = null;
                state.sections = [];
                state.unassignedQuestions = [];
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
                state.competition = null;
                state.exam = null;
                state.sections = [];
                state.unassignedQuestions = [];
            })
            // Get Competition Answers
            .addCase(getCompetitionAnswers.pending, (state) => {
                state.answersLoading = true;
                state.answersError = null;
                state.answers = [];
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

                recomputeCounts(state);
            })
            .addCase(getCompetitionAnswers.rejected, (state, action) => {
                state.answersLoading = false;
                state.answersError = action.payload || action.error.message;
                state.answers = [];
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

                recomputeCounts(state);
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

                recomputeCounts(state);
            })
            // Finish Competition Submit
            .addCase(finishCompetition.pending, (state) => {
                state.finishSubmitLoading = true;
                state.finishSubmitError = null;
            })
            .addCase(finishCompetition.fulfilled, (state, action) => {
                state.finishSubmitLoading = false;
                state.finishSubmitResult = action.payload.data;
            })
            .addCase(finishCompetition.rejected, (state, action) => {
                state.finishSubmitLoading = false;
                state.finishSubmitError = action.payload || action.error.message;
            })
            // Get Submit Result
            .addCase(getSubmitResult.pending, (state) => {
                state.submitResultLoading = true;
                state.submitResultError = null;
                state.submitResult = null;
            })
            .addCase(getSubmitResult.fulfilled, (state, action) => {
                state.submitResultLoading = false;
                state.submitResult = action.payload.data;
            })
            .addCase(getSubmitResult.rejected, (state, action) => {
                state.submitResultLoading = false;
                state.submitResultError = action.payload || action.error.message;
                state.submitResult = null;
            });
    },
});

/**
 * Actions
 */
export const {
    resetCompetitionAttemptState,
    clearCurrentAttempt,
    setCurrentAttempt,
    clearRemainingTime,
    clearExam,
    clearAnswers,
    clearErrors,
    clearSubmitAnswerError,
    applyOptimisticAnswer,
    socketConnectionChanged,
    socketExamLoaded,
    socketAttemptSubscribed,
    socketTimeSynced,
    socketTickTime,
    socketAnswerChanged,
    socketAnswerSaved,
    socketAnswerFailed,
    socketFinishStarted,
    socketFinishFailed,
    socketFinishSucceeded,
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
export const selectFinishSubmitLoading = (state) => state.doCompetition.finishSubmitLoading;
export const selectFinishSubmitError = (state) => state.doCompetition.finishSubmitError;
export const selectFinishSubmitResult = (state) => state.doCompetition.finishSubmitResult;
export const selectSubmitResult = (state) => state.doCompetition.submitResult;
export const selectSubmitResultLoading = (state) => state.doCompetition.submitResultLoading;
export const selectSubmitResultError = (state) => state.doCompetition.submitResultError;
export const selectTotalAnswered = (state) => state.doCompetition.totalAnswered;
export const selectTotalErrors = (state) => state.doCompetition.totalErrors;
export const selectSocketConnection = (state) => state.doCompetition.socketConnection;
export const selectSocketRemainingSeconds = (state) => state.doCompetition.socketRemainingSeconds;
export const selectSocketTimeInitialized = (state) => state.doCompetition.socketTimeInitialized;
export const selectSocketTimeSyncVersion = (state) => state.doCompetition.socketTimeSyncVersion;
export const selectSocketTimeIsOver = (state) => state.doCompetition.socketTimeIsOver;

export default doCompetitionSlice.reducer;

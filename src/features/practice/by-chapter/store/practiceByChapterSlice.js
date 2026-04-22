import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examService } from '../../../../core/services/modules/examService';
import { chapterService } from '../../../../core/services/modules/chapterService';
import { questionService } from '../../../../core/services/modules/questionService';
import { questionAnswerService } from '../../../../core/services/modules/questionAnswerService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const createInitialChaptersFilters = () => ({
    page: 1,
    limit: 10,
    search: '',
});

const createInitialChaptersPagination = () => ({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
});

const createInitialQuestionsFilters = () => ({
    page: 1,
    limit: 10,
    subjectId: null,
    chapterIds: [],
    type: '',
    difficulty: '',
    grade: null,
    search: '',
});

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

const normalizeVietnameseText = (value) => {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .trim()
        .toLowerCase();
};

const pickDefaultMathSubjectId = (subjects = []) => {
    if (!Array.isArray(subjects) || subjects.length === 0) return null;

    const exactMathSubject = subjects.find((subject) => {
        const normalizedName = normalizeVietnameseText(subject?.name);
        return normalizedName === 'toan';
    });

    if (exactMathSubject) return exactMathSubject.subjectId;

    const containsMathSubject = subjects.find((subject) => {
        const normalizedName = normalizeVietnameseText(subject?.name);
        return normalizedName.startsWith('toan ') || normalizedName.includes(' toan') || normalizedName.includes('toan');
    });

    return containsMathSubject?.subjectId ?? null;
};

const mergeUniqueChapters = (previous = [], incoming = []) => {
    const chapterMap = new Map();

    previous.forEach((chapter) => {
        chapterMap.set(String(chapter.chapterId), chapter);
    });

    incoming.forEach((chapter) => {
        chapterMap.set(String(chapter.chapterId), chapter);
    });

    return Array.from(chapterMap.values());
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

const resolveChaptersPagination = (payload, fallbackQuery = {}, fallbackTotal = 0) => {
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

const normalizeSubjects = (payload) => {
    const subjects = resolveCollectionFromPayload(payload);

    return subjects
        .map((subject) => {
            const subjectId = subject?.subjectId ?? subject?.id;

            if (subjectId == null) return null;

            return {
                ...subject,
                subjectId: String(subjectId),
                name: subject?.name || subject?.subjectName || `Môn #${subjectId}`,
            };
        })
        .filter(Boolean);
};

const normalizeChapters = (payload) => {
    const chapters = resolveCollectionFromPayload(payload);

    return chapters
        .map((chapter, index) => {
            const chapterId = chapter?.chapterId ?? chapter?.id;

            if (chapterId == null) return null;

            return {
                ...chapter,
                chapterId: String(chapterId),
                chapterName:
                    chapter?.name ||
                    chapter?.chapterName ||
                    chapter?.title ||
                    `Chương ${index + 1}`,
            };
        })
        .filter(Boolean);
};

const normalizeChapterIds = (chapterIds) => {
    if (Array.isArray(chapterIds)) {
        return chapterIds
            .map((chapterId) => String(chapterId || '').trim())
            .filter(Boolean);
    }

    if (chapterIds == null || chapterIds === '') {
        return [];
    }

    return String(chapterIds)
        .split(',')
        .map((chapterId) => chapterId.trim())
        .filter(Boolean);
};

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

const createInitialState = () => ({
    subjects: [],
    chapters: [],
    questions: [],
    selectedSubjectId: null,
    selectedChapterId: null,
    chaptersFilters: createInitialChaptersFilters(),
    chaptersPagination: createInitialChaptersPagination(),
    questionsFilters: createInitialQuestionsFilters(),
    questionsPagination: createInitialQuestionsPagination(),
    loadingSubjects: false,
    loadingChapters: false,
    loadingQuestions: false,
    submitAnswerLoading: {},
    submitAnswerError: {},
    subjectsError: null,
    chaptersError: null,
    questionsError: null,
    submittedAnswer: null,
});

const initialState = createInitialState();

export const fetchPracticeByChapterSubjects = createAsyncThunk(
    'practiceByChapter/fetchSubjects',
    async (query = {}, thunkAPI) => {
        const defaultQuery = {
            page: 1,
            limit: 100,
            sortBy: 'name',
            sortOrder: 'asc',
            ...query,
        };

        return handleAsyncThunk(
            () => examService.getSubjects(defaultQuery),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách môn học thất bại',
            }
        );
    }
);

export const fetchPracticeByChapterChapters = createAsyncThunk(
    'practiceByChapter/fetchChapters',
    async (payload = {}, thunkAPI) => {
        const request = typeof payload === 'object' ? payload : { subjectId: payload };
        const normalizedSubjectId = request?.subjectId ? String(request.subjectId) : null;

        if (!normalizedSubjectId) {
            return thunkAPI.rejectWithValue('Thiếu mã môn học để tải chương');
        }

        const query = {
            page: toSafeNumber(request?.page, 1),
            limit: toSafeNumber(request?.limit, 10),
            search: String(request?.search || '').trim(),
        };

        return handleAsyncThunk(
            () => chapterService.getPublicStudentChaptersBySubject(normalizedSubjectId, query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách chương thất bại',
            }
        );
    }
);

export const fetchPracticeByChapterQuestions = createAsyncThunk(
    'practiceByChapter/fetchQuestions',
    async (payload = {}, thunkAPI) => {
        const request = typeof payload === 'object' ? payload : {};
        const chapterIds = normalizeChapterIds(request?.chapterIds);
        const query = {
            page: toSafeNumber(request?.page, 1),
            limit: toSafeNumber(request?.limit, 10),
            subjectId: request?.subjectId != null ? String(request.subjectId) : undefined,
            chapterIds: chapterIds.length ? chapterIds : undefined,
            type: request?.type ? String(request.type).trim() : undefined,
            difficulty: request?.difficulty ? String(request.difficulty).trim() : undefined,
            grade: request?.grade != null && request?.grade !== '' ? request.grade : undefined,
            search: String(request?.search || '').trim() || undefined,
        };

        return handleAsyncThunk(
            () => questionService.getPublicStudentQuestions(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách câu hỏi thất bại',
            }
        );
    }
);

export const submitPracticeByChapterQuestionAnswer = createAsyncThunk(
    'practiceByChapter/submitPublicStudentQuestionAnswer',
    async (payload = {}, thunkAPI) => {
        const request = typeof payload === 'object' && payload !== null ? payload : {};

        const sanitizedPayload = {
            ...request,
            // Practice by chapter must submit without attemptId.
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

const practiceByChapterSlice = createSlice({
    name: 'practiceByChapter',
    initialState,
    reducers: {
        setSelectedSubjectId: (state, action) => {
            state.selectedSubjectId = action.payload ? String(action.payload) : null;
            state.selectedChapterId = null;
            state.chapters = [];
            state.chaptersError = null;
            state.questions = [];
            state.questionsError = null;
            state.submitAnswerLoading = {};
            state.submitAnswerError = {};
            state.submittedAnswer = null;
            state.chaptersFilters.page = 1;
            state.questionsFilters = {
                ...createInitialQuestionsFilters(),
                subjectId: state.selectedSubjectId,
                limit: state.questionsFilters.limit,
            };
            state.chaptersPagination = {
                ...createInitialChaptersPagination(),
                limit: state.chaptersFilters.limit,
            };
            state.questionsPagination = {
                ...createInitialQuestionsPagination(),
                limit: state.questionsFilters.limit,
            };
        },
        setSelectedChapterId: (state, action) => {
            state.selectedChapterId = action.payload ? String(action.payload) : null;
        },
        setChaptersFilters: (state, action) => {
            state.chaptersFilters = { ...state.chaptersFilters, ...action.payload };
        },
        resetChaptersFilters: (state) => {
            state.chaptersFilters = createInitialChaptersFilters();
        },
        setChaptersPagination: (state, action) => {
            state.chaptersPagination = { ...state.chaptersPagination, ...action.payload };
        },
        setQuestionsFilters: (state, action) => {
            const nextFilters = { ...state.questionsFilters, ...action.payload };
            nextFilters.chapterIds = normalizeChapterIds(nextFilters.chapterIds);
            if (nextFilters.subjectId != null && nextFilters.subjectId !== '') {
                nextFilters.subjectId = String(nextFilters.subjectId);
            }
            state.questionsFilters = nextFilters;
        },
        resetQuestionsFilters: (state) => {
            state.questionsFilters = {
                ...createInitialQuestionsFilters(),
                subjectId: state.selectedSubjectId,
                limit: state.questionsFilters.limit,
            };
        },
        setQuestionsPagination: (state, action) => {
            state.questionsPagination = { ...state.questionsPagination, ...action.payload };
        },
        clearPracticeByChapterState: () => createInitialState(),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPracticeByChapterSubjects.pending, (state) => {
                state.loadingSubjects = true;
                state.subjectsError = null;
            })
            .addCase(fetchPracticeByChapterSubjects.fulfilled, (state, action) => {
                const subjects = normalizeSubjects(action.payload);
                const selectedStillExists = subjects.some(
                    (subject) => subject.subjectId === state.selectedSubjectId
                );

                state.loadingSubjects = false;
                state.subjects = subjects;
                state.subjectsError = null;

                if (!subjects.length) {
                    state.selectedSubjectId = null;
                    state.selectedChapterId = null;
                    state.chapters = [];
                    state.questions = [];
                    return;
                }

                if (!selectedStillExists) {
                    state.selectedSubjectId = pickDefaultMathSubjectId(subjects) ?? subjects[0].subjectId;
                }

                state.questionsFilters.subjectId = state.selectedSubjectId;
            })
            .addCase(fetchPracticeByChapterSubjects.rejected, (state, action) => {
                state.loadingSubjects = false;
                state.subjectsError = action.payload || action.error.message;
                state.subjects = [];
                state.selectedSubjectId = null;
                state.selectedChapterId = null;
                state.chapters = [];
                state.questions = [];
                state.chaptersFilters = createInitialChaptersFilters();
                state.chaptersPagination = createInitialChaptersPagination();
                state.questionsFilters = createInitialQuestionsFilters();
                state.questionsPagination = createInitialQuestionsPagination();
                state.submitAnswerLoading = {};
                state.submitAnswerError = {};
                state.submittedAnswer = null;
            })
            .addCase(fetchPracticeByChapterChapters.pending, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, state.chaptersFilters.limit);

                state.loadingChapters = true;
                state.chaptersError = null;
                state.chaptersFilters.page = requestedPage;
                state.chaptersFilters.limit = requestedLimit;

                if (requestedPage === 1) {
                    state.chapters = [];
                    state.selectedChapterId = null;
                    state.chaptersPagination = {
                        ...createInitialChaptersPagination(),
                        limit: requestedLimit,
                    };
                }
            })
            .addCase(fetchPracticeByChapterChapters.fulfilled, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, state.chaptersFilters.limit);
                const chapters = normalizeChapters(action.payload);
                const mergedChapters =
                    requestedPage === 1 ? chapters : mergeUniqueChapters(state.chapters, chapters);
                const selectedStillExists = mergedChapters.some(
                    (chapter) => chapter.chapterId === state.selectedChapterId
                );
                const normalizedPagination = resolveChaptersPagination(
                    action.payload,
                    { page: requestedPage, limit: requestedLimit },
                    mergedChapters.length
                );

                state.loadingChapters = false;
                state.chaptersError = null;
                state.chapters = mergedChapters;
                state.chaptersFilters.page = normalizedPagination.page;
                state.chaptersFilters.limit = normalizedPagination.limit;
                state.chaptersPagination = normalizedPagination;

                if (!mergedChapters.length) {
                    state.selectedChapterId = null;
                    return;
                }

                if (!selectedStillExists) {
                    state.selectedChapterId = mergedChapters[0].chapterId;
                }
            })
            .addCase(fetchPracticeByChapterChapters.rejected, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);

                state.loadingChapters = false;
                state.chaptersError = action.payload || action.error.message;

                if (requestedPage === 1) {
                    state.chapters = [];
                    state.selectedChapterId = null;
                    state.chaptersPagination = {
                        ...createInitialChaptersPagination(),
                        limit: state.chaptersFilters.limit,
                    };
                }
            })
            .addCase(fetchPracticeByChapterQuestions.pending, (state, action) => {
                const requestedChapterIds = normalizeChapterIds(action.meta.arg?.chapterIds);
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, state.questionsFilters.limit);
                const requestedSubjectId =
                    action.meta.arg?.subjectId != null
                        ? String(action.meta.arg.subjectId)
                        : state.selectedSubjectId;

                state.loadingQuestions = true;
                state.questionsError = null;
                state.questionsFilters = {
                    ...state.questionsFilters,
                    page: requestedPage,
                    limit: requestedLimit,
                    subjectId: requestedSubjectId,
                    chapterIds: requestedChapterIds,
                    type: action.meta.arg?.type ? String(action.meta.arg.type).trim() : '',
                    difficulty: action.meta.arg?.difficulty ? String(action.meta.arg.difficulty).trim() : '',
                    grade: action.meta.arg?.grade ?? null,
                    search: String(action.meta.arg?.search || '').trim(),
                };

                if (requestedPage === 1) {
                    state.questions = [];
                    state.questionsPagination = {
                        ...createInitialQuestionsPagination(),
                        limit: requestedLimit,
                    };
                }
            })
            .addCase(fetchPracticeByChapterQuestions.fulfilled, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);
                const requestedLimit = toSafeNumber(action.meta.arg?.limit, state.questionsFilters.limit);
                const questions = normalizeQuestions(action.payload);
                const mergedQuestions =
                    requestedPage === 1
                        ? questions
                        : mergeUniqueByKey(state.questions, questions, 'questionId');
                const normalizedPagination = resolveChaptersPagination(
                    action.payload,
                    { page: requestedPage, limit: requestedLimit },
                    mergedQuestions.length
                );

                state.loadingQuestions = false;
                state.questionsError = null;
                state.questions = mergedQuestions;
                state.questionsFilters.page = normalizedPagination.page;
                state.questionsFilters.limit = normalizedPagination.limit;
                state.questionsPagination = normalizedPagination;
            })
            .addCase(fetchPracticeByChapterQuestions.rejected, (state, action) => {
                const requestedPage = toSafeNumber(action.meta.arg?.page, 1);

                state.loadingQuestions = false;
                state.questionsError = action.payload || action.error.message;

                if (requestedPage === 1) {
                    state.questions = [];
                    state.questionsPagination = {
                        ...createInitialQuestionsPagination(),
                        limit: state.questionsFilters.limit,
                    };
                }
            })
            .addCase(submitPracticeByChapterQuestionAnswer.pending, (state, action) => {
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
            .addCase(submitPracticeByChapterQuestionAnswer.fulfilled, (state, action) => {
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
            .addCase(submitPracticeByChapterQuestionAnswer.rejected, (state, action) => {
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
    setSelectedSubjectId,
    setSelectedChapterId,
    setChaptersFilters,
    resetChaptersFilters,
    setChaptersPagination,
    setQuestionsFilters,
    resetQuestionsFilters,
    setQuestionsPagination,
    clearPracticeByChapterState,
} = practiceByChapterSlice.actions;

export const selectPracticeByChapterSubjects = (state) => state.practiceByChapter.subjects;
export const selectPracticeByChapterChapters = (state) => state.practiceByChapter.chapters;
export const selectPracticeByChapterQuestions = (state) => state.practiceByChapter.questions;
export const selectPracticeByChapterSelectedSubjectId = (state) => state.practiceByChapter.selectedSubjectId;
export const selectPracticeByChapterSelectedChapterId = (state) => state.practiceByChapter.selectedChapterId;
export const selectPracticeByChapterChaptersFilters = (state) => state.practiceByChapter.chaptersFilters;
export const selectPracticeByChapterChaptersPagination = (state) => state.practiceByChapter.chaptersPagination;
export const selectPracticeByChapterQuestionsFilters = (state) => state.practiceByChapter.questionsFilters;
export const selectPracticeByChapterQuestionsPagination = (state) => state.practiceByChapter.questionsPagination;
export const selectPracticeByChapterLoadingSubjects = (state) => state.practiceByChapter.loadingSubjects;
export const selectPracticeByChapterLoadingChapters = (state) => state.practiceByChapter.loadingChapters;
export const selectPracticeByChapterLoadingQuestions = (state) => state.practiceByChapter.loadingQuestions;
export const selectPracticeByChapterSubmitAnswerLoading = (state) => state.practiceByChapter.submitAnswerLoading;
export const selectPracticeByChapterSubmitAnswerError = (state) => state.practiceByChapter.submitAnswerError;
export const selectPracticeByChapterSubmitAnswerLoadingByQuestionId = (state, questionId) => {
    if (questionId == null) return false;
    return Boolean(state.practiceByChapter.submitAnswerLoading[String(questionId)]);
};
export const selectPracticeByChapterSubmitAnswerErrorByQuestionId = (state, questionId) => {
    if (questionId == null) return null;
    return state.practiceByChapter.submitAnswerError[String(questionId)] || null;
};
export const selectPracticeByChapterSubjectsError = (state) => state.practiceByChapter.subjectsError;
export const selectPracticeByChapterChaptersError = (state) => state.practiceByChapter.chaptersError;
export const selectPracticeByChapterQuestionsError = (state) => state.practiceByChapter.questionsError;
export const selectPracticeByChapterSubmittedAnswer = (state) => state.practiceByChapter.submittedAnswer;

export default practiceByChapterSlice.reducer;

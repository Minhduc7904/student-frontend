import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examService } from '../../../../core/services/modules/examService';
import { chapterService } from '../../../../core/services/modules/chapterService';
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

const createInitialState = () => ({
    subjects: [],
    chapters: [],
    selectedSubjectId: null,
    selectedChapterId: null,
    chaptersFilters: createInitialChaptersFilters(),
    chaptersPagination: createInitialChaptersPagination(),
    loadingSubjects: false,
    loadingChapters: false,
    subjectsError: null,
    chaptersError: null,
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

const practiceByChapterSlice = createSlice({
    name: 'practiceByChapter',
    initialState,
    reducers: {
        setSelectedSubjectId: (state, action) => {
            state.selectedSubjectId = action.payload ? String(action.payload) : null;
            state.selectedChapterId = null;
            state.chapters = [];
            state.chaptersError = null;
            state.chaptersFilters.page = 1;
            state.chaptersPagination = {
                ...createInitialChaptersPagination(),
                limit: state.chaptersFilters.limit,
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
                    return;
                }

                if (!selectedStillExists) {
                    state.selectedSubjectId = pickDefaultMathSubjectId(subjects) ?? subjects[0].subjectId;
                }
            })
            .addCase(fetchPracticeByChapterSubjects.rejected, (state, action) => {
                state.loadingSubjects = false;
                state.subjectsError = action.payload || action.error.message;
                state.subjects = [];
                state.selectedSubjectId = null;
                state.selectedChapterId = null;
                state.chapters = [];
                state.chaptersFilters = createInitialChaptersFilters();
                state.chaptersPagination = createInitialChaptersPagination();
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
            });
    },
});

export const {
    setSelectedSubjectId,
    setSelectedChapterId,
    setChaptersFilters,
    resetChaptersFilters,
    setChaptersPagination,
    clearPracticeByChapterState,
} = practiceByChapterSlice.actions;

export const selectPracticeByChapterSubjects = (state) => state.practiceByChapter.subjects;
export const selectPracticeByChapterChapters = (state) => state.practiceByChapter.chapters;
export const selectPracticeByChapterSelectedSubjectId = (state) => state.practiceByChapter.selectedSubjectId;
export const selectPracticeByChapterSelectedChapterId = (state) => state.practiceByChapter.selectedChapterId;
export const selectPracticeByChapterChaptersFilters = (state) => state.practiceByChapter.chaptersFilters;
export const selectPracticeByChapterChaptersPagination = (state) => state.practiceByChapter.chaptersPagination;
export const selectPracticeByChapterLoadingSubjects = (state) => state.practiceByChapter.loadingSubjects;
export const selectPracticeByChapterLoadingChapters = (state) => state.practiceByChapter.loadingChapters;
export const selectPracticeByChapterSubjectsError = (state) => state.practiceByChapter.subjectsError;
export const selectPracticeByChapterChaptersError = (state) => state.practiceByChapter.chaptersError;

export default practiceByChapterSlice.reducer;

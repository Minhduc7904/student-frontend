import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examService } from '../../../core/services/modules/examService';
import { examAttemptService } from '../../../core/services/modules/examAttemptService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

export const fetchPublicExamTypeCounts = createAsyncThunk(
    'exams/fetchPublicExamTypeCounts',
    async (_, thunkAPI) => {
        return handleAsyncThunk(
            () => examService.getPublicExamTypeCounts(),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay thong ke so luong de thi theo loai that bai',
            }
        );
    }
);

export const fetchPublicStudentExams = createAsyncThunk(
    'exams/fetchPublicStudentExams',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => examService.getPublicStudentExams(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay danh sach de thi public that bai',
            }
        );
    }
);

export const fetchSubjects = createAsyncThunk(
    'exams/fetchSubjects',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => examService.getSubjects(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay danh sach mon hoc that bai',
            }
        );
    }
);

export const fetchPublicStudentContinueExams = createAsyncThunk(
    'exams/fetchPublicStudentContinueExams',
    async (query = {}, thunkAPI) => {
        const normalizedQuery = {
            ...query,
            status: 'IN_PROGRESS',
        };

        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttempts(normalizedQuery),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay danh sach de dang lam that bai',
            }
        );
    }
);

export const fetchRecentExamAttemptsStats = createAsyncThunk(
    'exams/fetchRecentExamAttemptsStats',
    async (_, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttempts({ page: 1, limit: 10, status: 'SUBMITTED' }),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay thong ke 10 bai thi gan nhat that bai',
            }
        );
    }
);

const initialPublicExamsFilters = {
    page: 1,
    limit: 10,
    search: '',
    grade: null,
    typeOfExam: null,
    subjectId: null,
    sortBy: null,
    sortOrder: null,
};

const initialPublicExamsPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
    nextPage: null,
};

const initialSubjectsFilters = {
    page: 1,
    limit: 10,
    search: '',
    code: '',
    sortBy: null,
    sortOrder: null,
};

const initialSubjectsPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
    nextPage: null,
};

const initialContinueExamsFilters = {
    page: 1,
    limit: 3,
    examId: null,
};

const initialContinueExamsPagination = {
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
    nextPage: null,
};

const normalizeContinueExamsPayload = (payload) => {
    const root = payload || {};
    const resolved = root?.data || root;

    const items = Array.isArray(resolved?.data)
        ? resolved.data
        : Array.isArray(resolved?.items)
            ? resolved.items
            : Array.isArray(root?.data)
                ? root.data
            : Array.isArray(resolved)
                ? resolved
                : [];

    const pagination = {
        ...initialContinueExamsPagination,
        ...(root?.meta || resolved?.meta || resolved?.pagination || {}),
    };

    if (!pagination.total && Array.isArray(items)) {
        pagination.total = items.length;
    }

    if (!pagination.totalPages && pagination.limit > 0) {
        pagination.totalPages = Math.ceil((pagination.total || 0) / pagination.limit);
    }

    return {
        items,
        pagination,
    };
};

const normalizeRecentExamAttemptsPayload = (payload) => {
    const root = payload || {};
    const resolved = root?.data || root;

    const items = Array.isArray(resolved?.data)
        ? resolved.data
        : Array.isArray(resolved?.items)
            ? resolved.items
            : Array.isArray(root?.data)
                ? root.data
                : Array.isArray(resolved)
                    ? resolved
                    : [];

    return Array.isArray(items) ? items : [];
};

const initialState = {
    exams: [],
    continueExams: [],
    recentExamAttemptsStats: [],
    publicExams: [],
    subjects: [],
    publicTypeCounts: {
        totalPublished: 0,
        items: [],
    },
    publicExamsFilters: initialPublicExamsFilters,
    publicExamsPagination: initialPublicExamsPagination,
    subjectsFilters: initialSubjectsFilters,
    subjectsPagination: initialSubjectsPagination,
    continueExamsFilters: initialContinueExamsFilters,
    continueExamsPagination: initialContinueExamsPagination,
    hasFetchedPublicExams: false,
    hasFetchedPublicTypeCounts: false,
    hasFetchedSubjects: false,
    hasFetchedContinueExams: false,
    hasFetchedRecentExamAttemptsStats: false,
    loading: false,
    loadingPublicExams: false,
    loadingSubjects: false,
    loadingContinueExams: false,
    loadingRecentExamAttemptsStats: false,
    error: null,
    publicExamsError: null,
    subjectsError: null,
    continueExamsError: null,
    recentExamAttemptsStatsError: null,
};

const examsSlice = createSlice({
    name: 'exams',
    initialState,
    reducers: {
        setExams: (state, action) => {
            state.exams = action.payload;
        },
        setContinueExams: (state, action) => {
            state.continueExams = action.payload;
        },
        setRecentExamAttemptsStats: (state, action) => {
            state.recentExamAttemptsStats = Array.isArray(action.payload) ? action.payload : [];
            state.hasFetchedRecentExamAttemptsStats = true;
        },
        setPublicExams: (state, action) => {
            state.publicExams = Array.isArray(action.payload) ? action.payload : [];
            state.hasFetchedPublicExams = true;
        },
        setSubjects: (state, action) => {
            state.subjects = Array.isArray(action.payload) ? action.payload : [];
            state.hasFetchedSubjects = true;
        },
        setPublicTypeCounts: (state, action) => {
            state.publicTypeCounts = action.payload;
            state.hasFetchedPublicTypeCounts = true;
        },
        setPublicExamsFilters: (state, action) => {
            state.publicExamsFilters = {
                ...state.publicExamsFilters,
                ...action.payload,
            };
        },
        resetPublicExamsFilters: (state) => {
            state.publicExamsFilters = initialPublicExamsFilters;
        },
        setPublicExamsPagination: (state, action) => {
            state.publicExamsPagination = {
                ...state.publicExamsPagination,
                ...action.payload,
            };
        },
        resetPublicExamsPagination: (state) => {
            state.publicExamsPagination = initialPublicExamsPagination;
        },
        setSubjectsFilters: (state, action) => {
            state.subjectsFilters = {
                ...state.subjectsFilters,
                ...action.payload,
            };
        },
        resetSubjectsFilters: (state) => {
            state.subjectsFilters = initialSubjectsFilters;
        },
        setSubjectsPagination: (state, action) => {
            state.subjectsPagination = {
                ...state.subjectsPagination,
                ...action.payload,
            };
        },
        resetSubjectsPagination: (state) => {
            state.subjectsPagination = initialSubjectsPagination;
        },
        setContinueExamsFilters: (state, action) => {
            state.continueExamsFilters = {
                ...state.continueExamsFilters,
                ...action.payload,
            };
        },
        resetContinueExamsFilters: (state) => {
            state.continueExamsFilters = initialContinueExamsFilters;
        },
        setContinueExamsPagination: (state, action) => {
            state.continueExamsPagination = {
                ...state.continueExamsPagination,
                ...action.payload,
            };
        },
        resetContinueExamsPagination: (state) => {
            state.continueExamsPagination = initialContinueExamsPagination;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetExamsState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicExamTypeCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicExamTypeCounts.fulfilled, (state, action) => {
                state.loading = false;

                const payload = action.payload;
                const normalizedCounts = payload?.items
                    ? payload
                    : payload?.data?.items
                        ? payload.data
                        : { totalPublished: 0, items: [] };

                state.publicTypeCounts = {
                    totalPublished: normalizedCounts?.totalPublished || 0,
                    items: Array.isArray(normalizedCounts?.items) ? normalizedCounts.items : [],
                };
                state.hasFetchedPublicTypeCounts = true;
            })
            .addCase(fetchPublicExamTypeCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.hasFetchedPublicTypeCounts = false;
            })
            .addCase(fetchPublicStudentExams.pending, (state) => {
                state.loadingPublicExams = true;
                state.publicExamsError = null;
            })
            .addCase(fetchPublicStudentExams.fulfilled, (state, action) => {
                state.loadingPublicExams = false;

                const payload = action.payload || {};
                state.publicExams = Array.isArray(payload?.data) ? payload.data : [];
                state.publicExamsPagination = {
                    ...initialPublicExamsPagination,
                    ...(payload?.meta || {}),
                };

                const argQuery = action.meta?.arg || {};
                state.publicExamsFilters = {
                    ...state.publicExamsFilters,
                    ...argQuery,
                };
                state.hasFetchedPublicExams = true;
            })
            .addCase(fetchPublicStudentExams.rejected, (state, action) => {
                state.loadingPublicExams = false;
                state.publicExamsError = action.payload || action.error.message;
                state.hasFetchedPublicExams = false;
            })
            .addCase(fetchSubjects.pending, (state) => {
                state.loadingSubjects = true;
                state.subjectsError = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loadingSubjects = false;

                const payload = action.payload || {};
                state.subjects = Array.isArray(payload?.data) ? payload.data : [];
                state.subjectsPagination = {
                    ...initialSubjectsPagination,
                    ...(payload?.meta || {}),
                };

                const argQuery = action.meta?.arg || {};
                state.subjectsFilters = {
                    ...state.subjectsFilters,
                    ...argQuery,
                };
                state.hasFetchedSubjects = true;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loadingSubjects = false;
                state.subjectsError = action.payload || action.error.message;
                state.hasFetchedSubjects = false;
            })
            .addCase(fetchPublicStudentContinueExams.pending, (state) => {
                state.loadingContinueExams = true;
                state.continueExamsError = null;
            })
            .addCase(fetchPublicStudentContinueExams.fulfilled, (state, action) => {
                state.loadingContinueExams = false;

                const normalized = normalizeContinueExamsPayload(action.payload);
                state.continueExams = normalized.items;
                state.continueExamsPagination = normalized.pagination;

                const argQuery = action.meta?.arg || {};
                state.continueExamsFilters = {
                    ...state.continueExamsFilters,
                    ...argQuery,
                };

                state.hasFetchedContinueExams = true;
            })
            .addCase(fetchPublicStudentContinueExams.rejected, (state, action) => {
                state.loadingContinueExams = false;
                state.continueExamsError = action.payload || action.error.message;
                state.hasFetchedContinueExams = false;
            })
            .addCase(fetchRecentExamAttemptsStats.pending, (state) => {
                state.loadingRecentExamAttemptsStats = true;
                state.recentExamAttemptsStatsError = null;
            })
            .addCase(fetchRecentExamAttemptsStats.fulfilled, (state, action) => {
                state.loadingRecentExamAttemptsStats = false;
                state.recentExamAttemptsStats = normalizeRecentExamAttemptsPayload(action.payload);
                state.hasFetchedRecentExamAttemptsStats = true;
            })
            .addCase(fetchRecentExamAttemptsStats.rejected, (state, action) => {
                state.loadingRecentExamAttemptsStats = false;
                state.recentExamAttemptsStatsError = action.payload || action.error.message;
                state.hasFetchedRecentExamAttemptsStats = false;
            });
    },
});

export const {
    setExams,
    setContinueExams,
    setRecentExamAttemptsStats,
    setPublicExams,
    setSubjects,
    setPublicTypeCounts,
    setPublicExamsFilters,
    resetPublicExamsFilters,
    setPublicExamsPagination,
    resetPublicExamsPagination,
    setSubjectsFilters,
    resetSubjectsFilters,
    setSubjectsPagination,
    resetSubjectsPagination,
    setContinueExamsFilters,
    resetContinueExamsFilters,
    setContinueExamsPagination,
    resetContinueExamsPagination,
    setLoading,
    setError,
    resetExamsState,
} = examsSlice.actions;

export const selectExams = (state) => state.exams.exams;
export const selectContinueExams = (state) => state.exams.continueExams;
export const selectRecentExamAttemptsStats = (state) => state.exams.recentExamAttemptsStats;
export const selectPublicExams = (state) => state.exams.publicExams;
export const selectSubjects = (state) => state.exams.subjects;
export const selectPublicExamTypeCounts = (state) => state.exams.publicTypeCounts;
export const selectPublicExamsFilters = (state) => state.exams.publicExamsFilters;
export const selectPublicExamsPagination = (state) => state.exams.publicExamsPagination;
export const selectSubjectsFilters = (state) => state.exams.subjectsFilters;
export const selectSubjectsPagination = (state) => state.exams.subjectsPagination;
export const selectContinueExamsFilters = (state) => state.exams.continueExamsFilters;
export const selectContinueExamsPagination = (state) => state.exams.continueExamsPagination;
export const selectHasFetchedPublicExams = (state) => state.exams.hasFetchedPublicExams;
export const selectHasFetchedPublicExamTypeCounts = (state) => state.exams.hasFetchedPublicTypeCounts;
export const selectHasFetchedSubjects = (state) => state.exams.hasFetchedSubjects;
export const selectHasFetchedContinueExams = (state) => state.exams.hasFetchedContinueExams;
export const selectHasFetchedRecentExamAttemptsStats = (state) => state.exams.hasFetchedRecentExamAttemptsStats;
export const selectExamsLoading = (state) => state.exams.loading;
export const selectExamsError = (state) => state.exams.error;
export const selectPublicExamsLoading = (state) => state.exams.loadingPublicExams;
export const selectPublicExamsError = (state) => state.exams.publicExamsError;
export const selectSubjectsLoading = (state) => state.exams.loadingSubjects;
export const selectSubjectsError = (state) => state.exams.subjectsError;
export const selectContinueExamsLoading = (state) => state.exams.loadingContinueExams;
export const selectContinueExamsError = (state) => state.exams.continueExamsError;
export const selectRecentExamAttemptsStatsLoading = (state) => state.exams.loadingRecentExamAttemptsStats;
export const selectRecentExamAttemptsStatsError = (state) => state.exams.recentExamAttemptsStatsError;

export default examsSlice.reducer;

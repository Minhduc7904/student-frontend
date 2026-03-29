import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examService } from '../../../../core/services/modules/examService';
import { examAttemptService } from '../../../../core/services/modules/examAttemptService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const createDefaultExamAttemptsPagination = () => ({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
});

const sortByOrderAsc = (items = []) => {
    return [...items].sort((a, b) => {
        const aOrder = a?.order;
        const bOrder = b?.order;

        if (aOrder == null && bOrder == null) return 0;
        if (aOrder == null) return 1;
        if (bOrder == null) return -1;

        return Number(aOrder) - Number(bOrder);
    });
};

const normalizeExamPayload = (examPayload) => {
    if (!examPayload) {
        return {
            examInfo: null,
            sections: [],
            questions: [],
            sectionQuestions: {},
            sectionsWithQuestions: [],
            otherSection: null,
            totalQuestions: 0,
        };
    }

    const { sections: rawSections = [], questions: rawQuestions = [], ...examInfo } = examPayload;

    const sections = sortByOrderAsc(Array.isArray(rawSections) ? rawSections : []);
    const questions = sortByOrderAsc(Array.isArray(rawQuestions) ? rawQuestions : []);

    const sectionQuestions = sections.reduce((acc, section) => {
        const key = String(section?.sectionId);
        acc[key] = [];
        return acc;
    }, {});

    const otherQuestions = [];

    questions.forEach((question) => {
        const key = question?.sectionId == null ? null : String(question.sectionId);

        if (key && Object.prototype.hasOwnProperty.call(sectionQuestions, key)) {
            sectionQuestions[key].push(question);
            return;
        }

        otherQuestions.push(question);
    });

    const sectionsWithQuestions = sections.map((section) => {
        const key = String(section?.sectionId);

        return {
            ...section,
            questions: sectionQuestions[key] ?? [],
        };
    });

    const otherSection = otherQuestions.length
        ? {
            sectionId: 'other',
            title: 'Khác',
            description: null,
            processedDescription: null,
            order: sections.length + 1,
            isSystemSection: true,
            questions: otherQuestions,
        }
        : null;

    if (otherSection) {
        sectionsWithQuestions.push(otherSection);
    }

    return {
        examInfo,
        sections,
        questions,
        sectionQuestions,
        sectionsWithQuestions,
        otherSection,
        totalQuestions: questions.length,
    };
};

const toNumberOrFallback = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeExamAttemptsPayload = (payload, request = {}) => {
    const resolved = payload?.data || payload || null;

    const items = Array.isArray(resolved)
        ? resolved
        : Array.isArray(resolved?.data)
            ? resolved.data
            : Array.isArray(resolved?.items)
                ? resolved.items
                : Array.isArray(resolved?.content)
                    ? resolved.content
                    : [];

    const fallbackPage = toNumberOrFallback(request?.page, 1);
    const fallbackLimit = toNumberOrFallback(request?.limit, 10);
    const paginationSource = resolved?.pagination || resolved?.meta?.pagination || resolved?.meta || {};

    const page = toNumberOrFallback(
        paginationSource?.page ?? paginationSource?.currentPage,
        fallbackPage
    );
    const limit = toNumberOrFallback(
        paginationSource?.limit ?? paginationSource?.pageSize,
        fallbackLimit
    );
    const total = toNumberOrFallback(
        paginationSource?.total ?? paginationSource?.totalItems ?? paginationSource?.itemCount,
        items.length
    );
    const computedTotalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
    const totalPages = toNumberOrFallback(
        paginationSource?.totalPages ?? paginationSource?.pageCount,
        computedTotalPages
    );

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: Boolean(paginationSource?.hasNextPage ?? (page < totalPages)),
            hasPrevPage: Boolean(paginationSource?.hasPrevPage ?? (page > 1)),
        },
    };
};

export const fetchPublicStudentExamDetail = createAsyncThunk(
    'examDetail/fetchPublicStudentExamDetail',
    async (examId, thunkAPI) => {
        return handleAsyncThunk(
            () => examService.getPublicStudentExamDetail(examId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay chi tiet de thi that bai',
            }
        );
    }
);

export const fetchPublicStudentExam = createAsyncThunk(
    'examDetail/fetchPublicStudentExam',
    async (examId, thunkAPI) => {
        return handleAsyncThunk(
            () => examService.getPublicStudentExam(examId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay noi dung de thi that bai',
            }
        );
    }
);

export const startPublicStudentExamAttempt = createAsyncThunk(
    'examDetail/startPublicStudentExamAttempt',
    async (body, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.startPublicStudentExamAttempt(body),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Bat dau lam de thi that bai',
            }
        );
    }
);

export const fetchPublicStudentExamAttempts = createAsyncThunk(
    'examDetail/fetchPublicStudentExamAttempts',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttemptsByExamId(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay lich su lam de thi that bai',
            }
        );
    }
);

export const fetchPublicStudentExamAttemptsByExamId = createAsyncThunk(
    'examDetail/fetchPublicStudentExamAttemptsByExamId',
    async ({ examId, page = 1, limit = 10 }, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttemptsByExamIdPaging(examId, page, limit),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay lich su lam de thi theo de that bai',
            }
        );
    }
);

const initialState = {
    examDetail: null,
    examContent: null,
    examContentInfo: null,
    sections: [],
    questions: [],
    sectionQuestions: {},
    sectionsWithQuestions: [],
    otherSection: null,
    totalQuestions: 0,
    loading: false,
    loadingExamContent: false,
    error: null,
    examContentError: null,
    currentExamId: null,
    currentExamContentId: null,
    examAttempts: null,
    examAttemptsPagination: createDefaultExamAttemptsPagination(),
    examAttemptsLoading: false,
    examAttemptsError: null,
    startedExamAttempt: null,
    startExamAttemptLoading: false,
    startExamAttemptError: null,
};

const examDetailSlice = createSlice({
    name: 'examDetail',
    initialState,
    reducers: {
        clearExamDetail: (state) => {
            state.examDetail = null;
            state.examContent = null;
            state.examContentInfo = null;
            state.sections = [];
            state.questions = [];
            state.sectionQuestions = {};
            state.sectionsWithQuestions = [];
            state.otherSection = null;
            state.totalQuestions = 0;
            state.error = null;
            state.examContentError = null;
            state.currentExamId = null;
            state.currentExamContentId = null;
            state.examAttempts = null;
            state.examAttemptsPagination = createDefaultExamAttemptsPagination();
            state.examAttemptsLoading = false;
            state.examAttemptsError = null;
            state.startedExamAttempt = null;
            state.startExamAttemptLoading = false;
            state.startExamAttemptError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicStudentExamDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicStudentExamDetail.fulfilled, (state, action) => {
                state.loading = false;

                const payload = action.payload;
                state.examDetail = payload?.data || payload || null;
                state.currentExamId = action.meta.arg || null;
            })
            .addCase(fetchPublicStudentExamDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchPublicStudentExam.pending, (state) => {
                state.loadingExamContent = true;
                state.examContentError = null;
                state.examContent = null;
                state.examContentInfo = null;
                state.sections = [];
                state.questions = [];
                state.sectionQuestions = {};
                state.sectionsWithQuestions = [];
                state.otherSection = null;
                state.totalQuestions = 0;
            })
            .addCase(fetchPublicStudentExam.fulfilled, (state, action) => {
                state.loadingExamContent = false;

                const payload = action.payload;
                const normalized = normalizeExamPayload(payload?.data || payload || null);

                state.examContent = payload?.data || payload || null;
                state.examContentInfo = normalized.examInfo;
                state.sections = normalized.sections;
                state.questions = normalized.questions;
                state.sectionQuestions = normalized.sectionQuestions;
                state.sectionsWithQuestions = normalized.sectionsWithQuestions;
                state.otherSection = normalized.otherSection;
                state.totalQuestions = normalized.totalQuestions;
                state.currentExamContentId = action.meta.arg || null;
            })
            .addCase(fetchPublicStudentExam.rejected, (state, action) => {
                state.loadingExamContent = false;
                state.examContentError = action.payload || action.error.message;
                state.examContent = null;
                state.examContentInfo = null;
                state.sections = [];
                state.questions = [];
                state.sectionQuestions = {};
                state.sectionsWithQuestions = [];
                state.otherSection = null;
                state.totalQuestions = 0;
            })
            .addCase(fetchPublicStudentExamAttempts.pending, (state) => {
                state.examAttemptsLoading = true;
                state.examAttemptsError = null;
            })
            .addCase(fetchPublicStudentExamAttempts.fulfilled, (state, action) => {
                const normalizedAttempts = normalizeExamAttemptsPayload(action.payload, action.meta.arg || {});

                state.examAttemptsLoading = false;
                state.examAttempts = normalizedAttempts.items;
                state.examAttemptsPagination = normalizedAttempts.pagination;
                state.examAttemptsError = null;
            })
            .addCase(fetchPublicStudentExamAttempts.rejected, (state, action) => {
                state.examAttemptsLoading = false;
                state.examAttemptsError = action.payload || action.error.message;
            })
            .addCase(fetchPublicStudentExamAttemptsByExamId.pending, (state) => {
                state.examAttemptsLoading = true;
                state.examAttemptsError = null;
            })
            .addCase(fetchPublicStudentExamAttemptsByExamId.fulfilled, (state, action) => {
                const normalizedAttempts = normalizeExamAttemptsPayload(action.payload, action.meta.arg || {});

                state.examAttemptsLoading = false;
                state.examAttempts = normalizedAttempts.items;
                state.examAttemptsPagination = normalizedAttempts.pagination;
                state.examAttemptsError = null;
            })
            .addCase(fetchPublicStudentExamAttemptsByExamId.rejected, (state, action) => {
                state.examAttemptsLoading = false;
                state.examAttemptsError = action.payload || action.error.message;
            })
            .addCase(startPublicStudentExamAttempt.pending, (state) => {
                state.startExamAttemptLoading = true;
                state.startExamAttemptError = null;
            })
            .addCase(startPublicStudentExamAttempt.fulfilled, (state, action) => {
                state.startExamAttemptLoading = false;
                state.startedExamAttempt = action.payload?.data || action.payload || null;
                state.startExamAttemptError = null;
            })
            .addCase(startPublicStudentExamAttempt.rejected, (state, action) => {
                state.startExamAttemptLoading = false;
                state.startExamAttemptError = action.payload || action.error.message;
            });
    },
});

export const { clearExamDetail } = examDetailSlice.actions;

export const selectExamDetail = (state) => state.examDetail.examDetail;
export const selectExamContent = (state) => state.examDetail.examContent;
export const selectExamContentInfo = (state) => state.examDetail.examContentInfo;
export const selectExamContentSections = (state) => state.examDetail.sections;
export const selectExamContentQuestions = (state) => state.examDetail.questions;
export const selectExamContentSectionQuestions = (state) => state.examDetail.sectionQuestions;
export const selectExamContentSectionsWithQuestions = (state) => state.examDetail.sectionsWithQuestions;
export const selectExamContentOtherSection = (state) => state.examDetail.otherSection;
export const selectExamContentTotalQuestions = (state) => state.examDetail.totalQuestions;
export const selectExamDetailLoading = (state) => state.examDetail.loading;
export const selectExamContentLoading = (state) => state.examDetail.loadingExamContent;
export const selectExamDetailError = (state) => state.examDetail.error;
export const selectExamContentError = (state) => state.examDetail.examContentError;
export const selectCurrentExamDetailId = (state) => state.examDetail.currentExamId;
export const selectCurrentExamContentId = (state) => state.examDetail.currentExamContentId;
export const selectPublicStudentExamAttempts = (state) => state.examDetail.examAttempts;
export const selectPublicStudentExamAttemptsPagination = (state) => state.examDetail.examAttemptsPagination;
export const selectPublicStudentExamAttemptsLoading = (state) => state.examDetail.examAttemptsLoading;
export const selectPublicStudentExamAttemptsError = (state) => state.examDetail.examAttemptsError;
export const selectStartedPublicStudentExamAttempt = (state) => state.examDetail.startedExamAttempt;
export const selectStartPublicStudentExamAttemptLoading = (state) => state.examDetail.startExamAttemptLoading;
export const selectStartPublicStudentExamAttemptError = (state) => state.examDetail.startExamAttemptError;

// Backward-compatible combined selector.
export const selectExamContentData = (state) => {
    const examInfo = state.examDetail.examContentInfo;

    if (!examInfo) return null;

    return {
        ...examInfo,
        sections: state.examDetail.sections,
        questions: state.examDetail.questions,
    };
};

export default examDetailSlice.reducer;

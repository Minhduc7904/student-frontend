import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { classSessionService } from '../../../core/services/modules/classSessionService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

/**
 * Class Session Filter Constants
 */
export const SESSION_FILTER = {
    ALL: 'ALL',
    PAST: 'PAST',
    TODAY: 'TODAY',
    UPCOMING: 'UPCOMING',
};

/**
 * Initial State
 */
const initialState = {
    mySessions: [],
    loadingMySessions: false,
    error: null,
    filters: {
        classId: null,
        sessionDateFrom: null,
        sessionDateTo: null,
        filterType: SESSION_FILTER.ALL, // ALL, PAST, TODAY, UPCOMING
        sortBy: 'sessionDate',
        sortOrder: 'desc',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
    },
};

/**
 * Async Thunks
 */
export const fetchMySessions = createAsyncThunk(
    'classSession/fetchMySessions',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => classSessionService.getMySessions(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách buổi học thất bại',
            }
        );
    }
);

/**
 * Class Session Slice
 */
const classSessionSlice = createSlice({
    name: 'classSession',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        resetPagination: (state) => {
            state.pagination = initialState.pagination;
        },
        clearSessions: (state) => {
            state.mySessions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch My Sessions
            .addCase(fetchMySessions.pending, (state, action) => {
                // Chỉ clear array khi là page 1 hoặc filter thay đổi
                const isFirstPage = action.meta.arg.page === 1;
                if (isFirstPage) {
                    state.mySessions = [];
                }
                state.loadingMySessions = true;
                state.error = null;
            })
            .addCase(fetchMySessions.fulfilled, (state, action) => {
                state.loadingMySessions = false;
                const isFirstPage = action.meta.arg.page === 1;

                // Nếu là page 1, thay thế; nếu không, append (cho infinite scroll)
                if (isFirstPage) {
                    state.mySessions = action.payload.data;
                } else {
                    state.mySessions = [...state.mySessions, ...action.payload.data];
                }

                state.pagination = action.payload.meta;
            })
            .addCase(fetchMySessions.rejected, (state, action) => {
                const isFirstPage = action.meta.arg.page === 1;
                if (isFirstPage) {
                    state.mySessions = [];
                }
                state.loadingMySessions = false;
                state.error = action.payload || action.error.message;
            });
    },
});

/**
 * Actions
 */
export const {
    setFilters,
    resetFilters,
    setPagination,
    resetPagination,
    clearSessions,
} = classSessionSlice.actions;

/**
 * Selectors
 */
export const selectMySessions = (state) => state.classSession.mySessions;
export const selectLoadingMySessions = (state) => state.classSession.loadingMySessions;
export const selectClassSessionError = (state) => state.classSession.error;
export const selectClassSessionFilters = (state) => state.classSession.filters;
export const selectClassSessionPagination = (state) => state.classSession.pagination;

export default classSessionSlice.reducer;

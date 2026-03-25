import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { competitionService } from '../../../../core/services/modules/competitionService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const initialState = {
    history: [],
    pagination: null,
    loading: false,
    error: null,
};

/**
 * Get current student's attempt history for a public competition.
 * API: GET /competitions/:id/student/history
 */
export const fetchCompetitionStudentHistory = createAsyncThunk(
    'competitionHistory/fetchCompetitionStudentHistory',
    async ({ competitionId, query = {} }, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentCompetitionHistory(competitionId, query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay lich su lam bai cuoc thi that bai',
            }
        );
    }
);

const competitionHistorySlice = createSlice({
    name: 'competitionHistory',
    initialState,
    reducers: {
        clearCompetitionStudentHistory: (state) => {
            state.history = [];
            state.pagination = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitionStudentHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.history = [];
                state.pagination = null;
            })
            .addCase(fetchCompetitionStudentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const data = action.payload?.data ?? {};
                state.history = Array.isArray(data?.history) ? data.history : [];
                state.pagination = data?.pagination || action.payload?.pagination || action.payload?.meta || null;
            })
            .addCase(fetchCompetitionStudentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.history = [];
                state.pagination = null;
            });
    },
});

export const { clearCompetitionStudentHistory } = competitionHistorySlice.actions;

export const selectCompetitionStudentHistory = (state) => state.competitionHistory.history;
export const selectCompetitionStudentHistoryPagination = (state) => state.competitionHistory.pagination;
export const selectCompetitionStudentHistoryLoading = (state) => state.competitionHistory.loading;
export const selectCompetitionStudentHistoryError = (state) => state.competitionHistory.error;

export default competitionHistorySlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { competitionService } from '../../../../core/services/modules/competitionService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const initialState = {
    leaderboard: null,
    currentUserRank: null,
    currentUserRanking: null,
    pagination: null,
    loading: false,
    error: null,
};

/**
 * Leaderboard state dành riêng cho tab ranking chi tiết.
 * API: GET /competitions/:id/ranking
 */
export const fetchCompetitionRankingLeaderboard = createAsyncThunk(
    'competitionRanking/fetchCompetitionRankingLeaderboard',
    async ({ competitionId, query = {} }, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getCompetitionLeaderboard(competitionId, query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy bảng xếp hạng cuộc thi thất bại',
            }
        );
    }
);

const competitionRankingSlice = createSlice({
    name: 'competitionRanking',
    initialState,
    reducers: {
        clearCompetitionRankingLeaderboard: (state) => {
            state.leaderboard = null;
            state.currentUserRank = null;
            state.currentUserRanking = null;
            state.pagination = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitionRankingLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.leaderboard = null;
                state.currentUserRank = null;
                state.currentUserRanking = null;
                state.pagination = null;
            })
            .addCase(fetchCompetitionRankingLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const data = action.payload?.data ?? null;
                state.leaderboard = data;
                state.currentUserRank = data?.currentUserRank ?? null;
                state.currentUserRanking = data?.currentUserRanking ?? null;
                state.pagination = data?.pagination || action.payload?.pagination || action.payload?.meta || null;
            })
            .addCase(fetchCompetitionRankingLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.leaderboard = null;
                state.currentUserRank = null;
                state.currentUserRanking = null;
                state.pagination = null;
            });
    },
});

export const { clearCompetitionRankingLeaderboard } = competitionRankingSlice.actions;

export const selectCompetitionRankingLeaderboard = (state) => state.competitionRanking.leaderboard;
export const selectCompetitionRankingCurrentUserRank = (state) => state.competitionRanking.currentUserRank;
export const selectCompetitionRankingCurrentUserRanking = (state) => state.competitionRanking.currentUserRanking;
export const selectCompetitionRankingPagination = (state) => state.competitionRanking.pagination;
export const selectCompetitionRankingLoading = (state) => state.competitionRanking.loading;
export const selectCompetitionRankingError = (state) => state.competitionRanking.error;

export default competitionRankingSlice.reducer;

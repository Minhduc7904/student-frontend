import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { competitionService } from '../../../core/services/modules/competitionService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    mainCompetitions: [],
    secondaryCompetitions: [],
    selectedCompetition: null,
    selectedCompetitionId: null,
    isSelectingCompetition: false,
    mainPagination: null,
    secondaryPagination: null,
    rankingSummary: null,
    leaderboard: null,
    currentUserRank: null,
    currentUserRanking: null,
    leaderboardPagination: null,
    mainLoading: false,
    secondaryLoading: false,
    rankingLoading: false,
    leaderboardLoading: false,
    mainError: null,
    secondaryError: null,
    rankingError: null,
    leaderboardError: null,
};

/**
 * Gọi danh sách cuộc thi cho content chính
 * Dùng chung API GET /competitions/public/student
 */
export const fetchMainCompetitions = createAsyncThunk(
    'competition/fetchMainCompetitions',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentCompetitions(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách cuộc thi chính thất bại',
            }
        );
    }
);

/**
 * Gọi danh sách cuộc thi cho content phụ
 * Dùng chung API GET /competitions/public/student
 */
export const fetchSecondaryCompetitions = createAsyncThunk(
    'competition/fetchSecondaryCompetitions',
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentCompetitions(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách cuộc thi phụ thất bại',
            }
        );
    }
);

/**
 * Get ranking summary of current student for a competition
 * Dùng API GET /competitions/:id/student/ranking
 */
export const fetchCompetitionRankingSummary = createAsyncThunk(
    'competition/fetchCompetitionRankingSummary',
    async (competitionId, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getCompetitionRanking(competitionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy xếp hạng cuộc thi thất bại',
            }
        );
    }
);

/**
 * Get competition leaderboard across all students
 * Dùng API GET /competitions/:id/ranking
 */
export const fetchCompetitionLeaderboard = createAsyncThunk(
    'competition/fetchCompetitionLeaderboard',
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

const competitionSlice = createSlice({
    name: 'competition',
    initialState,
    reducers: {
        clearMainCompetitions: (state) => {
            state.mainCompetitions = [];
            state.mainPagination = null;
            state.mainError = null;
        },
        clearSecondaryCompetitions: (state) => {
            state.secondaryCompetitions = [];
            state.secondaryPagination = null;
            state.secondaryError = null;
        },
        setSelectedCompetition: (state, action) => {
            const payload = action.payload;

            if (!payload) {
                state.selectedCompetition = null;
                state.selectedCompetitionId = null;
                state.isSelectingCompetition = false;
                return;
            }

            const selectedId = payload?.competitionId ?? payload?.id ?? null;
            const isSameCompetition = selectedId != null && selectedId === state.selectedCompetitionId;

            state.selectedCompetition = payload;
            state.selectedCompetitionId = selectedId;
            state.isSelectingCompetition = !isSameCompetition;
        },
        finishSelectingCompetition: (state) => {
            state.isSelectingCompetition = false;
        },
        clearSelectedCompetition: (state) => {
            state.selectedCompetition = null;
            state.selectedCompetitionId = null;
            state.isSelectingCompetition = false;
        },
        clearCompetitionErrors: (state) => {
            state.mainError = null;
            state.secondaryError = null;
            state.rankingError = null;
            state.leaderboardError = null;
        },
        clearCompetitionRankingSummary: (state) => {
            state.rankingSummary = null;
            state.rankingError = null;
        },
        clearCompetitionLeaderboard: (state) => {
            state.leaderboard = null;
            state.currentUserRank = null;
            state.currentUserRanking = null;
            state.leaderboardPagination = null;
            state.leaderboardError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Main content competitions
            .addCase(fetchMainCompetitions.pending, (state) => {
                state.mainLoading = true;
                state.mainError = null;
                state.mainCompetitions = [];
                state.mainPagination = null;
            })
            .addCase(fetchMainCompetitions.fulfilled, (state, action) => {
                state.mainLoading = false;
                state.mainCompetitions = action.payload?.data ?? [];
                state.mainPagination = action.payload?.pagination || action.payload?.meta || null;
            })
            .addCase(fetchMainCompetitions.rejected, (state, action) => {
                state.mainLoading = false;
                state.mainError = action.payload || action.error.message;
                state.mainCompetitions = [];
                state.mainPagination = null;
            })
            // Secondary content competitions
            .addCase(fetchSecondaryCompetitions.pending, (state) => {
                state.secondaryLoading = true;
                state.secondaryError = null;
                state.secondaryCompetitions = [];
                state.secondaryPagination = null;
            })
            .addCase(fetchSecondaryCompetitions.fulfilled, (state, action) => {
                state.secondaryLoading = false;
                const competitions = action.payload?.data ?? [];
                const firstCompetition = competitions[0] ?? null;
                const firstCompetitionId = firstCompetition?.competitionId ?? firstCompetition?.id ?? null;
                const isSameFirstCompetition =
                    firstCompetitionId != null && firstCompetitionId === state.selectedCompetitionId;

                state.secondaryCompetitions = competitions;
                state.secondaryPagination = action.payload?.pagination || action.payload?.meta || null;
                state.selectedCompetition = firstCompetition;
                state.selectedCompetitionId = firstCompetitionId;
                state.isSelectingCompetition = Boolean(firstCompetition) && !isSameFirstCompetition;
            })
            .addCase(fetchSecondaryCompetitions.rejected, (state, action) => {
                state.secondaryLoading = false;
                state.secondaryError = action.payload || action.error.message;
                state.secondaryCompetitions = [];
                state.secondaryPagination = null;
                state.isSelectingCompetition = false;
            })
            // Competition ranking summary
            .addCase(fetchCompetitionRankingSummary.pending, (state) => {
                state.rankingLoading = true;
                state.rankingError = null;
                state.rankingSummary = null;
            })
            .addCase(fetchCompetitionRankingSummary.fulfilled, (state, action) => {
                state.rankingLoading = false;
                state.rankingSummary = action.payload?.data ?? null;
            })
            .addCase(fetchCompetitionRankingSummary.rejected, (state, action) => {
                state.rankingLoading = false;
                state.rankingError = action.payload || action.error.message;
                state.rankingSummary = null;
            })
            // Competition leaderboard (all students)
            .addCase(fetchCompetitionLeaderboard.pending, (state) => {
                state.leaderboardLoading = true;
                state.leaderboardError = null;
                state.leaderboard = null;
                state.currentUserRank = null;
                state.currentUserRanking = null;
                state.leaderboardPagination = null;
            })
            .addCase(fetchCompetitionLeaderboard.fulfilled, (state, action) => {
                state.leaderboardLoading = false;
                state.isSelectingCompetition = false;

                const data = action.payload?.data ?? null;
                state.leaderboard = data;
                state.currentUserRank = data?.currentUserRank ?? null;
                state.currentUserRanking = data?.currentUserRanking ?? null;
                state.leaderboardPagination = data?.pagination || action.payload?.pagination || action.payload?.meta || null;
            })
            .addCase(fetchCompetitionLeaderboard.rejected, (state, action) => {
                state.leaderboardLoading = false;
                state.isSelectingCompetition = false;
                state.leaderboardError = action.payload || action.error.message;
                state.leaderboard = null;
                state.currentUserRank = null;
                state.currentUserRanking = null;
                state.leaderboardPagination = null;
            });
    },
});

export const {
    clearMainCompetitions,
    clearSecondaryCompetitions,
    setSelectedCompetition,
    finishSelectingCompetition,
    clearSelectedCompetition,
    clearCompetitionErrors,
    clearCompetitionRankingSummary,
    clearCompetitionLeaderboard,
} = competitionSlice.actions;

export const selectMainCompetitions = (state) => state.competition.mainCompetitions;
export const selectSecondaryCompetitions = (state) => state.competition.secondaryCompetitions;
export const selectSelectedCompetition = (state) => state.competition.selectedCompetition;
export const selectSelectedCompetitionId = (state) => state.competition.selectedCompetitionId;
export const selectIsSelectingCompetition = (state) => state.competition.isSelectingCompetition;
export const selectMainCompetitionPagination = (state) => state.competition.mainPagination;
export const selectSecondaryCompetitionPagination = (state) => state.competition.secondaryPagination;
export const selectCompetitionLeaderboardPagination = (state) => state.competition.leaderboardPagination;
export const selectMainCompetitionsLoading = (state) => state.competition.mainLoading;
export const selectSecondaryCompetitionsLoading = (state) => state.competition.secondaryLoading;
export const selectCompetitionRankingSummaryLoading = (state) => state.competition.rankingLoading;
export const selectCompetitionLeaderboardLoading = (state) => state.competition.leaderboardLoading;
export const selectMainCompetitionsError = (state) => state.competition.mainError;
export const selectSecondaryCompetitionsError = (state) => state.competition.secondaryError;
export const selectCompetitionRankingSummaryError = (state) => state.competition.rankingError;
export const selectCompetitionLeaderboardError = (state) => state.competition.leaderboardError;
export const selectCompetitionRankingSummary = (state) => state.competition.rankingSummary;
export const selectCompetitionLeaderboard = (state) => state.competition.leaderboard;
export const selectCompetitionCurrentUserRank = (state) => state.competition.currentUserRank;
export const selectCompetitionCurrentUserRanking = (state) => state.competition.currentUserRanking;

export default competitionSlice.reducer;

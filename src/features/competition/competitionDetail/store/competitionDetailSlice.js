import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { competitionService } from '../../../../core/services/modules/competitionService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

const initialState = {
    detail: null,
    loading: false,
    error: null,
};

/**
 * Fetch public competition detail for current student
 * Dung API GET /competitions/public/student/:id
 */
export const fetchCompetitionDetail = createAsyncThunk(
    'competitionDetail/fetchCompetitionDetail',
    async (competitionId, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentCompetitionDetail(competitionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay chi tiet cuoc thi that bai',
            }
        );
    }
);

const competitionDetailSlice = createSlice({
    name: 'competitionDetail',
    initialState,
    reducers: {
        clearCompetitionDetail: (state) => {
            state.detail = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitionDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.detail = null;
            })
            .addCase(fetchCompetitionDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.detail = action.payload?.data ?? null;
                state.error = null;
            })
            .addCase(fetchCompetitionDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.detail = null;
            });
    },
});

export const { clearCompetitionDetail } = competitionDetailSlice.actions;

export const selectCompetitionDetail = (state) => state.competitionDetail.detail;
export const selectCompetitionDetailLoading = (state) => state.competitionDetail.loading;
export const selectCompetitionDetailError = (state) => state.competitionDetail.error;

export default competitionDetailSlice.reducer;

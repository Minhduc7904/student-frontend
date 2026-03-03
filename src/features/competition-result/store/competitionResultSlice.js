import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doCompetitionService } from '../../../core/services/modules/doCompetitionService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

/**
 * Initial State
 */
const initialState = {
    result: null,
    loading: false,
    error: null,
};

/**
 * Fetch detailed result of a competition submit
 * GET /do-competition/submit/:submitId/result
 */
export const fetchCompetitionResult = createAsyncThunk(
    'competitionResult/fetchResult',
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
 * Competition Result Slice
 */
const competitionResultSlice = createSlice({
    name: 'competitionResult',
    initialState,
    reducers: {
        clearResult: (state) => {
            state.result = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompetitionResult.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.result = null;
            })
            .addCase(fetchCompetitionResult.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload.data;
            })
            .addCase(fetchCompetitionResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.result = null;
            });
    },
});

export const { clearResult } = competitionResultSlice.actions;

// Selectors
export const selectCompetitionResult = (state) => state.competitionResult.result;
export const selectCompetitionResultLoading = (state) => state.competitionResult.loading;
export const selectCompetitionResultError = (state) => state.competitionResult.error;

export default competitionResultSlice.reducer;

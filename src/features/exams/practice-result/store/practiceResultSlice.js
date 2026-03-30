import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { examAttemptService } from '../../../../core/services/modules/examAttemptService';
import { handleAsyncThunk } from '../../../../shared/utils/asyncThunkHelper';

export const fetchPracticeResult = createAsyncThunk(
    'practiceResult/fetchPracticeResult',
    async (attemptId, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttemptResult(attemptId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lay ket qua luot lam bai that bai',
            }
        );
    }
);

const initialState = {
    result: null,
    loading: false,
    error: null,
    currentAttemptId: null,
};

const practiceResultSlice = createSlice({
    name: 'practiceResult',
    initialState,
    reducers: {
        clearPracticeResult: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPracticeResult.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.result = null;
                state.currentAttemptId = action.meta.arg || null;
            })
            .addCase(fetchPracticeResult.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.result = action.payload?.data || action.payload || null;
                state.currentAttemptId = action.meta.arg || null;
            })
            .addCase(fetchPracticeResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || 'Khong the tai ket qua luot lam bai.';
            });
    },
});

export const { clearPracticeResult } = practiceResultSlice.actions;

export const selectPracticeResult = (state) => state.practiceResult.result;
export const selectPracticeResultLoading = (state) => state.practiceResult.loading;
export const selectPracticeResultError = (state) => state.practiceResult.error;

export default practiceResultSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { examAttemptService } from "../../../../core/services/modules/examAttemptService";
import { handleAsyncThunk } from "../../../../shared/utils/asyncThunkHelper";

const initialState = {
    data: null,
    pagination: null,
    loading: false,
    error: null,
};

export const getExamHistoryPageAsync = createAsyncThunk(
    "examHistoryPage/getExamHistory",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => examAttemptService.getPublicStudentExamAttempts(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử bài thi",
            }
        );
    }
);

const examHistoryPageSlice = createSlice({
    name: "examHistoryPage",
    initialState,
    reducers: {
        clearExamHistoryPage: (state) => {
            state.data = null;
            state.pagination = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getExamHistoryPageAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExamHistoryPageAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload?.data ?? null;
                state.pagination =
                    action.payload?.meta ||
                    action.payload?.pagination ||
                    action.payload?.data?.meta ||
                    action.payload?.data?.pagination ||
                    null;
                state.error = null;
            })
            .addCase(getExamHistoryPageAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearExamHistoryPage } = examHistoryPageSlice.actions;

export const selectExamHistoryPageData = (state) => state.examHistoryPage.data;
export const selectExamHistoryPagePagination = (state) => state.examHistoryPage.pagination;
export const selectExamHistoryPageLoading = (state) => state.examHistoryPage.loading;
export const selectExamHistoryPageError = (state) => state.examHistoryPage.error;

export default examHistoryPageSlice.reducer;

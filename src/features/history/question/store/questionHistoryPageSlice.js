import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { questionAnswerService } from "../../../../core/services/modules/questionAnswerService";
import { handleAsyncThunk } from "../../../../shared/utils/asyncThunkHelper";

const initialState = {
    data: null,
    pagination: null,
    loading: false,
    error: null,
    statistics: null,
    statisticsLoading: false,
    statisticsError: null,
};

export const getQuestionHistoryPageAsync = createAsyncThunk(
    "questionHistoryPage/getQuestionHistory",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.getPublicStudentQuestionAnswers(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử câu trả lời",
            }
        );
    }
);

export const getQuestionHistoryStatisticsAsync = createAsyncThunk(
    "questionHistoryPage/getQuestionHistoryStatistics",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => questionAnswerService.getPublicStudentQuestionAnswerStatistics(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải thống kê lịch sử câu hỏi",
            }
        );
    }
);

const questionHistoryPageSlice = createSlice({
    name: "questionHistoryPage",
    initialState,
    reducers: {
        clearQuestionHistoryPage: (state) => {
            state.data = null;
            state.pagination = null;
            state.loading = false;
            state.error = null;
            state.statistics = null;
            state.statisticsLoading = false;
            state.statisticsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestionHistoryPageAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionHistoryPageAsync.fulfilled, (state, action) => {
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
            .addCase(getQuestionHistoryPageAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getQuestionHistoryStatisticsAsync.pending, (state) => {
                state.statisticsLoading = true;
                state.statisticsError = null;
            })
            .addCase(getQuestionHistoryStatisticsAsync.fulfilled, (state, action) => {
                state.statisticsLoading = false;
                state.statistics = action.payload?.data ?? null;
                state.statisticsError = null;
            })
            .addCase(getQuestionHistoryStatisticsAsync.rejected, (state, action) => {
                state.statisticsLoading = false;
                state.statisticsError = action.payload;
            });
    },
});

export const { clearQuestionHistoryPage } = questionHistoryPageSlice.actions;

export const selectQuestionHistoryPageData = (state) => state.questionHistoryPage.data;
export const selectQuestionHistoryPagePagination = (state) => state.questionHistoryPage.pagination;
export const selectQuestionHistoryPageLoading = (state) => state.questionHistoryPage.loading;
export const selectQuestionHistoryPageError = (state) => state.questionHistoryPage.error;
export const selectQuestionHistoryStatistics = (state) => state.questionHistoryPage.statistics;
export const selectQuestionHistoryStatisticsLoading = (state) => state.questionHistoryPage.statisticsLoading;
export const selectQuestionHistoryStatisticsError = (state) => state.questionHistoryPage.statisticsError;

export default questionHistoryPageSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { competitionService } from "../../../../core/services/modules/competitionService";
import { handleAsyncThunk } from "../../../../shared/utils/asyncThunkHelper";

const initialState = {
    data: null,
    pagination: null,
    loading: false,
    error: null,
};

export const getCompetitionHistoryPageAsync = createAsyncThunk(
    "competitionHistoryPage/getCompetitionHistory",
    async (query = {}, thunkAPI) => {
        return handleAsyncThunk(
            () => competitionService.getPublicStudentSubmittedHistory(query),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: "Lỗi tải lịch sử đã nộp cuộc thi",
            }
        );
    }
);

const competitionHistoryPageSlice = createSlice({
    name: "competitionHistoryPage",
    initialState,
    reducers: {
        clearCompetitionHistoryPage: (state) => {
            state.data = null;
            state.pagination = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCompetitionHistoryPageAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompetitionHistoryPageAsync.fulfilled, (state, action) => {
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
            .addCase(getCompetitionHistoryPageAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCompetitionHistoryPage } = competitionHistoryPageSlice.actions;

export const selectCompetitionHistoryPageData = (state) => state.competitionHistoryPage.data;
export const selectCompetitionHistoryPagePagination = (state) => state.competitionHistoryPage.pagination;
export const selectCompetitionHistoryPageLoading = (state) => state.competitionHistoryPage.loading;
export const selectCompetitionHistoryPageError = (state) => state.competitionHistoryPage.error;

export default competitionHistoryPageSlice.reducer;

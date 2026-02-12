import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { learningItemService } from '../../../core/services/modules/learningItemService';
import { enrollmentStatus } from '../../../core/constants';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const homeworkStatus = {
    ALL: 'ALL',
    INCOMPLETE: 'INCOMPLETE', // Chưa làm
    COMPLETED: 'COMPLETED', // Đã hoàn thành
    OVERDUE: 'OVERDUE', // Quá hạn
}

const initialState = {
    myHomeworks: [],
    loadingMyHomeworks: false,
    error: null,
    filters: {
        status: homeworkStatus.ALL,
    },
    pagination: {
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 0,
    },
}


export const fetchMyHomeworks = createAsyncThunk(
    'learningItem/fetchMyHomeworks',
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => learningItemService.getMyHomeworks(params), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lấy danh sách bài tập thất bại',
        });
    }
);

const learningItemSlice = createSlice({
    name: 'learningItem',
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyHomeworks.pending, (state, action) => {
                // Chỉ clear array khi là page 1 hoặc filter thay đổi
                const isFirstPage = action.meta.arg.page === 1;
                if (isFirstPage) {
                    state.myHomeworks = [];
                }
                state.loadingMyHomeworks = true;
                state.error = null;
            })
            .addCase(fetchMyHomeworks.fulfilled, (state, action) => {
                state.loadingMyHomeworks = false;
                const isFirstPage = action.meta.arg.page === 1;
                
                // Nếu là page 1, thay thế; nếu không, append
                if (isFirstPage) {
                    state.myHomeworks = action.payload.data;
                } else {
                    state.myHomeworks = [...state.myHomeworks, ...action.payload.data];
                }
                
                state.pagination = action.payload.meta;
            })
            .addCase(fetchMyHomeworks.rejected, (state, action) => {
                const isFirstPage = action.meta.arg.page === 1;
                if (isFirstPage) {
                    state.myHomeworks = [];
                }
                state.loadingMyHomeworks = false;
                state.error = action.payload || action.error.message;
            });
    }
});
export const { setFilters, resetFilters, setPagination, resetPagination } = learningItemSlice.actions;

export const selectMyHomeworks = (state) => state.learningItem.myHomeworks;
export const selectLoadingMyHomeworks = (state) => state.learningItem.loadingMyHomeworks;
export const selectLearningItemError = (state) => state.learningItem.error;
export const selectLearningItemFilters = (state) => state.learningItem.filters;
export const selectLearningItemPagination = (state) => state.learningItem.pagination;

export default learningItemSlice.reducer;
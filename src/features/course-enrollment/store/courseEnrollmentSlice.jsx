import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseEnrollmentService } from '../../../core/services/modules/courseEnrollmentService';
import { enrollmentStatus } from '../../../core/constants';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    enrollments: [],
    loadingMyEnrollments: false,
    error: null,
    filters: {
        status: enrollmentStatus.ACTIVE,
    },
    pagination: {
        page: 1,
        limit: 6,
        total: 0,
        totalPages: 0,
    },
}


export const fetchMyEnrollments = createAsyncThunk(
    'courseEnrollment/fetchMyEnrollments',
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseEnrollmentService.getMyEnrollments(params), thunkAPI, {
            showSuccess: false,
            errorTitle: 'Lấy danh sách khóa học thất bại',
        });
    }
);

const courseEnrollmentSlice = createSlice({
    name: 'courseEnrollment',
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
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.loadingMyEnrollments = true;
                state.error = null;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.loadingMyEnrollments = false;
                state.enrollments = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.loadingMyEnrollments = false;
                state.error = action.payload || action.error.message;
            });
    }
});
export const { setFilters, resetFilters, setPagination, resetPagination } = courseEnrollmentSlice.actions;

export const selectEnrollments = (state) => state.courseEnrollment.enrollments;
export const selectLoadingMyEnrollments = (state) => state.courseEnrollment.loadingMyEnrollments;
export const selectCourseEnrollmentError = (state) => state.courseEnrollment.error;
export const selectCourseEnrollmentFilters = (state) => state.courseEnrollment.filters;
export const selectCourseEnrollmentPagination = (state) => state.courseEnrollment.pagination;

export default courseEnrollmentSlice.reducer;

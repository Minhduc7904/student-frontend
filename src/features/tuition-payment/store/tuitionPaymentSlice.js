import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tuitionPaymentService } from '../../../core/services/modules/tuitionPaymentService';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    // Danh sách học phí
    payments: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    // Thống kê theo trạng thái
    statsStatus: null,

    // Thống kê theo số tiền
    statsMoney: null,

    // Loading states
    loadingPayments: false,
    loadingStatsStatus: false,
    loadingStatsMoney: false,

    error: null,
};

/* ===================== Async Thunks ===================== */

export const getMyPaymentsAsync = createAsyncThunk(
    'tuitionPayment/getMy',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => tuitionPaymentService.getMy(params),
            thunkAPI,
            { showSuccess: false, errorTitle: 'Lỗi tải học phí' }
        );
    }
);

export const getMyStatsStatusAsync = createAsyncThunk(
    'tuitionPayment/getMyStatsStatus',
    async (_, thunkAPI) => {
        return handleAsyncThunk(
            () => tuitionPaymentService.getMyStatsStatus(),
            thunkAPI,
            { showSuccess: false, errorTitle: 'Lỗi tải thống kê học phí' }
        );
    }
);

export const getMyStatsMoneyAsync = createAsyncThunk(
    'tuitionPayment/getMyStatsMoney',
    async (_, thunkAPI) => {
        return handleAsyncThunk(
            () => tuitionPaymentService.getMyStatsMoney(),
            thunkAPI,
            { showSuccess: false, errorTitle: 'Lỗi tải thống kê số tiền học phí' }
        );
    }
);

/* ===================== Slice ===================== */

const tuitionPaymentSlice = createSlice({
    name: 'tuitionPayment',
    initialState,
    reducers: {
        resetPayments: (state) => {
            state.payments = [];
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get my payments
            .addCase(getMyPaymentsAsync.pending, (state) => {
                state.loadingPayments = true;
                state.error = null;
            })
            .addCase(getMyPaymentsAsync.fulfilled, (state, action) => {
                state.loadingPayments = false;
                state.payments = action.payload?.data ?? [];
                state.pagination = action.payload?.pagination ?? action.payload?.meta ?? state.pagination;
            })
            .addCase(getMyPaymentsAsync.rejected, (state, action) => {
                state.loadingPayments = false;
                state.error = action.payload;
            })

            // Get stats by status
            .addCase(getMyStatsStatusAsync.pending, (state) => {
                state.loadingStatsStatus = true;
                state.error = null;
            })
            .addCase(getMyStatsStatusAsync.fulfilled, (state, action) => {
                state.loadingStatsStatus = false;
                state.statsStatus = action.payload?.data ?? action.payload;
            })
            .addCase(getMyStatsStatusAsync.rejected, (state, action) => {
                state.loadingStatsStatus = false;
                state.error = action.payload;
            })

            // Get stats by money
            .addCase(getMyStatsMoneyAsync.pending, (state) => {
                state.loadingStatsMoney = true;
                state.error = null;
            })
            .addCase(getMyStatsMoneyAsync.fulfilled, (state, action) => {
                state.loadingStatsMoney = false;
                state.statsMoney = action.payload?.data ?? action.payload;
            })
            .addCase(getMyStatsMoneyAsync.rejected, (state, action) => {
                state.loadingStatsMoney = false;
                state.error = action.payload;
            });
    },
});

export const { resetPayments } = tuitionPaymentSlice.actions;

/* ===================== Selectors ===================== */

export const selectMyPayments = (state) => state.tuitionPayment.payments;
export const selectPaymentPagination = (state) => state.tuitionPayment.pagination;
export const selectStatsStatus = (state) => state.tuitionPayment.statsStatus;
export const selectStatsMoney = (state) => state.tuitionPayment.statsMoney;
export const selectLoadingPayments = (state) => state.tuitionPayment.loadingPayments;
export const selectLoadingStatsStatus = (state) => state.tuitionPayment.loadingStatsStatus;
export const selectLoadingStatsMoney = (state) => state.tuitionPayment.loadingStatsMoney;
export const selectPaymentError = (state) => state.tuitionPayment.error;

export default tuitionPaymentSlice.reducer;

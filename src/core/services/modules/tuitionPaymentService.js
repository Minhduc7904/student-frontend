import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const tuitionPaymentService = {
    /**
     * GET /tuition-payments/my
     * STUDENT: Danh sách học phí của chính mình
     *
     * @param {Object} params - Query parameters
     * @param {number} params.page
     * @param {number} params.limit
     * @param {string} params.status - Filter by status
     */
    getMy: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.MY, { params });
    },

    getDetail: (paymentId) => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.DETAIL(paymentId));
    },

    getPaymentInstructions: (paymentId) => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.PAYMENT_INSTRUCTIONS(paymentId));
    },

    refreshPaymentInstructions: (paymentId) => {
        return axiosClient.post(API_ENDPOINTS.TUITION_PAYMENTS.REFRESH_PAYMENT_INSTRUCTIONS(paymentId));
    },

    getPaymentIntentStatus: (paymentId) => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.PAYMENT_INTENT_STATUS(paymentId));
    },

    cancelPaymentAttempt: (paymentId, paymentAttemptId) => {
        return axiosClient.post(API_ENDPOINTS.TUITION_PAYMENTS.CANCEL_PAYMENT_ATTEMPT(paymentId, paymentAttemptId));
    },

    /**
     * GET /tuition-payments/my/stats/status
     * STUDENT: Thống kê học phí theo trạng thái (paid/unpaid/overdue...)
     */
    getMyStatsStatus: () => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.MY_STATS_STATUS);
    },

    /**
     * GET /tuition-payments/my/stats/money
     * STUDENT: Thống kê học phí theo số tiền (total, paid, remaining...)
     */
    getMyStatsMoney: () => {
        return axiosClient.get(API_ENDPOINTS.TUITION_PAYMENTS.MY_STATS_MONEY);
    },
};

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

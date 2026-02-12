
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Class Session Service
 * Xử lý các API liên quan đến buổi học (class sessions)
 */
export const classSessionService = {
    /**
     * Lấy danh sách buổi học của học sinh hiện tại
     * @param {Object} params - Query parameters
     * @param {number} params.page - Số trang (default: 1)
     * @param {number} params.limit - Số lượng mỗi trang (default: 10, max: 100)
     * @param {number} params.classId - Lọc theo ID lớp học
     * @param {string} params.sessionDateFrom - Lọc theo ngày bắt đầu (ISO 8601)
     * @param {string} params.sessionDateTo - Lọc theo ngày kết thúc (ISO 8601)
     * @param {boolean} params.isPast - Lọc các buổi học đã diễn ra
     * @param {boolean} params.isToday - Lọc các buổi học diễn ra trong ngày hôm nay
     * @param {boolean} params.isUpcoming - Lọc các buổi học sắp diễn ra
     * @param {string} params.sortBy - Trường sắp xếp (default: sessionDate)
     * @param {string} params.sortOrder - asc hoặc desc (default: desc)
     * @returns {Promise} Response with class sessions list
     */
    getMySessions: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.CLASS_SESSIONS.MY_SESSIONS, { params });
    },
};

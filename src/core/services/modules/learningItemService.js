
import { axiosClient } from '../client';
import { API_ENDPOINTS, API_BASE_URL } from '../../constants';
import { getAccessToken } from '../../../shared/utils';

export const learningItemService = {
    /**
     * Lấy danh sách bài tập của học sinh
     * @param {Object} params - Query parameters
     * @returns {Promise} Response with my homeworks list
     */
    getMyHomeworks: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.MY_HOMEWORKS, { params })
    },

    /**
     * Lấy chi tiết learning item cho học sinh
     * @param {number|string} learningItemId - ID của learning item
     * @returns {Promise} Response with learning item detail
     */
    getLearningItemDetail: (learningItemId) => {
        return axiosClient.get(API_ENDPOINTS.LEARNING_ITEMS.STUDENT_DETAIL(learningItemId));
    },

    /**
     * Lấy URL để stream video với Range Request support
     * Sử dụng URL này trong video element để browser tự động handle Range Request
     * Token được gửi qua query parameter vì video element không hỗ trợ custom headers
     * 
     * @param {number|string} learningItemId - ID của learning item
     * @param {number|string} mediaId - ID của media file (video)
     * @returns {string} Full URL cho video streaming với token authentication
     * 
     * @example
     * const videoUrl = learningItemService.getVideoStreamUrl(learningItemId, mediaId);
     * <video src={videoUrl} controls />
     * 
     * @note Backend cần hỗ trợ JWT token từ query parameter cho endpoint này
     */
    getVideoStreamUrl: (learningItemId, mediaId) => {
        const token = getAccessToken();
        const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.LEARNING_ITEMS.STREAM_VIDEO(learningItemId, mediaId)}`;
        
        // Thêm token vào query parameter nếu có
        // Video element không thể gửi Authorization header nên phải dùng query param
        return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
    },
};
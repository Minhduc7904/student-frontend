import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const profileService = {
    /**
     * Get current student profile
     * @returns {Promise<Object>} Student profile data
     */
    getProfile: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.PROFILE.GET, {
            params,
        });
    },

    /**
     * Update student profile
     * @param {Object} data - Profile data to update
     * @returns {Promise}
     */
    updateProfile: (data) => {
        return axiosClient.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    },

    /**
     * Change student password
     * PUT /student/profile/change-password
     * @param {{ oldPassword: string, newPassword: string }} data
     * @returns {Promise}
     */
    changePassword: (data) => {
        return axiosClient.put(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
    },

    /**
     * Upload student avatar
     * POST /student/profile/avatar
     * @param {File} file - Avatar image file
     * @param {Function} onUploadProgress - Progress callback
     * @returns {Promise<Object>} Updated profile data
     */
    uploadAvatar: (file, { onUploadProgress } = {}) => {
        const formData = new FormData();
        formData.append('file', file);

        return axiosClient.post(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress
                ? (progressEvent) => {
                      const percent = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      onUploadProgress(percent);
                  }
                : undefined,
        });
    },

    /**
     * Get student progress stats by difficulty
     * GET /student/profile/stats/difficulty
     * @returns {Promise<Object>} Difficulty progress stats
     */
    getDifficultyStats: (params = {}) => {
        return axiosClient.get(API_ENDPOINTS.PROFILE.STATS_DIFFICULTY, {
            params,
        });
    },

    /**
     * Get student daily activity totals in a year
     * GET /student/profile/stats/activity-year?year=YYYY
     * @param {number} year
     * @returns {Promise<Object>} Activity stats in year
     */
    getActivityYearStats: (year, params = {}) => {
        return axiosClient.get(API_ENDPOINTS.PROFILE.STATS_ACTIVITY_YEAR, {
            params: {
                year,
                ...params,
            },
        });
    },
};

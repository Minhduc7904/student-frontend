import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const profileService = {
    /**
     * Get current student profile
     * @returns {Promise<Object>} Student profile data
     */
    getProfile: () => {
        return axiosClient.get(API_ENDPOINTS.PROFILE.GET);
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
};

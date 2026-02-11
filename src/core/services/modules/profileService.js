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
};

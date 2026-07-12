/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import { axiosClient } from '../client';
import { API_BASE_URL, API_ENDPOINTS } from '../../constants';

export const authService = {
    login: async (credentials) => {
        try {
            return await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    },

    register: async (userData) => {
        try {
            return await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    },

    logout: ({ refreshToken }) => {
        return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    },

    getGoogleStudentUrl: () => {
        return `${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_STUDENT}`;
    },
}

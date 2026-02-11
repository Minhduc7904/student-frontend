/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const authService = {
    login: (credentials) => {
        return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    register: (userData) => {
        return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    },

    logout: ({ refreshToken }) => {
        return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    },
}
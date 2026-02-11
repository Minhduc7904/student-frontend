/**
 * Axios Request & Response Interceptors
 */

import axios from 'axios';
import { API_BASE_URL, ROUTES, HTTP_STATUS } from '../../constants';
import { handleApiError, logError } from '../errors';
import { getAccessToken, getRefreshToken, setAccessToken, clearAuthData } from '../../../shared/utils';
import { API_ENDPOINTS } from '../../constants';
/**
 * Request interceptor - Add auth token and log requests
 */
export function requestInterceptor(config) {
    // Add auth token
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
        console.group(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        console.log("Base URL:", config.baseURL);
        console.log("Full URL:", `${config.baseURL}${config.url}`);
        console.log("Headers:", config.headers);
        if (config.data) {
            console.log("Body:", config.data);
        }
        if (config.params) {
            console.log("Params:", config.params);
        }
        console.groupEnd();
    }

    return config;
}

/**
 * Request error interceptor
 */
export function requestErrorInterceptor(error) {
    if (import.meta.env.DEV) {
        console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
}

/**
 * Response interceptor - Log responses
 */
export function responseInterceptor(response) {
    // Log response in development
    if (import.meta.env.DEV) {
        console.group(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`
        );
        console.log("Status:", response.status);
        console.log("Data:", response.data);
        console.groupEnd();
    }

    return response;
}

/**
 * Response error interceptor - Handle errors and refresh token
 */
export async function responseErrorInterceptor(error) {
    const originalRequest = error.config;

    // Log error in development
    if (import.meta.env.DEV) {
        console.group(
            `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`
        );
        console.error("Status:", error.response?.status);
        console.error("Message:", error.response?.data?.message || error.message);
        console.error("Full Error:", error.response?.data);
        console.groupEnd();
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            // Call refresh token API
            const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
                refreshToken,
            });

            const { accessToken } = response.data;

            // Update stored token
            setAccessToken(accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            // Get the axios instance to retry
            const axiosClient = error.config.baseURL
                ? axios.create({ baseURL: error.config.baseURL })
                : axios;

            return axiosClient(originalRequest);
        } catch (refreshError) {
            // Clear tokens and redirect to login
            clearAuthData();
            redirectToLogin();
            return Promise.reject(refreshError);
        }
    }

    // Handle other errors
    const apiError = handleApiError(error);
    logError('API Client', error);
    return Promise.reject(apiError);
}

// clearAuthData is imported from storage helpers

/**
 * Redirect to login page
 */
function redirectToLogin() {
    if (typeof window !== "undefined") {
        window.location.href = ROUTES.LOGIN;
    }
}

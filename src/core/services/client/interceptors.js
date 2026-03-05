/**
 * Axios Request & Response Interceptors
 */

import axios from 'axios';
import { API_BASE_URL, ROUTES, HTTP_STATUS, STORAGE_KEYS } from '../../constants';
import { handleApiError, logError } from '../errors';
import { getAccessToken } from '../../../shared/utils';

/**
 * Lazy-injected references to avoid circular dependencies
 */
let _store = null;
let _axiosClient = null;

export function injectStore(store) {
    _store = store;
}

export function injectAxiosClient(client) {
    _axiosClient = client;
}
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

    // Handle 401 Unauthorized
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;
        console.warn("⚠️ 401 Unauthorized - Attempting token refresh...");

        try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
            });
            console.log('Refresh response:', response.data);

            const { accessToken, refreshToken: newRefreshToken } =
                response.data?.data ? response.data.data : response.data;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            if (newRefreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }

            // Sync tokens into Redux store
            _store?.dispatch({
                type: 'auth/setCredentials',
                payload: { accessToken, refreshToken: newRefreshToken || refreshToken },
            });

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return _axiosClient(originalRequest);
        } catch (refreshError) {
            // Clear tokens and redirect to login
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
 * Use import.meta.env.BASE_URL to respect Vite base path (e.g. /student/)
 * so we navigate to /student/login instead of /login
 */
function redirectToLogin() {
    if (typeof window !== "undefined") {
        const base = import.meta.env.BASE_URL || '/';
        window.location.href = base.replace(/\/$/, '') + ROUTES.LOGIN;
    }
}

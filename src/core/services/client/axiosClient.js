/**
 * Axios Client Configuration
 */

import axios from "axios";
import { API_BASE_URL, REQUEST_TIMEOUT } from "../../constants";
import {
    requestInterceptor,
    requestErrorInterceptor,
    responseInterceptor,
    responseErrorInterceptor,
} from "./interceptors";

/**
 * Create and configure axios instance
 */
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Apply request interceptors
axiosClient.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
);

// Apply response interceptors
axiosClient.interceptors.response.use(
    responseInterceptor,
    responseErrorInterceptor
);

export default axiosClient;

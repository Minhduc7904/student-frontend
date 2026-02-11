/**
 * API Error Handler
 */

import { HTTP_STATUS, ERROR_MESSAGES } from '../../constants';
import { ApiError } from './ApiError';

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object
 * @returns {ApiError} Formatted error
 */
export function handleApiError(error) {
    // Network error (no response from server)
    if (!error.response) {
        if (error.code === 'ECONNABORTED') {
            return new ApiError(
                0,
                ERROR_MESSAGES.TIMEOUT,
                { code: 'TIMEOUT' }
            );
        }
        return new ApiError(
            0,
            ERROR_MESSAGES.NETWORK_ERROR,
            { code: 'NETWORK_ERROR' }
        );
    }

    const { status, data } = error.response;

    // Extract error message
    let message = ERROR_MESSAGES.UNKNOWN;

    if (data) {
        // Try different message formats
        message = data.message
            || data.error
            || data.msg
            || (typeof data === 'string' ? data : ERROR_MESSAGES.UNKNOWN);
    }

    // Handle specific status codes
    switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
            if (data.errors) {
                // Validation errors
                message = formatValidationErrors(data.errors);
            }
            break;

        case HTTP_STATUS.UNAUTHORIZED:
            message = ERROR_MESSAGES.UNAUTHORIZED;
            break;

        case HTTP_STATUS.FORBIDDEN:
            message = ERROR_MESSAGES.FORBIDDEN;
            break;

        case HTTP_STATUS.UNPROCESSABLE_ENTITY:
            if (data.errors) {
                message = formatValidationErrors(data.errors);
            } else {
                message = ERROR_MESSAGES.VALIDATION_ERROR;
            }
            break;

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
            message = ERROR_MESSAGES.SERVER_ERROR;
            break;
    }

    return new ApiError(status, message, data);
}

/**
 * Format validation errors into a readable message
 * @param {Object|Array} errors - Validation errors
 * @returns {string} Formatted error message
 */
function formatValidationErrors(errors) {
    if (Array.isArray(errors)) {
        return errors.map(err => err.message || err.msg || err).join(', ');
    }

    if (typeof errors === 'object') {
        return Object.values(errors)
            .flat()
            .join(', ');
    }

    return errors.toString();
}

/**
 * Log error in development mode
 * @param {string} context - Context where error occurred
 * @param {Error} error - The error object
 */
export function logError(context, error) {
    if (import.meta.env.DEV) {
        console.group(`❌ Error in ${context}`);
        console.error('Error:', error);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        console.groupEnd();
    }
}

/**
 * Check if error is a specific HTTP status
 * @param {Error} error - The error object
 * @param {number} status - HTTP status code to check
 * @returns {boolean}
 */
export function isErrorStatus(error, status) {
    return error.response?.status === status;
}

/**
 * Check if error is unauthorized (401)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isUnauthorizedError(error) {
    return isErrorStatus(error, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Check if error is validation error (422)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isValidationError(error) {
    return isErrorStatus(error, HTTP_STATUS.UNPROCESSABLE_ENTITY);
}

/**
 * Check if error is network error
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isNetworkError(error) {
    return !error.response;
}

/**
 * Check if error is client error (4xx)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isClientError(error) {
    const status = error.response?.status;
    return status >= 400 && status < 500;
}

/**
 * Check if error is server error (5xx)
 * @param {Error} error - The error object
 * @returns {boolean}
 */
export function isServerError(error) {
    const status = error.response?.status;
    return status >= 500 && status < 600;
}

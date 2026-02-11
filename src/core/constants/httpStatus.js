/**
 * HTTP Status Codes
 */

export const HTTP_STATUS = {
    // Success 2xx
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    
    // Redirection 3xx
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    
    // Client Error 4xx
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    
    // Server Error 5xx
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};

/**
 * Check if status code indicates success
 */
export function isSuccessStatus(status) {
    return status >= 200 && status < 300;
}

/**
 * Check if status code indicates client error
 */
export function isClientError(status) {
    return status >= 400 && status < 500;
}

/**
 * Check if status code indicates server error
 */
export function isServerError(status) {
    return status >= 500 && status < 600;
}

/**
 * Check if status code indicates error
 */
export function isError(status) {
    return status >= 400;
}

/**
 * Get status code category
 */
export function getStatusCategory(status) {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'redirection';
    if (status >= 400 && status < 500) return 'client_error';
    if (status >= 500 && status < 600) return 'server_error';
    return 'unknown';
}

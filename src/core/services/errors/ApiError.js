/**
 * Custom API Error Class
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(status, message, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        
        // Maintains proper stack trace for where error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Check if error is a network error
     */
    isNetworkError() {
        return this.status === 0;
    }

    /**
     * Check if error is a client error (4xx)
     */
    isClientError() {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if error is a server error (5xx)
     */
    isServerError() {
        return this.status >= 500 && this.status < 600;
    }

    /**
     * Convert error to JSON
     */
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            data: this.data,
        };
    }

    /**
     * Convert error to string
     */
    toString() {
        return `${this.name} [${this.status}]: ${this.message}`;
    }
}

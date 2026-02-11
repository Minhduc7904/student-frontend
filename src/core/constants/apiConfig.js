/**
 * API Configuration
 */

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Base URL (without /api)
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// API Version
export const API_VERSION = 'v1';

// Retry Configuration
export const RETRY_CONFIG = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

// Upload Configuration
export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

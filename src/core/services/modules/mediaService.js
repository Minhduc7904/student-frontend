/**
 * Media Service
 * Handles media upload API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const mediaService = {
    /**
     * Upload media file (image, video, document, etc.)
     * @param {File} file - File to upload
     * @param {Object} options - Upload options
     * @param {Function} options.onUploadProgress - Progress callback (percentage)
     * @returns {Promise<Object>} Uploaded media data (url, id, etc.)
     */
    upload: (file, { onUploadProgress } = {}) => {
        const formData = new FormData();
        formData.append('file', file);

        return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress
                ? (progressEvent) => {
                      const percent = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      onUploadProgress(percent);
                  }
                : undefined,
        });
    },

    /**
     * Upload multiple media files
     * @param {File[]} files - Array of files to upload
     * @param {Object} options - Upload options
     * @param {Function} options.onUploadProgress - Progress callback (percentage)
     * @returns {Promise<Object[]>} Array of uploaded media data
     */
    uploadMultiple: (files, { onUploadProgress } = {}) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress
                ? (progressEvent) => {
                      const percent = Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total
                      );
                      onUploadProgress(percent);
                  }
                : undefined,
        });
    },
};

export default mediaService;

/**
 * Exam Attempt Service
 * Handles exam-attempt related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const examAttemptService = {
    /**
     * Get exam attempts of current student from public exams only.
     *
     * @route GET /exam-attempts/public/student
     * @param {Object} query - Pagination query (page, limit, sortBy, sortOrder)
     * @returns {Promise<Object>} StudentExamAttemptListResponseDto
     *
     * @example
     * examAttemptService.getPublicStudentExamAttempts({ page: 1, limit: 10 })
     */
    getPublicStudentExamAttempts: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT, {
            params: query,
        });
    },
};

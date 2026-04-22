/**
 * Question Service
 * Handles question-related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const questionService = {
    /**
     * Get public questions for students with pagination.
     *
     * @route GET /questions/public/student
     * @param {Object} query - Query parameters
     * @param {number} [query.page]
     * @param {number} [query.limit]
     * @param {number|string} [query.subjectId]
     * @param {Array<number|string>|string} [query.chapterIds]
     * @param {string} [query.type]
     * @param {string} [query.difficulty]
     * @param {number|string} [query.grade]
     * @param {string} [query.search]
     * @returns {Promise<Object>} Paginated list of public questions
     *
     * @example
     * questionService.getPublicStudentQuestions({ page: 1, limit: 10, chapterIds: [5] })
     */
    getPublicStudentQuestions: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.PUBLIC_STUDENT, {
            params: query,
        });
    },
};

export default questionService;

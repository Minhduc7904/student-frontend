/**
 * Question Answer Service
 * Handles question-answer related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const questionAnswerService = {
    /**
     * Get question answers of current student from public exams only.
     *
     * @route GET /question-answers/public/student
     * @param {Object} query - Pagination query (page, limit, sortBy, sortOrder)
     * @returns {Promise<Object>} StudentQuestionAnswerListResponseDto
     *
     * @example
     * questionAnswerService.getPublicStudentQuestionAnswers({ page: 1, limit: 10 })
     */
    getPublicStudentQuestionAnswers: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTION_ANSWERS.PUBLIC_STUDENT, {
            params: query,
        });
    },
};

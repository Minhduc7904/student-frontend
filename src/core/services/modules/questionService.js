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

    /**
     * Get public question detail for current student.
     *
     * @route GET /questions/public/student/:id
     * @param {number|string} questionId - Question ID
     * @returns {Promise<Object>} Question detail
     */
    getPublicStudentQuestionDetail: (questionId) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.PUBLIC_STUDENT_DETAIL(questionId));
    },

    /**
     * Search public questions for current student.
     *
     * @route GET /questions/public/student/search
     * @param {Object} query - Query parameters
     * @param {string} [query.search]
     * @param {number} [query.page]
     * @param {number} [query.limit]
     * @param {number|string} [query.subjectId]
     * @param {Array<number|string>|string} [query.chapterIds]
     * @param {string} [query.type]
     * @param {string} [query.difficulty]
     * @param {number|string} [query.grade]
     * @param {boolean|string} [query.isCorrect]
     * @returns {Promise<Object>} Paginated list of public questions matching keyword and filters
     */
    searchPublicStudentQuestions: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.PUBLIC_STUDENT_SEARCH, {
            params: query,
        });
    },

    /**
     * Suggest related public questions from a target question for current student.
     *
     * @route GET /questions/public/student/:questionId/related
     * @param {number|string} questionId - Base question ID
     * @param {Object} query - Query parameters
     * @param {number} [query.limit]
     * @returns {Promise<Object>} Related public questions
     */
    getPublicStudentRelatedQuestions: (questionId, query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.PUBLIC_STUDENT_RELATED(questionId), {
            params: query,
        });
    },
};

export default questionService;

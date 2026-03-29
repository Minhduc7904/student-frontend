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

    /**
     * Upsert student question answer by questionId + attemptId.
     * - If answer not found by (questionId, attemptId): create new one
     * - If found: update and re-grade
     * - If attemptId exists: recalculate attempt scoring fields
     *
     * @route POST /question-answers/public/student/submit
     * @param {Object} body - Submit payload for question answer
     * @returns {Promise<Object>} BaseResponseDto<StudentQuestionAnswerDto>
     */
    submitPublicStudentQuestionAnswer: (body) => {
        return axiosClient.post(API_ENDPOINTS.QUESTION_ANSWERS.PUBLIC_STUDENT_SUBMIT, body);
    },

    /**
     * Get all question answers by attemptId of current student.
     *
     * @route GET /question-answers/public/student/attempt/:attemptId
     * @param {number|string} attemptId - Exam attempt ID
     * @returns {Promise<Object>} StudentQuestionAnswerByAttemptResponseDto
     */
    getPublicStudentQuestionAnswersByAttempt: (attemptId) => {
        return axiosClient.get(API_ENDPOINTS.QUESTION_ANSWERS.PUBLIC_STUDENT_BY_ATTEMPT(attemptId));
    },
};

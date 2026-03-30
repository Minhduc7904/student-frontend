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

    /**
     * Check public exam by examId and create exam attempt for current student.
     *
     * @route POST /exam-attempts/public/student/start
     * @param {Object} body - examId and optional questionIds to start attempt
     * @param {number|string} body.examId - Public exam ID
     * @param {Array<number|string>} [body.questionIds] - Optional subset question IDs
     * @returns {Promise<Object>} BaseResponseDto<StudentExamAttemptItemDto>
     *
     * @example
     * examAttemptService.startPublicStudentExamAttempt({ examId: 1, questionIds: [11, 12, 13] })
     */
    startPublicStudentExamAttempt: (body) => {
        return axiosClient.post(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT_START, body);
    },

    /**
     * Get exam attempts of current student filtered by examId.
     *
     * @route GET /exam-attempts/public/student?page=1&limit=10&examId=1
     * @param {Object} query - Query params (page, limit, examId)
     * @returns {Promise<Object>} StudentExamAttemptListResponseDto
     */
    getPublicStudentExamAttemptsByExamId: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT, {
            params: query,
        });
    },

    /**
     * Get public student exam attempts by examId with paging.
     *
     * @route GET /exam-attempts/public/student?page=1&limit=10&examId=1
     * @param {number|string} examId - Exam ID
     * @param {number} [page=1] - Page index
     * @param {number} [limit=10] - Page size
     * @returns {Promise<Object>} StudentExamAttemptListResponseDto
     */
    getPublicStudentExamAttemptsByExamIdPaging: (examId, page = 1, limit = 10) => {
        return axiosClient.get(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT, {
            params: { examId, page, limit },
        });
    },

    /**
     * Get exam attempt detail of current student from public exams.
     *
     * @route GET /exam-attempts/public/student/:attemptId
     * @param {number|string} attemptId - Exam attempt ID
     * @returns {Promise<Object>} StudentExamAttemptDetailResponseDto
     */
    getPublicStudentExamAttemptDetail: (attemptId) => {
        return axiosClient.get(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT_DETAIL(attemptId));
    },

    /**
     * Get submitted exam attempt result of current student.
     *
     * @route GET /exam-attempts/public/student/:attemptId/result
     * @param {number|string} attemptId - Exam attempt ID
     * @returns {Promise<Object>} BaseResponseDto<StudentExamAttemptResultDto>
     */
    getPublicStudentExamAttemptResult: (attemptId) => {
        return axiosClient.get(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT_RESULT(attemptId));
    },

    /**
     * Submit current exam attempt and finalize grading for current student.
     *
     * @route POST /exam-attempts/public/student/:attemptId/submit
     * @param {number|string} attemptId - Exam attempt ID
     * @returns {Promise<Object>} BaseResponseDto<StudentExamAttemptItemDto>
     */
    submitPublicStudentExamAttempt: (attemptId) => {
        return axiosClient.post(API_ENDPOINTS.EXAM_ATTEMPTS.PUBLIC_STUDENT_SUBMIT(attemptId));
    },
};

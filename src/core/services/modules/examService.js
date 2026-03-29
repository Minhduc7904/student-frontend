/**
 * Exam Service
 * Handles all exam-related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Get list of exams
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (upcoming, available, completed)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Exams list with pagination
 */
export async function getExams(params = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.LIST, { params });
    return response.data;
}

/**
 * Count published public exams by exam type for students
 * @returns {Promise<Object>} Exam type counts
 */
export async function getPublicExamTypeCounts() {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.PUBLIC_TYPE_COUNTS);
    return response;
}

/**
 * Get public exams for students with filters and pagination
 * @param {Object} query - Query params
 * @param {number} [query.page]
 * @param {number} [query.limit]
 * @param {string} [query.search]
 * @param {number|string} [query.grade]
 * @param {string} [query.typeOfExam]
 * @param {number|string} [query.subjectId]
 * @param {string} [query.sortBy]
 * @param {'asc'|'desc'|'ASC'|'DESC'} [query.sortOrder]
 * @returns {Promise<Object>} Public exam list response with meta
 */
export async function getPublicStudentExams(query = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.PUBLIC_STUDENT, {
        params: query,
    });
    return response;
}

/**
 * Get exam detail for student from public exam list
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Public exam detail response
 */
export async function getPublicStudentExamDetail(examId) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.PUBLIC_STUDENT_DETAIL(examId));
    return response;
}

/**
 * Get public exam content for student (sections + questions)
 * @param {string|number} examId - Exam ID
 * @param {Object} [query] - Optional query params
 * @param {Array<number|string>} [query.questionIds] - Optional question filter
 * @returns {Promise<Object>} Public exam content response
 */
export async function getPublicStudentExam(examId, query = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.PUBLIC_STUDENT_EXAM(examId), {
        params: query,
    });
    return response;
}

/**
 * Get all subjects with pagination and filtering
 * @param {Object} query - Query params
 * @param {number} [query.page]
 * @param {number} [query.limit]
 * @param {string} [query.search]
 * @param {string} [query.code]
 * @param {'name'|'code'} [query.sortBy]
 * @param {'asc'|'desc'|'ASC'|'DESC'} [query.sortOrder]
 * @returns {Promise<Object>} Subject list response with meta
 */
export async function getSubjects(query = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.SUBJECTS.LIST, {
        params: query,
    });
    return response;
}

/**
 * Get exam detail by ID
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam detail
 */
export async function getExamDetail(examId) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.DETAIL(examId));
    return response;
}

/**
 * Start an exam
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam session data with questions
 */
export async function startExam(examId) {
    const response = await axiosClient.post(API_ENDPOINTS.EXAMS.START(examId));
    return response;
}

/**
 * Submit exam answers
 * @param {string|number} examId - Exam ID
 * @param {Object} examData - Exam submission data
 * @param {Array} examData.answers - Array of answers
 * @param {number} examData.timeSpent - Time spent in seconds
 * @returns {Promise<Object>} Exam result
 */
export async function submitExam(examId, examData) {
    const response = await axiosClient.post(
        API_ENDPOINTS.EXAMS.SUBMIT(examId),
        examData
    );
    return response;
}

/**
 * Get exam result
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam result with score and answers
 */
export async function getExamResult(examId) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.RESULT(examId));
    return response;
}

/**
 * Get all exam results for current user
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of exam results
 */
export async function getExamResults(params = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.RESULTS, { params });
    return response;
}

/**
 * Get upcoming exams
 * @returns {Promise<Array>} List of upcoming exams
 */
export async function getUpcomingExams() {
    return getExams({ status: 'upcoming' });
}

/**
 * Get available exams (can be taken now)
 * @returns {Promise<Array>} List of available exams
 */
export async function getAvailableExams() {
    return getExams({ status: 'available' });
}

/**
 * Get completed exams
 * @returns {Promise<Array>} List of completed exams
 */
export async function getCompletedExams() {
    return getExams({ status: 'completed' });
}

export const examService = {
    getExams,
    getPublicExamTypeCounts,
    getPublicStudentExams,
    getPublicStudentExamDetail,
    getPublicStudentExam,
    getSubjects,
    getExamDetail,
    startExam,
    submitExam,
    getExamResult,
    getExamResults,
    getUpcomingExams,
    getAvailableExams,
    getCompletedExams,
};

// Default export
export default examService;

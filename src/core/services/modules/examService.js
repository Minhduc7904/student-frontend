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
 * Get exam detail by ID
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam detail
 */
export async function getExamDetail(examId) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.DETAIL(examId));
    return response.data;
}

/**
 * Start an exam
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam session data with questions
 */
export async function startExam(examId) {
    const response = await axiosClient.post(API_ENDPOINTS.EXAMS.START(examId));
    return response.data;
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
    return response.data;
}

/**
 * Get exam result
 * @param {string|number} examId - Exam ID
 * @returns {Promise<Object>} Exam result with score and answers
 */
export async function getExamResult(examId) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.RESULT(examId));
    return response.data;
}

/**
 * Get all exam results for current user
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of exam results
 */
export async function getExamResults(params = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.EXAMS.RESULTS, { params });
    return response.data;
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

// Default export
export default {
    getExams,
    getExamDetail,
    startExam,
    submitExam,
    getExamResult,
    getExamResults,
    getUpcomingExams,
    getAvailableExams,
    getCompletedExams,
};

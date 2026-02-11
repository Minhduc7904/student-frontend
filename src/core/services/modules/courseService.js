/**
 * Course Service
 * Handles all course-related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Get list of courses
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search query
 * @returns {Promise<Object>} Courses list with pagination
 */
export async function getCourses(params = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.LIST, { params });
    return response.data;
}

/**
 * Get course detail by ID
 * @param {string|number} courseId - Course ID
 * @returns {Promise<Object>} Course detail
 */
export async function getCourseDetail(courseId) {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.DETAIL(courseId));
    return response.data;
}

/**
 * Get lessons for a course
 * @param {string|number} courseId - Course ID
 * @returns {Promise<Array>} List of lessons
 */
export async function getCourseLessons(courseId) {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.LESSONS(courseId));
    return response.data;
}

/**
 * Get lesson detail
 * @param {string|number} courseId - Course ID
 * @param {string|number} lessonId - Lesson ID
 * @returns {Promise<Object>} Lesson detail
 */
export async function getLessonDetail(courseId, lessonId) {
    const response = await axiosClient.get(
        API_ENDPOINTS.COURSES.LESSON_DETAIL(courseId, lessonId)
    );
    return response.data;
}

/**
 * Enroll in a course
 * @param {string|number} courseId - Course ID
 * @returns {Promise<Object>} Enrollment confirmation
 */
export async function enrollCourse(courseId) {
    const response = await axiosClient.post(API_ENDPOINTS.COURSES.ENROLL(courseId));
    return response.data;
}

/**
 * Unenroll from a course
 * @param {string|number} courseId - Course ID
 * @returns {Promise<Object>} Unenrollment confirmation
 */
export async function unenrollCourse(courseId) {
    const response = await axiosClient.post(API_ENDPOINTS.COURSES.UNENROLL(courseId));
    return response.data;
}

/**
 * Get course progress
 * @param {string|number} courseId - Course ID
 * @returns {Promise<Object>} Course progress data
 */
export async function getCourseProgress(courseId) {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.PROGRESS(courseId));
    return response.data;
}

/**
 * Update course progress
 * @param {string|number} courseId - Course ID
 * @param {Object} progressData - Progress data
 * @param {string|number} progressData.lessonId - Lesson ID
 * @param {boolean} progressData.completed - Is lesson completed
 * @param {number} progressData.progress - Progress percentage
 * @returns {Promise<Object>} Updated progress
 */
export async function updateCourseProgress(courseId, progressData) {
    const response = await axiosClient.put(
        API_ENDPOINTS.COURSES.UPDATE_PROGRESS(courseId),
        progressData
    );
    return response.data;
}

/**
 * Search courses
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export async function searchCourses(query) {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.LIST, {
        params: { search: query }
    });
    return response.data;
}

// Default export
export default {
    getCourses,
    getCourseDetail,
    getCourseLessons,
    getLessonDetail,
    enrollCourse,
    unenrollCourse,
    getCourseProgress,
    updateCourseProgress,
    searchCourses,
};

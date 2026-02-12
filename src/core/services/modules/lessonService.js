
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Lesson Service
 * Xử lý các API liên quan đến lessons (bài học)
 */
export const lessonService = {
    /**
     * Lấy danh sách lessons của một course
     * @param {number|string} courseId - ID của course
     * @returns {Promise} Response with lessons list
     */
    getCourseLessons: (courseId) => {
        return axiosClient.get(API_ENDPOINTS.LESSONS.COURSE_LESSONS(courseId));
    },

    /**
     * Lấy chi tiết một lesson
     * @param {number|string} courseId - ID của course
     * @param {number|string} lessonId - ID của lesson
     * @returns {Promise} Response with lesson detail
     */
    getLessonDetail: (lessonId) => {
        return axiosClient.get(API_ENDPOINTS.LESSONS.LESSON_DETAIL(lessonId));
    },
};

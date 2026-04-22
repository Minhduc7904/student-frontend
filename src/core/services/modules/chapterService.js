/**
 * Chapter Service
 * Handles chapter-related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

/**
 * Get all chapters by subject for students
 * API: GET /chapters/public/student/subject/:subjectId
 * @param {string|number} subjectId - Subject ID
 * @param {Object} [query] - Query params (pagination/filter)
 * @returns {Promise<Object>} Chapters list response
 */
export async function getPublicStudentChaptersBySubject(subjectId, query = {}) {
    const response = await axiosClient.get(API_ENDPOINTS.CHAPTERS.PUBLIC_STUDENT_BY_SUBJECT(subjectId), {
        params: query,
    });
    return response;
}

export const chapterService = {
    getPublicStudentChaptersBySubject,
};

export default chapterService;

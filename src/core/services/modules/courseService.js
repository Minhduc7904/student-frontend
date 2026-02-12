/**
 * Course Service
 * Handles all course-related API calls
 */

import { axiosClient } from "../client";
import { API_ENDPOINTS } from "../../constants";

export const courseService = {
  /**
   * Get student course detail by ID
   * Lấy chi tiết khóa học của sinh viên theo ID
   * @param {string} courseId - ID của khóa học
   * @returns {Promise<Object>} Chi tiết khóa học
   */
  getStudentCourseDetail: async (courseId) => {
    return await axiosClient.get(
      API_ENDPOINTS.COURSES.STUDENT_DETAIL(courseId)
    );
  },
};

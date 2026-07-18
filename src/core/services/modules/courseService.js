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

  getStudentOnlineCoursesNotEnrolled: async (params = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.COURSES.STUDENT_ONLINE_NOT_ENROLLED,
      { params }
    );
  },

  registerManualInvoice: async (courseIdOrCode) => {
    return await axiosClient.post(
      API_ENDPOINTS.COURSES.REGISTER_MANUAL_INVOICE(courseIdOrCode)
    );
  },

  createPayosPayment: async (invoiceId) => {
    return await axiosClient.post(API_ENDPOINTS.PAYMENTS.PAYOS, { invoiceId });
  },

  getOnlineCourseInvoicePaymentStatus: async (invoiceId) => {
    return await axiosClient.get(
      API_ENDPOINTS.ONLINE_COURSE_INVOICES.PAYMENT_STATUS(invoiceId)
    );
  },
};

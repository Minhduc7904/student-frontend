/**
 * Competition Service
 * Handles all competition-related API calls
 */

import { axiosClient } from "../client";
import { API_ENDPOINTS } from "../../constants";

export const competitionService = {
  /**
   * Get competition ranking (leaderboard) for students
   * Lấy bảng xếp hạng của cuộc thi
   * 
   * @param {string|number} competitionId - ID của cuộc thi
   * @param {Object} params - Pagination parameters
   * @param {number} params.page - Số trang (default: 1)
   * @param {number} params.limit - Số lượng kết quả mỗi trang (default: 10)
   * @returns {Promise<Object>} Bảng xếp hạng với thông tin sinh viên
   * 
   * @example
   * const ranking = await competitionService.getCompetitionRanking(123, { page: 1, limit: 10 });
   */
  getCompetitionRanking: async (competitionId, params = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.STUDENT_RANKING(competitionId),
      { params }
    );
  },

  /**
   * Lấy lịch sử làm bài của học sinh theo competitionId (có phân trang)
   * Chỉ bao gồm các lần thi đã nộp bài (SUBMITTED / GRADED)
   *
   * @param {string|number} competitionId - ID của cuộc thi
   * @param {Object} params - Query parameters
   * @param {number} params.page - Trang hiện tại (mặc định 1)
   * @param {number} params.limit - Kích thước trang, tối đa 100 (mặc định 10)
   * @param {string} params.sortBy - Trường sắp xếp (mặc định submittedAt)
   * @param {string} params.sortOrder - Chiều sắp xếp: asc | desc (mặc định desc)
   * @returns {Promise<Object>} { data: { history[], pagination } }
   */
  getCompetitionHistory: async (competitionId, params = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.DO_COMPETITION.HISTORY(competitionId),
      { params }
    );
  },
};

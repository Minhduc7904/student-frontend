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
};

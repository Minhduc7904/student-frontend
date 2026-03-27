/**
 * Competition Service
 * Handles all competition-related API calls
 */

import { axiosClient } from "../client";
import { API_ENDPOINTS } from "../../constants";

export const competitionService = {
  /**
   * Danh sách cuộc thi public dành cho học sinh
   *
   * @route GET /competitions/public/student
   * @param {Object} query - Query parameters
   * @param {number} [query.page] - Trang hiện tại
   * @param {number} [query.limit] - Số phần tử mỗi trang
   * @param {string|number} [query.examId] - Lọc theo examId
   * @param {string} [query.search] - Từ khóa tìm kiếm
   * @param {'ONGOING'|'ENDED'|'UPCOMING'|'ATTEMPTED'} [query.publicStatus] - Trạng thái public
   * @returns {Promise<Object>} Paginated list of published competitions for students
   *
   * @example
   * competitionService.getPublicStudentCompetitions({ publicStatus: 'ONGOING' })
   * competitionService.getPublicStudentCompetitions({ publicStatus: 'ENDED' })
   * competitionService.getPublicStudentCompetitions({ publicStatus: 'UPCOMING' })
   * competitionService.getPublicStudentCompetitions({ publicStatus: 'ATTEMPTED' })
   */
  getPublicStudentCompetitions: async (query = {}) => {
    return await axiosClient.get(API_ENDPOINTS.COMPETITIONS.PUBLIC_STUDENT, {
      params: query,
    });
  },

  /**
   * Get public competition detail for current student.
   *
   * @route GET /competitions/public/student/:id
   * @param {string|number} id - Competition ID
   * @returns {Promise<Object>} PublicStudentCompetitionDetailApiResponseDto
   *
   * Response data includes:
   * - competitionId, title, subtitle, exam, startDate, endDate
   * - durationMinutes, maxAttempts, attemptedCount
   * - attemptStatus, timelineStatus, canAttempt
   * - showResultDetail, allowLeaderboard, allowViewScore,
   *   allowViewAnswer, allowViewSolutionYoutubeUrl, allowViewExamContent
   *
   * @example
   * const detail = await competitionService.getPublicStudentCompetitionDetail(123);
   */
  getPublicStudentCompetitionDetail: async (id) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.PUBLIC_STUDENT_DETAIL(id)
    );
  },

  /**
   * Get public exam content by competition for current student.
   *
   * @route GET /competitions/:id/student/exam
   * @param {string|number} id - Competition ID
   * @returns {Promise<Object>} PublicStudentCompetitionExamResponseDto
   */
  getPublicStudentCompetitionExam: async (id) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.STUDENT_EXAM(id)
    );
  },

  /**
   * Get current student's attempt history for a public competition.
   *
   * @route GET /competitions/:id/student/history
   * @param {string|number} id - Competition ID
   * @param {Object} query - Pagination query (page, limit, sortBy, sortOrder)
   * @returns {Promise<Object>} StudentCompetitionHistoryListResponseDto
   */
  getPublicStudentCompetitionHistory: async (id, query = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.STUDENT_HISTORY(id),
      { params: query }
    );
  },

  /**
   * Get current student's submitted attempts across all public competitions.
   *
   * @route GET /competitions/public/student-submits
   * @param {Object} query - Pagination query (page, limit, sortBy, sortOrder)
   * @returns {Promise<Object>} StudentCompetitionHistoryListResponseDto
   *
   * @example
   * competitionService.getPublicStudentSubmittedHistory({ page: 1, limit: 10 })
   */
  getPublicStudentSubmittedHistory: async (query = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.PUBLIC_STUDENT_SUBMITS,
      { params: query }
    );
  },

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
   * Get competition leaderboard across all students
   * Lấy bảng xếp hạng toàn bộ học sinh của cuộc thi
   *
   * @route GET /competitions/:id/ranking
   * @param {string|number} competitionId - ID của cuộc thi
   * @param {Object} query - Pagination query
   * @param {number} [query.page] - Trang hiện tại
   * @param {number} [query.limit] - Số bản ghi mỗi trang
   * @returns {Promise<Object>} CompetitionRankingResponseDto
   */
  getCompetitionLeaderboard: async (competitionId, query = {}) => {
    return await axiosClient.get(
      API_ENDPOINTS.COMPETITIONS.RANKING(competitionId),
      { params: query }
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

/**
 * Do Competition Service
 * Handles all do-competition related API calls
 */

import { axiosClient } from "../client";
import { API_ENDPOINTS } from "../../constants";

export const doCompetitionService = {
  /**
   * Start a new competition attempt
   * Bắt đầu một lần làm bài mới
   * 
   * @param {string|number} competitionId - ID của cuộc thi
   * @returns {Promise<Object>} Competition submit with status IN_PROGRESS
   * 
   * @example
   * const attempt = await doCompetitionService.startAttempt(1);
   * 
   * Business Logic:
   * 1. Check if competition exists and is ongoing (within date range)
   * 2. Check if there's already an IN_PROGRESS attempt - if yes, return it
   * 3. Check maxAttempts limit (if set)
   * 4. Create new attempt with incremented attemptNumber
   */
  startAttempt: async (competitionId) => {
    return await axiosClient.post(
      API_ENDPOINTS.DO_COMPETITION.START_ATTEMPT(competitionId)
    );
  },

  /**
   * Get remaining time for current attempt
   * Lấy thời gian còn lại để làm bài
   * 
   * @param {string|number} submitId - ID của competition submit
   * @returns {Promise<Object>} Remaining time data
   * 
   * @example
   * const timeData = await doCompetitionService.getRemainingTime(1);
   * // Returns:
   * // {
   * //   competitionSubmitId: 1,
   * //   totalMinutes: 60,
   * //   elapsedMinutes: 30,
   * //   remainingMinutes: 30,
   * //   isOverTime: false,
   * //   formattedRemaining: "30:00",
   * //   formattedElapsed: "30:00"
   * // }
   */
  getRemainingTime: async (submitId) => {
    return await axiosClient.get(
      API_ENDPOINTS.DO_COMPETITION.GET_REMAINING_TIME(submitId)
    );
  },

  /**
   * Get competition exam content
   * Lấy đề thi của competition
   * 
   * @param {string|number} competitionId - ID của cuộc thi
   * @returns {Promise<Object>} Exam data with sections and questions
   * 
   * @example
   * const exam = await doCompetitionService.getExam(1);
   * // Returns:
   * // {
   * //   examId: 1,
   * //   title: "Đề thi Toán học",
   * //   description: "...",
   * //   sections: [...],
   * //   questions: [],
   * //   totalQuestions: 20
   * // }
   */
  getExam: async (competitionId) => {
    return await axiosClient.get(
      API_ENDPOINTS.DO_COMPETITION.GET_EXAM(competitionId)
    );
  },

  /**
   * Get answers for a competition submit
   * Lấy danh sách câu trả lời của lần làm bài
   *
   * @param {string|number} submitId - ID của competition submit
   * @returns {Promise<Object>} Answers data
   *
   * @example
   * const answers = await doCompetitionService.getAnswers(1);
   * // Returns:
   * // [
   * //   { answerId: 1, questionId: 10, selectedOptionId: 3, isCorrect: null },
   * //   ...
   * // ]
   */
  getAnswers: async (submitId) => {
    return await axiosClient.get(
      API_ENDPOINTS.DO_COMPETITION.GET_ANSWERS(submitId)
    );
  },

  /**
   * Submit or update an answer for a question
   * Nộp / cập nhật câu trả lời cho một câu hỏi
   *
   * @param {string|number} submitId   - Competition submit ID
   * @param {string|number} answerId   - competitionAnswerId (0 nếu chưa có, server sẽ tạo mới)
   * @param {Object}        body       - SubmitCompetitionAnswerDto (không cần questionId — lấy từ URL)
   *   @param {string}      [body.answer]                - SHORT_ANSWER / ESSAY
   *   @param {number[]}    [body.selectedStatementIds]  - SINGLE_CHOICE / MULTIPLE_CHOICE
   *   @param {Array}       [body.trueFalseAnswers]       - TRUE_FALSE: [{statementId, isTrue}]
   *   @param {number}      [body.timeSpentSeconds]
   * @returns {Promise<Object>} Created or updated competition answer
   */
  submitAnswer: async (submitId, answerId, body) => {
    return await axiosClient.post(
      API_ENDPOINTS.DO_COMPETITION.SUBMIT_ANSWER(submitId, answerId),
      body
    );
  },

  /**
   * Finish a competition submit
   * Nộp bài và kết thúc lần làm bài
   *
   * @param {string|number} submitId - ID của competition submit
   * @returns {Promise<Object>} Final result of the submission
   *
   * @example
   * const result = await doCompetitionService.finishSubmit(1);
   */
  finishSubmit: async (submitId, body = {}) => {
    return await axiosClient.post(
      API_ENDPOINTS.DO_COMPETITION.FINISH_SUBMIT(submitId),
      body
    );
  },

  /**
   * Get result of a competition submit
   * Lấy kết quả sau khi nộp bài
   *
   * @param {string|number} submitId - ID của competition submit
   * @returns {Promise<Object>} Submit result data
   *
   * @example
   * const result = await doCompetitionService.getSubmitResult(1);
   */
  getSubmitResult: async (submitId) => {
    return await axiosClient.get(
      API_ENDPOINTS.DO_COMPETITION.GET_SUBMIT_RESULT(submitId)
    );
  },
};

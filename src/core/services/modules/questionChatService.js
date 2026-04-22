/**
 * Question Chat Service
 * Handles question chat and chat message related API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export const questionChatService = {
    /**
     * Create a new question chat.
     *
     * @route POST /question-chats
     * @param {Object} body - { questionId: number, title?: string }
     * @returns {Promise<Object>} BaseResponseDto<QuestionChatResponseDto>
     *
     * @example
     * questionChatService.createChat({ questionId: 1, title: 'Hỏi về câu 1' })
     */
    createChat: (body) => {
        return axiosClient.post(API_ENDPOINTS.QUESTION_CHATS.CREATE, body);
    },

    /**
     * Get a question chat by ID (includes messages).
     *
     * @route GET /question-chats/:id
     * @param {number|string} chatId - Chat ID
     * @returns {Promise<Object>} BaseResponseDto<QuestionChatResponseDto>
     *
     * @example
     * questionChatService.getChatById(1)
     */
    getChatById: (chatId) => {
        return axiosClient.get(API_ENDPOINTS.QUESTION_CHATS.DETAIL(chatId));
    },

    /**
     * Get list of my question chats (paginated).
     *
     * @route GET /question-chats
     * @param {Object} query - { page?, limit?, search?, questionId?, sortBy?, sortOrder? }
     * @returns {Promise<Object>} PaginationResponseDto<QuestionChatResponseDto>
     *
     * @example
     * questionChatService.getMyChats({ page: 1, limit: 10, questionId: 5 })
     */
    getMyChats: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTION_CHATS.LIST, {
            params: query,
        });
    },

    /**
     * Get messages of a chat (paginated).
     *
     * @route GET /question-chat-messages?chatId=xxx
     * @param {Object} query - { chatId: number, page?, limit? }
     * @returns {Promise<Object>} PaginationResponseDto<QuestionChatMessageResponseDto>
     *
     * @example
     * questionChatService.getMessages({ chatId: 1, page: 1, limit: 20 })
     */
    getMessages: (query = {}) => {
        return axiosClient.get(API_ENDPOINTS.QUESTION_CHAT_MESSAGES.LIST, {
            params: query,
        });
    },

    /**
     * Send a message in a chat.
     *
     * @route POST /question-chat-messages
     * @param {Object} body - { chatId: number, content: string, role?: string }
     * @returns {Promise<Object>} BaseResponseDto<QuestionChatMessageResponseDto>
     *
     * @example
     * questionChatService.sendMessage({ chatId: 1, content: 'Tại sao đáp án là A?' })
     */
    sendMessage: (body) => {
        return axiosClient.post(API_ENDPOINTS.QUESTION_CHAT_MESSAGES.CREATE, body);
    },
};

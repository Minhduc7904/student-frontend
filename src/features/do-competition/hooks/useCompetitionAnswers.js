import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCompetitionAnswers,
    selectAnswers,
    selectAnswersLoading,
    selectAnswersError,
} from '../store/doCompetitionSlice';

/**
 * Custom Hook: useCompetitionAnswers
 * Quản lý việc lấy danh sách câu trả lời của lần làm bài
 *
 * @param {number|string} submitId - Competition Submit ID
 * @param {Object} options
 * @param {boolean} options.autoFetch - Auto fetch on mount (default: true)
 * @param {Function} options.onSuccess - Callback khi fetch thành công
 * @param {Function} options.onError - Callback khi có lỗi
 *
 * @returns {Object} Answers state and controls
 *
 * @example
 * const {
 *   answers,
 *   answeredIds,
 *   loading,
 *   error,
 *   refresh,
 * } = useCompetitionAnswers(submitId);
 */
export const useCompetitionAnswers = (submitId, options = {}) => {
    const {
        autoFetch = true,
        enabled = true,  // Chỉ fetch khi enabled = true (ví dụ: sau khi exam đã load xong)
        onSuccess = null,
        onError = null,
    } = options;

    const dispatch = useDispatch();

    // Redux state
    const answers = useSelector(selectAnswers);
    const loading = useSelector(selectAnswersLoading);
    const error = useSelector(selectAnswersError);

    /**
     * Fetch answers
     */
    const fetchAnswers = useCallback(async () => {
        if (!submitId) return;

        try {
            const result = await dispatch(getCompetitionAnswers(submitId)).unwrap();
            if (onSuccess) onSuccess(result.data);
            return result.data;
        } catch (err) {
            if (onError) onError(err);
            throw err;
        }
    }, [submitId, dispatch]);

    /**
     * Manual refresh
     */
    const refresh = useCallback(() => fetchAnswers(), [fetchAnswers]);

    /**
     * Auto fetch on mount - chỉ khi enabled = true
     */
    useEffect(() => {
        if (!submitId || !autoFetch || !enabled) return;
        fetchAnswers();
    }, [submitId, autoFetch, enabled, fetchAnswers]);

    /**
     * Derived: Set<questionId> cho các câu đã trả lời (isAnswered === true)
     * Dùng để highlight nút câu hỏi màu xanh lá trong sidebar
     */
    const answeredIds = useMemo(
        () => new Set(answers.filter((a) => a.isAnswered === true).map((a) => a.questionId)),
        [answers]
    );

    /**
     * Derived: Map<questionId, answer> để truy cập nhanh
     */
    const answersMap = useMemo(
        () => new Map(answers.map((a) => [a.questionId, a])),
        [answers]
    );

    return {
        // Raw
        answers,

        // Derived
        answeredIds,
        answersMap,
        totalAnswered: answeredIds.size,
        hasAnswers: answeredIds.size > 0,

        // Status
        loading,
        error,

        // Controls
        refresh,
    };
};

export default useCompetitionAnswers;

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCompetitionExam,
    selectCompetition,
    selectExam,
    selectSections,
    selectUnassignedQuestions,
    selectExamLoading,
    selectExamError
} from '../store/doCompetitionSlice';

/**
 * Custom Hook: useCompetitionExam
 * Quản lý việc lấy đề thi competition
 * 
 * @param {number|string} competitionId - Competition ID
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Auto fetch on mount (default: true)
 * @param {Function} options.onSuccess - Callback when fetch succeeds
 * @param {Function} options.onError - Callback when error occurs
 * 
 * @returns {Object} Exam state and controls
 * 
 * @example
 * const { 
 *   exam,
 *   sections,
 *   unassignedQuestions,
 *   loading,
 *   error,
 *   refresh
 * } = useCompetitionExam(competitionId, {
 *   onSuccess: (data) => console.log('Loaded:', data),
 *   onError: (err) => console.error(err)
 * });
 */
export const useCompetitionExam = (competitionId, options = {}) => {
    const {
        autoFetch = true,
        onSuccess = null,
        onError = null,
    } = options;

    const dispatch = useDispatch();
    
    // Redux state
    const competition = useSelector(selectCompetition);
    const exam = useSelector(selectExam);
    const sections = useSelector(selectSections);
    const unassignedQuestions = useSelector(selectUnassignedQuestions);
    const loading = useSelector(selectExamLoading);
    const error = useSelector(selectExamError);

    /**
     * Fetch exam data
     */
    const fetchExam = useCallback(async () => {
        if (!competitionId) return;

        try {
            const result = await dispatch(getCompetitionExam(competitionId)).unwrap();
            
            if (onSuccess) {
                onSuccess(result.data);
            }

            return result.data;
        } catch (err) {
            if (onError) {
                onError(err);
            }
            throw err;
        }
    }, [competitionId, dispatch]);

    /**
     * Manual refresh
     */
    const refresh = useCallback(() => {
        return fetchExam();
    }, [fetchExam]);

    /**
     * Auto fetch on mount
     */
    useEffect(() => {
        if (!competitionId || !autoFetch) return;

        fetchExam();
    }, [competitionId, autoFetch, fetchExam]);

    /**
     * Derived state
     */
    const totalQuestions = exam?.totalQuestions ?? 0;
    const hasExam = exam !== null;
    const hasSections = sections.length > 0;
    const hasUnassignedQuestions = unassignedQuestions.length > 0;

    // Tính tổng số câu hỏi từ sections
    const totalQuestionsInSections = sections.reduce(
        (total, section) => total + (section.questions?.length ?? 0),
        0
    );

    return {
        // Raw data
        competition,
        exam,
        sections,
        unassignedQuestions,

        // Status
        loading,
        error,

        // Derived
        hasExam,
        hasSections,
        hasUnassignedQuestions,
        totalQuestions,
        totalQuestionsInSections,

        // Controls
        refresh,
    };
};

export default useCompetitionExam;

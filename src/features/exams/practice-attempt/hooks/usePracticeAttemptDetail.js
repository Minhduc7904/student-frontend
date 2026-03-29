import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPublicStudentExam,
    fetchPublicStudentExamAttemptDetail,
    fetchPublicStudentQuestionAnswersByAttempt,
    selectCurrentPracticeAttemptId,
    selectCurrentPracticeExamContentId,
    selectCurrentPracticeQuestionAnswersAttemptId,
    selectHasFetchedPracticeAttemptDetail,
    selectHasFetchedPracticeAttemptDetailSuccess,
    selectHasFetchedPracticeExamContent,
    selectHasFetchedPracticeExamContentSuccess,
    selectHasFetchedPracticeQuestionAnswersByAttempt,
    selectPracticeAttemptDetail,
    selectPracticeExamContent,
    selectPracticeExamContentError,
    selectPracticeExamContentLoading,
    selectPracticeQuestionAnswersByAttemptError,
    selectPracticeQuestionAnswersByAttemptLoading,
    selectPracticeAttemptError,
    selectPracticeAttemptLoading,
} from '../store/practiceAttemptSlice';

export const usePracticeAttemptDetail = (attemptId) => {
    const dispatch = useDispatch();
    const attemptDetail = useSelector(selectPracticeAttemptDetail);
    const loading = useSelector(selectPracticeAttemptLoading);
    const error = useSelector(selectPracticeAttemptError);
    const examContent = useSelector(selectPracticeExamContent);
    const examContentLoading = useSelector(selectPracticeExamContentLoading);
    const examContentError = useSelector(selectPracticeExamContentError);
    const currentAttemptId = useSelector(selectCurrentPracticeAttemptId);
    const currentExamContentId = useSelector(selectCurrentPracticeExamContentId);
    const currentQuestionAnswersAttemptId = useSelector(selectCurrentPracticeQuestionAnswersAttemptId);
    const hasFetchedAttemptDetail = useSelector(selectHasFetchedPracticeAttemptDetail);
    const hasFetchedAttemptDetailSuccess = useSelector(selectHasFetchedPracticeAttemptDetailSuccess);
    const hasFetchedExamContent = useSelector(selectHasFetchedPracticeExamContent);
    const hasFetchedExamContentSuccess = useSelector(selectHasFetchedPracticeExamContentSuccess);
    const questionAnswersLoading = useSelector(selectPracticeQuestionAnswersByAttemptLoading);
    const questionAnswersError = useSelector(selectPracticeQuestionAnswersByAttemptError);
    const hasFetchedQuestionAnswersByAttempt = useSelector(selectHasFetchedPracticeQuestionAnswersByAttempt);

    const normalizedAttemptId = useMemo(() => {
        if (!attemptId) return null;
        const parsed = Number(attemptId);
        return Number.isNaN(parsed) ? attemptId : parsed;
    }, [attemptId]);

    useEffect(() => {
        if (!normalizedAttemptId) return;
        if (String(currentAttemptId) === String(normalizedAttemptId) && attemptDetail) return;

        dispatch(fetchPublicStudentExamAttemptDetail(normalizedAttemptId));
    }, [attemptDetail, currentAttemptId, dispatch, normalizedAttemptId]);

    const isCurrentAttempt =
        normalizedAttemptId != null && String(currentAttemptId) === String(normalizedAttemptId);

    const hasCalledAttemptDetail = isCurrentAttempt && hasFetchedAttemptDetail;
    const hasCalledAttemptDetailSuccess = isCurrentAttempt && hasFetchedAttemptDetailSuccess;
    const normalizedAttemptStatus = String(attemptDetail?.status || '').trim().toUpperCase();
    const isSubmittedAttempt = normalizedAttemptStatus === 'SUBMITED' || normalizedAttemptStatus === 'SUBMITTED';
    const shouldSkipFollowupFetches = isSubmittedAttempt || Boolean(attemptDetail?.isOverTime);
    const isCurrentExamContent =
        attemptDetail?.examId != null && String(currentExamContentId) === String(attemptDetail.examId);
    const hasCalledExamContent = isCurrentExamContent && hasFetchedExamContent;
    const hasCalledExamContentSuccess = isCurrentExamContent && hasFetchedExamContentSuccess;

    const hasCalledQuestionAnswersByAttempt =
        normalizedAttemptId != null &&
        String(currentQuestionAnswersAttemptId) === String(normalizedAttemptId) &&
        hasFetchedQuestionAnswersByAttempt;

    useEffect(() => {
        if (!hasCalledAttemptDetail || !hasCalledAttemptDetailSuccess) return;
        if (shouldSkipFollowupFetches) return;

        const examId = attemptDetail?.examId;
        const questionIds = Array.isArray(attemptDetail?.questionIds) ? attemptDetail.questionIds : [];
        if (!examId || questionIds.length === 0) return;

        if (hasCalledExamContent && hasCalledExamContentSuccess) return;

        dispatch(
            fetchPublicStudentExam({
                examId,
                questionIds,
            })
        );
    }, [
        attemptDetail,
        dispatch,
        hasCalledAttemptDetail,
        hasCalledAttemptDetailSuccess,
        hasCalledExamContent,
        hasCalledExamContentSuccess,
        shouldSkipFollowupFetches,
    ]);

    useEffect(() => {
        if (!hasCalledExamContent || !hasCalledExamContentSuccess) return;
        if (!normalizedAttemptId) return;
        if (hasCalledQuestionAnswersByAttempt) return;
        if (shouldSkipFollowupFetches) return;

        dispatch(fetchPublicStudentQuestionAnswersByAttempt(normalizedAttemptId));
    }, [
        dispatch,
        hasCalledExamContent,
        hasCalledExamContentSuccess,
        hasCalledQuestionAnswersByAttempt,
        normalizedAttemptId,
        shouldSkipFollowupFetches,
    ]);

    return {
        attemptDetail,
        loading,
        error,
        currentAttemptId,
        normalizedAttemptId,
        hasCalledAttemptDetail,
        hasCalledAttemptDetailSuccess,
        hasCalledExamContent,
        hasCalledExamContentSuccess,
        examContent,
        examContentLoading,
        examContentError,
        questionAnswersLoading,
        questionAnswersError,
        hasCalledQuestionAnswersByAttempt,
    };
};

export default usePracticeAttemptDetail;

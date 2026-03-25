import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PageLoading } from '../../shared/components/loading';
import { useCompetitionTimer, useCompetitionExam, useCompetitionAnswers } from './hooks';
import { selectCurrentAttempt, submitCompetitionAnswer, applyOptimisticAnswer, finishCompetition, selectFinishSubmitLoading, selectTotalAnswered, selectTotalErrors } from './store/doCompetitionSlice';
import { ROUTES } from '../../core/constants';
import { CompetitionHeader } from './layout/CompetitionHeader';
import { CompetitionContent } from './layout/CompetitionContent';
import { CompetitionSidebar } from './layout/CompetitionSidebar';
import { ConfirmModal } from './layout/ConfirmModal';

/**
 * Do Competition Page
 * Trang làm bài thi chính
 */
export const DoCompetition = ({ isHomeworkCompetition = false }) => {
    const { competitionId, submitId, courseId, lessonId, learningItemId, homeworkContentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy currentAttempt từ Redux để verify
    const currentAttempt = useSelector(selectCurrentAttempt);

    // Validate: Kiểm tra currentAttempt phải match với submitId
    useEffect(() => {
        const submitIdNum = parseInt(submitId, 10);

        if (!currentAttempt || currentAttempt.competitionSubmitId !== submitIdNum) {
            // Redirect về trang start nếu không có attempt hoặc không khớp
            console.warn('Invalid attempt or submitId mismatch. Redirecting to start...');
            if (isHomeworkCompetition) {
                navigate(ROUTES.DO_HOMEWORK_COMPETITION_START(courseId, lessonId, learningItemId, homeworkContentId, competitionId), { replace: true });
            } else {
                navigate(ROUTES.DO_COMPETITION_START(competitionId), { replace: true });
            }
        }
    }, [currentAttempt, submitId, competitionId, navigate]);

    // Chỉ gọi hooks khi đã validate thành công
    const isValidAttempt = currentAttempt && currentAttempt.competitionSubmitId === parseInt(submitId, 10);

    // Return loading hoặc redirect nếu chưa validate
    if (!isValidAttempt) {
        return <PageLoading message="Đang kiểm tra phiên làm bài..." />;
    }

    // Ref để gọi handleFinishCompetition từ bên trong onTimeUp (tránh closure stale)
    const autoSubmitRef = useRef(null);

    // Sử dụng custom hook để quản lý thời gian (chỉ khi đã validate)
    const {
        timeData,
        loading: timeLoading,
        error: timeError,
        isOverTime,
        remainingMinutes,
        remainingSeconds,
        formattedTime,
        totalMinutes,
        elapsedMinutes,
        refresh: refreshTime,
    } = useCompetitionTimer(submitId, {
        autoStart: true,
        onTimeUp: (data) => {
            console.log('Time is up! Auto submitting...', data);
            autoSubmitRef.current?.();
        },
        onError: (error) => {
            console.error('Error fetching time:', error);
        },
    });

    // Sử dụng custom hook để lấy đề thi (chỉ khi đã validate)
    const {
        competition,
        exam,
        sections,
        unassignedQuestions,
        loading: examLoading,
        error: examError,
        hasExam,
        hasSections,
        totalQuestions,
        refresh: refreshExam,
    } = useCompetitionExam(competitionId, {
        autoFetch: true,
        onSuccess: (data) => {
            console.log('Exam loaded:', data);
        },
        onError: (error) => {
            console.error('Error loading exam:', error);
        },
    });

    // Sử dụng custom hook để lấy câu trả lời (chỉ khi exam đã load xong)
    const {
        answers,
        answeredIds,
        answersMap,
        totalAnswered,
        loading: answersLoading,
        error: answersError,
        refresh: refreshAnswers,
    } = useCompetitionAnswers(submitId, {
        autoFetch: true,
        enabled: hasExam,  // Chứ exam load xong mới gọi answers
        onSuccess: (data) => {
            console.log('Answers loaded:', data);
        },
        onError: (error) => {
            console.error('Error loading answers:', error);
        },
    });

    // ID câu hỏi đang được focus/highlight (dùng cho sidebar và scroll)
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    // Mobile sidebar overlay
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Ref to CompetitionContent's scrollToQuestion function
    const contentScrollRef = useRef(null);

    // Per-question debounce timers for API submission (avoid rapid-fire requests)
    const submitTimersRef = useRef({});

    const finishLoading = useSelector(selectFinishSubmitLoading);
    const totalAnsweredCount = useSelector(selectTotalAnswered);
    const totalErrorsCount = useSelector(selectTotalErrors);

    // Confirmation modal state
    const [confirmModal, setConfirmModal] = useState({ open: false, type: null });

    /**
     * Nộp bài và điều hướng sau khi hoàn thành
     */
    const handleFinishCompetition = useCallback(async () => {
        setConfirmModal({ open: false, type: null });
        try {
            const finishResult = await dispatch(finishCompetition({
                submitId,
                homeworkContentId: isHomeworkCompetition ? homeworkContentId : undefined,
            })).unwrap();

            const finishedSubmitId =
                finishResult?.data?.competitionSubmitId ??
                finishResult?.competitionSubmitId ??
                currentAttempt?.competitionSubmitId ??
                submitId;

            if (isHomeworkCompetition) {
                const canShowHomeworkResultDetail = Boolean(competition?.showResultDetail);

                if (canShowHomeworkResultDetail && finishedSubmitId) {
                    navigate(
                        ROUTES.COURSE_LEARNING_ITEM_RESULT(courseId, lessonId, learningItemId, finishedSubmitId),
                        { replace: true, state: { resetAll: true } }
                    );
                } else {
                    navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId), { replace: true, state: { resetAll: true } });
                }
            } else {
                const canShowResultDetail = Boolean(competition?.showResultDetail);
                const canViewScore = Boolean(competition?.allowViewScore);

                if (canShowResultDetail && finishedSubmitId) {
                    navigate(ROUTES.COMPETITION_RESULT(competitionId, finishedSubmitId), { replace: true });
                } else if (canViewScore) {
                    navigate(`${ROUTES.COMPETITION_DETAIL(competitionId)}/history`, { replace: true });
                } else {
                    navigate(ROUTES.COMPETITION_DETAIL(competitionId), { replace: true });
                }
            }
        } catch {
            // lỗi đã được toast bởi handleAsyncThunk
        }
    }, [dispatch, submitId, isHomeworkCompetition, homeworkContentId, courseId, lessonId, learningItemId, navigate, competition, currentAttempt, competitionId]);

    // Request submit confirmation (from header or sidebar)
    const requestSubmit = useCallback(() => {
        setConfirmModal({ open: true, type: 'submit' });
    }, []);

    // Cập nhật ref mỗi khi handleFinishCompetition thay đổi
    autoSubmitRef.current = handleFinishCompetition;

    /**
     * Quay về (header button)
     */
    const handleGoBack = useCallback(() => {
        if (isHomeworkCompetition) {
            navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId), { state: { resetAll: true } });
        } else {
            navigate(ROUTES.DASHBOARD);
        }
    }, [isHomeworkCompetition, courseId, lessonId, learningItemId, navigate]);

    // Request go-back confirmation
    const requestGoBack = useCallback(() => {
        setConfirmModal({ open: true, type: 'goback' });
    }, []);

    // Handle confirm modal actions
    const handleConfirmAction = useCallback(() => {
        if (confirmModal.type === 'submit') {
            handleFinishCompetition();
        } else if (confirmModal.type === 'goback') {
            setConfirmModal({ open: false, type: null });
            handleGoBack();
        }
    }, [confirmModal.type, handleFinishCompetition, handleGoBack]);

    const handleCancelConfirm = useCallback(() => {
        setConfirmModal({ open: false, type: null });
    }, []);

    // Called only from sidebar: select + scroll to question
    const handleSidebarQuestionClick = useCallback((questionId) => {
        setCurrentQuestionId(questionId);
        setSidebarOpen(false);
        contentScrollRef.current?.(questionId);
    }, []);

    // Called only from QuestionCard click: select without scrolling
    const handleCardSelect = useCallback((questionId) => {
        setCurrentQuestionId(questionId);
    }, []);

    /**
     * Handle answer selection from QuestionCard
     * Builds DTO body based on question type (no questionId in body — it's in the URL via answerId)
     */
    const handleAnswerSelect = useCallback(
        ({ questionId, questionType, statementId, isTrue, answerText }) => {
            const currentAnswer = answersMap.get(questionId);
            const answerId = currentAnswer?.competitionAnswerId ?? 0;

            let body;
            if (questionType === 'SINGLE_CHOICE') {
                body = { selectedStatementIds: [statementId] };
            } else if (questionType === 'MULTIPLE_CHOICE') {
                const existing = currentAnswer?.selectedStatementIds ?? [];
                const isSelected = existing.includes(statementId);
                body = {
                    selectedStatementIds: isSelected
                        ? existing.filter((id) => id !== statementId)
                        : [...existing, statementId],
                };
            } else if (questionType === 'TRUE_FALSE') {
                // Cập nhật entry cho statementId, chỉ gửi những statement đã có isTrue (bỏ qua null/undefined)
                const existing = currentAnswer?.trueFalseAnswers ?? [];
                const updated = existing.filter((a) => a.statementId !== statementId);
                if (isTrue !== null && isTrue !== undefined) {
                    updated.push({ statementId, isTrue });
                }
                body = { trueFalseAnswers: updated.filter((a) => a.isTrue !== null && a.isTrue !== undefined) };
            } else if (questionType === 'SHORT_ANSWER' || questionType === 'ESSAY') {
                body = { answer: answerText ?? '' };
            } else {
                // unhandled type
                return;
            }

            // Optimistic update — patch UI immediately, no wait for API
            dispatch(applyOptimisticAnswer({ questionId, body }));

            // SHORT_ANSWER / ESSAY / TRUE_FALSE — call API directly (no debounce)
            if (questionType === 'SHORT_ANSWER' || questionType === 'ESSAY' || questionType === 'TRUE_FALSE') {
                dispatch(submitCompetitionAnswer({ submitId, answerId, questionId, body }));
                return;
            }

            // For choice questions: debounce per-question so rapid selections batch into one request
            if (submitTimersRef.current[questionId]) {
                clearTimeout(submitTimersRef.current[questionId]);
            }
            submitTimersRef.current[questionId] = setTimeout(() => {
                delete submitTimersRef.current[questionId];
                dispatch(submitCompetitionAnswer({ submitId, answerId, questionId, body }));
            }, 1000);
        },
        [answersMap, submitId, dispatch]
    );

    // Show loading while fetching initial data
    if ((timeLoading && !timeData) || (examLoading && !hasExam) || (hasExam && answersLoading && !answers.length)) {
        return <PageLoading message="Đang tải thông tin bài thi..." />;
    }

    return (
        <div className="h-dvh flex flex-col bg-gray-50">
            <CompetitionHeader
                competition={competition}
                loading={examLoading && !competition}
                onToggleSidebar={() => setSidebarOpen((v) => !v)}
                onGoBack={requestGoBack}
                onSubmit={requestSubmit}
                submitLoading={finishLoading}
                backLabel={isHomeworkCompetition ? 'Khóa học' : 'Trang chủ'}
            />
            {/* Body: fill remaining height, no outer scroll */}
            {/* Mobile header = h-12 (row1) + h-8 (row2) = 80px = mt-20; md+ = mt-16; lg = mt-17 */}
            <div className="flex flex-1 overflow-hidden mt-20 md:mt-16 lg:mt-17">
                <CompetitionContent
                    sections={sections}
                    unassignedQuestions={unassignedQuestions}
                    loading={examLoading && !hasExam}
                    onAnswerSelect={handleAnswerSelect}
                    onSelect={handleCardSelect}
                    currentQuestionId={currentQuestionId}
                    scrollToRef={contentScrollRef}
                />
                <CompetitionSidebar
                    competition={competition}
                    sections={sections}
                    unassignedQuestions={unassignedQuestions}
                    formattedTime={formattedTime}
                    remainingSeconds={remainingSeconds}
                    isOverTime={isOverTime}
                    answeredIds={answeredIds}
                    currentQuestionId={currentQuestionId}
                    onQuestionClick={handleSidebarQuestionClick}
                    loading={examLoading && !hasExam}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onSubmit={requestSubmit}
                    submitLoading={finishLoading}
                    totalQuestions={totalQuestions}
                    totalAnswered={totalAnsweredCount}
                    totalErrors={totalErrorsCount}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                open={confirmModal.open}
                type={confirmModal.type}
                onConfirm={handleConfirmAction}
                onCancel={handleCancelConfirm}
                submitLoading={finishLoading}
                totalQuestions={totalQuestions}
                totalAnswered={totalAnsweredCount}
                totalErrors={totalErrorsCount}
            />
        </div>
    );
};

export default DoCompetition;

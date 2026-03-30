import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useBlocker } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LogOut, Send } from 'lucide-react';
import { Card } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import { usePracticeAttemptDetail } from './hooks/usePracticeAttemptDetail';
import PracticeAttemptSectionTabs from './component/PracticeAttemptSectionTabs';
import PracticeAttemptConfirmModal from './component/PracticeAttemptConfirmModal';
import {
    clearPracticeAttempt,
    submitPublicStudentQuestionAnswer,
    selectPracticeSubmitAttemptLoading,
    submitPublicStudentExamAttempt,
} from './store/practiceAttemptSlice';

const getScrollParent = (element) => {
    if (!element) return null;

    let parent = element.parentElement;
    while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return parent;
        }
        parent = parent.parentElement;
    }

    return null;
};

const resolveNavigationUrl = (path = '') => {
    if (!path) return '/';
    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!normalizedBase) return normalizedPath;
    if (normalizedPath === normalizedBase || normalizedPath.startsWith(`${normalizedBase}/`)) {
        return normalizedPath;
    }

    return `${normalizedBase}${normalizedPath}`;
};

const ExamPracticeAttemptPage = () => {
    const dispatch = useDispatch();
    const { attemptId, typeExam, typeexam, id } = useParams();
    const [showFloatingHeader, setShowFloatingHeader] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const headerRef = useRef(null);
    const lastScrollTopRef = useRef(0);
    const {
        attemptDetail,
        loading,
        error,
        examContent,
        examContentLoading,
        examContentError,
    } = usePracticeAttemptDetail(attemptId);
    const submitAttemptLoading = useSelector(selectPracticeSubmitAttemptLoading);
    const [allowNavigation, setAllowNavigation] = useState(false);
    const [hasFinishedAttempt, setHasFinishedAttempt] = useState(false);
    const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
    const [isAlreadySubmittedModalOpen, setIsAlreadySubmittedModalOpen] = useState(false);
    const [isAutoSubmittedModalOpen, setIsAutoSubmittedModalOpen] = useState(false);
    const [questionElapsedSeconds, setQuestionElapsedSeconds] = useState(0);
    const shouldBlockExit = attemptDetail?.status === 'IN_PROGRESS' && !allowNavigation && !hasFinishedAttempt;
    const blocker = useBlocker(shouldBlockExit);
    const autoSubmitTriggeredRef = useRef(false);
    const alreadySubmittedModalShownRef = useRef(false);
    const skipBeforeUnloadPromptRef = useRef(false);

    const resolvedTypeExam = typeExam || typeexam;

    const handleSubmitQuestionAnswer = useCallback(async (payload) => {
        const questionId = payload?.questionId;
        if (!attemptId || questionId == null) return null;

        const timeSpentSeconds = Math.max(0, Math.round(Number(questionElapsedSeconds) || 0));

        const resultAction = await dispatch(
            submitPublicStudentQuestionAnswer({
                ...payload,
                timeSpentSeconds,
            })
        );

        if (resultAction?.meta?.requestStatus === 'fulfilled') {
            setQuestionElapsedSeconds(0);
        }

        return resultAction;
    }, [attemptId, dispatch, questionElapsedSeconds]);

    const queueNavigateToExamDetail = useCallback((overrideTypeExam, overrideId) => {
        const nextTypeExam = overrideTypeExam || resolvedTypeExam;
        const nextId = overrideId || id;
        const nextPath = nextTypeExam && nextId
            ? ROUTES.EXAM_TYPE_DETAIL(nextTypeExam, nextId)
            : ROUTES.EXAMS;

        setAllowNavigation(true);
        skipBeforeUnloadPromptRef.current = true;
        window.location.assign(resolveNavigationUrl(nextPath));
    }, [id, resolvedTypeExam]);

    const queueNavigateToExamResult = useCallback((overrideTypeExam, overrideId, overrideAttemptId) => {
        const nextTypeExam = overrideTypeExam || resolvedTypeExam;
        const nextId = overrideId || id;
        const nextAttemptId = overrideAttemptId || attemptId;
        const nextPath = nextTypeExam && nextId && nextAttemptId
            ? ROUTES.EXAM_TYPE_ATTEMPT_RESULT(nextTypeExam, nextId, nextAttemptId)
            : ROUTES.EXAMS;

        setAllowNavigation(true);
        skipBeforeUnloadPromptRef.current = true;
        window.location.assign(resolveNavigationUrl(nextPath));
    }, [attemptId, id, resolvedTypeExam]);

    const handleConfirmBlockedNavigation = useCallback(() => {
        const blockedPath = blocker?.location
            ? `${blocker.location.pathname || ''}${blocker.location.search || ''}${blocker.location.hash || ''}`
            : '';

        setAllowNavigation(true);
        skipBeforeUnloadPromptRef.current = true;
        blocker.reset?.();
        window.location.assign(resolveNavigationUrl(blockedPath || ROUTES.EXAMS));
    }, [blocker]);

    const handleHeaderBack = useCallback(() => {
        if (shouldBlockExit) {
            setIsExitConfirmModalOpen(true);
            return;
        }

        queueNavigateToExamDetail();
    }, [queueNavigateToExamDetail, shouldBlockExit]);

    const handleCloseExitConfirmModal = useCallback(() => {
        setIsExitConfirmModalOpen(false);
        blocker.reset?.();
    }, [blocker]);

    const handleConfirmExitFromModal = useCallback(() => {
        setIsExitConfirmModalOpen(false);

        if (blocker.state === 'blocked') {
            handleConfirmBlockedNavigation();
            return;
        }

        queueNavigateToExamDetail();
    }, [blocker.state, handleConfirmBlockedNavigation, queueNavigateToExamDetail]);

    const isUnlimitedTime = useMemo(() => {
        const duration = Number(attemptDetail?.duration ?? attemptDetail?.durationMinutes);
        return !Number.isFinite(duration) || duration <= 0;
    }, [attemptDetail?.duration, attemptDetail?.durationMinutes]);

    const getRemainingSeconds = () => {
        const duration = Number(attemptDetail?.duration ?? attemptDetail?.durationMinutes);
        if (!Number.isFinite(duration) || duration <= 0) return null;

        const totalSeconds = Math.round(duration * 60);

        const expectedEndAt = attemptDetail?.expectedEndAt ? new Date(attemptDetail.expectedEndAt) : null;
        const expectedEndAtMs = expectedEndAt?.getTime?.();
        if (Number.isFinite(expectedEndAtMs)) {
            return Math.max(0, Math.ceil((expectedEndAtMs - Date.now()) / 1000));
        }

        const startedAt = attemptDetail?.startedAt ? new Date(attemptDetail.startedAt) : null;
        const startedAtMs = startedAt?.getTime?.();
        if (Number.isFinite(startedAtMs)) {
            const expectedEndFromStartMs = startedAtMs + totalSeconds * 1000;
            return Math.max(0, Math.ceil((expectedEndFromStartMs - Date.now()) / 1000));
        }

        const apiRemainingSeconds = Number(attemptDetail?.remainingSeconds);
        if (Number.isFinite(apiRemainingSeconds)) {
            return Math.max(0, Math.round(apiRemainingSeconds));
        }

        return totalSeconds;
    };

    const normalizedAttemptStatus = String(attemptDetail?.status || '').trim().toUpperCase();
    const isSubmittedAttemptStatus = normalizedAttemptStatus === 'SUBMITED' || normalizedAttemptStatus === 'SUBMITTED';
    const isInProgressStatus = normalizedAttemptStatus === 'IN_PROGRESS';

    const handleOpenSubmitModal = () => {
        setIsSubmitModalOpen(true);
    };

    const handleCloseSubmitModal = () => {
        setIsSubmitModalOpen(false);
    };

    const handleConfirmSubmit = async () => {
        if (!attemptId || submitAttemptLoading) return;

        const resultAction = await dispatch(submitPublicStudentExamAttempt(attemptId));
        const payload = resultAction?.payload;
        const isSuccess = resultAction?.meta?.requestStatus === 'fulfilled' && payload?.success === true;

        if (!isSuccess) return;

        setHasFinishedAttempt(true);
        setIsSubmitModalOpen(false);
        queueNavigateToExamResult();
    };

    useEffect(() => {
        autoSubmitTriggeredRef.current = false;
        alreadySubmittedModalShownRef.current = false;
        skipBeforeUnloadPromptRef.current = false;
        setAllowNavigation(false);
        setHasFinishedAttempt(false);
        setIsExitConfirmModalOpen(false);
        setIsAlreadySubmittedModalOpen(false);
        setIsAutoSubmittedModalOpen(false);
        setQuestionElapsedSeconds(0);
    }, [attemptId]);

    useEffect(() => {
        if (!attemptId) return undefined;

        const timerId = window.setInterval(() => {
            setQuestionElapsedSeconds((prev) => prev + 1);
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [attemptId]);

    useEffect(() => {
        if (!attemptDetail || !isSubmittedAttemptStatus) return;
        if (alreadySubmittedModalShownRef.current) return;

        setHasFinishedAttempt(true);
        alreadySubmittedModalShownRef.current = true;
        setIsSubmitModalOpen(false);
        setIsAutoSubmittedModalOpen(false);
        setIsAlreadySubmittedModalOpen(true);
    }, [attemptDetail, isSubmittedAttemptStatus]);

    useEffect(() => {
        const handleSidebarSubmitSuccess = (event) => {
            const detail = event?.detail || {};
            setHasFinishedAttempt(true);
            queueNavigateToExamResult(detail?.typeExam, detail?.examId);
        };

        window.addEventListener('practice-attempt:submit-success', handleSidebarSubmitSuccess);
        return () => {
            window.removeEventListener('practice-attempt:submit-success', handleSidebarSubmitSuccess);
        };
    }, [queueNavigateToExamResult]);

    useEffect(() => {
        if (!attemptId || !shouldBlockExit || isUnlimitedTime) return undefined;
        if (isSubmittedAttemptStatus) return undefined;

        const tryAutoSubmit = async () => {
            if (autoSubmitTriggeredRef.current || submitAttemptLoading) return;

            const shouldSubmitByOvertime = Boolean(attemptDetail?.isOverTime) && isInProgressStatus;

            const remainingSeconds = getRemainingSeconds();
            const shouldSubmitByCountdown = remainingSeconds != null && remainingSeconds <= 0;
            if (!shouldSubmitByOvertime && !shouldSubmitByCountdown) return;

            autoSubmitTriggeredRef.current = true;

            const resultAction = await dispatch(submitPublicStudentExamAttempt(attemptId));
            const payload = resultAction?.payload;
            const isSuccess = resultAction?.meta?.requestStatus === 'fulfilled' && payload?.success === true;

            if (isSuccess) {
                setHasFinishedAttempt(true);
                if (shouldSubmitByOvertime) {
                    setIsSubmitModalOpen(false);
                    setIsAlreadySubmittedModalOpen(false);
                    setIsAutoSubmittedModalOpen(true);
                    return;
                }

                queueNavigateToExamResult();
                return;
            }

            autoSubmitTriggeredRef.current = false;
        };

        const timerId = window.setInterval(() => {
            tryAutoSubmit();
        }, 1000);

        tryAutoSubmit();

        return () => window.clearInterval(timerId);
    }, [
        attemptDetail?.isOverTime,
        attemptId,
        dispatch,
        isInProgressStatus,
        isSubmittedAttemptStatus,
        isUnlimitedTime,
        queueNavigateToExamResult,
        shouldBlockExit,
        submitAttemptLoading,
    ]);

    useEffect(() => {
        if (!shouldBlockExit) return undefined;

        const handleBeforeUnload = (event) => {
            if (skipBeforeUnloadPromptRef.current || hasFinishedAttempt) return;
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasFinishedAttempt, shouldBlockExit]);

    useEffect(() => {
        return () => {
            dispatch(clearPracticeAttempt());
        };
    }, [dispatch]);

    useEffect(() => {
        const headerElement = headerRef.current;
        if (!headerElement) return undefined;

        const scrollParent = getScrollParent(headerElement);

        const getCurrentScrollTop = () => {
            if (scrollParent) return scrollParent.scrollTop;
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        };

        const updateFloatingHeader = () => {
            const currentScrollTop = Math.max(0, getCurrentScrollTop());
            const isScrollingDown = currentScrollTop > lastScrollTopRef.current;

            if (currentScrollTop <= 0) {
                setShowFloatingHeader(false);
            } else if (isScrollingDown) {
                setShowFloatingHeader(true);
            } else {
                setShowFloatingHeader(false);
            }

            lastScrollTopRef.current = currentScrollTop;
        };

        lastScrollTopRef.current = Math.max(0, getCurrentScrollTop());
        setShowFloatingHeader(false);
        updateFloatingHeader();
        window.addEventListener('scroll', updateFloatingHeader, { passive: true });
        scrollParent?.addEventListener('scroll', updateFloatingHeader, { passive: true });
        window.addEventListener('resize', updateFloatingHeader);

        return () => {
            window.removeEventListener('scroll', updateFloatingHeader);
            scrollParent?.removeEventListener('scroll', updateFloatingHeader);
            window.removeEventListener('resize', updateFloatingHeader);
        };
    }, []);

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="h-4 w-72 rounded bg-slate-200" />
                    <div className="h-24 rounded-xl bg-slate-100" />
                </div>
            </Card>
        );
    }

    if (error) {
        const normalizedError = typeof error === 'string' ? error : error?.message || 'Không thể tải lượt làm bài.';

        return (
            <Card>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold">Tải dữ liệu thất bại</p>
                            <p className="mt-1 text-sm">{normalizedError}</p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleHeaderBack}
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft size={15} />
                    Quay lại
                </button>
            </Card>
        );
    }

    return (
        <section className="space-y-4">
            <div
                className={`fixed left-0 top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 ${showFloatingHeader ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="mx-auto w-full max-w-7xl px-4 py-3 xl:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className='flex flex-row gap-2 items-baseline'>
                            <div className='shrink-0'>
                                <button
                                    type="button"
                                    onClick={handleHeaderBack}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    <ArrowLeft size={15} />
                                    Quay lại
                                </button>
                            </div>
                            <h2 className="line-clamp-1 min-w-0 text-lg font-semibold text-slate-900">
                                {attemptDetail?.examTitle || 'Luyện tập đề thi'}
                            </h2>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">

                            <button
                                type="button"
                                onClick={handleOpenSubmitModal}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-blue-700"
                            >
                                <Send size={14} />
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={headerRef}>
                <Card>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Luyện tập đề thi</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                {attemptDetail?.examTitle || 'Luyện tập theo lượt làm bài đã chọn.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleHeaderBack}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <ArrowLeft size={15} />
                                Quay lại
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenSubmitModal}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-blue-700"
                            >
                                <Send size={14} />
                                Nộp bài
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            <PracticeAttemptSectionTabs
                examContent={examContent}
                loading={examContentLoading}
                error={examContentError}
                attemptId={attemptId}
                onSubmitQuestionAnswer={handleSubmitQuestionAnswer}
            />

            <PracticeAttemptConfirmModal
                isOpen={blocker.state === 'blocked' || isExitConfirmModalOpen}
                onClose={handleCloseExitConfirmModal}
                title="Bạn chắc chắn muốn thoát chứ?"
                description="Bạn đang làm bài. Nếu thoát khỏi trang này, quá trình làm bài có thể bị gián đoạn."
                cancelLabel="Ở lại"
                confirmLabel="Thoát trang"
                onConfirm={handleConfirmExitFromModal}
                confirmIcon={<LogOut size={14} />}
            />

            <PracticeAttemptConfirmModal
                isOpen={isSubmitModalOpen}
                onClose={handleCloseSubmitModal}
                title="Bạn chắc chắn muốn nộp bài chứ?"
                description="Sau khi nộp bài, hệ thống sẽ chấm điểm theo dữ liệu hiện tại của bạn."
                cancelLabel="Hủy"
                confirmLabel={submitAttemptLoading ? 'Đang nộp...' : 'Xác nhận nộp bài'}
                onConfirm={handleConfirmSubmit}
                confirmIcon={<Send size={14} />}
            />

            <PracticeAttemptConfirmModal
                isOpen={isAlreadySubmittedModalOpen}
                onClose={() => {}}
                title="Bạn đã nộp bài này rồi"
                description="Lượt làm bài này đã ở trạng thái đã nộp. Bạn có thể xem kết quả ngay bây giờ."
                cancelLabel=""
                confirmLabel="Xem kết quả"
                onConfirm={() => queueNavigateToExamResult()}
                confirmIcon={<Send size={14} />}
                showCancel={false}
            />

            <PracticeAttemptConfirmModal
                isOpen={isAutoSubmittedModalOpen}
                onClose={() => {}}
                title="Bài thi đã được nộp tự động"
                description="Thời gian làm bài đã hết. Hệ thống đã tự động nộp bài cho bạn."
                cancelLabel=""
                confirmLabel="Xem kết quả"
                onConfirm={() => queueNavigateToExamResult()}
                confirmIcon={<Send size={14} />}
                showCancel={false}
            />
        </section>
    );
};

export default memo(ExamPracticeAttemptPage);

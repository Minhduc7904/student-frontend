import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Flag, Infinity, Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDateTime } from '../../../../shared/utils';
import PracticeAttemptConfirmModal from '../../practice-attempt/component/PracticeAttemptConfirmModal';
import {
    selectPracticeBookmarkedQuestionIds,
    selectPracticeSubmitAttemptLoading,
    submitPublicStudentExamAttempt,
} from '../../practice-attempt/store/practiceAttemptSlice';

const TIMER_RADIUS = 56;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
const TIMER_VISIBLE_RATIO = 0.84;
const TIMER_VISIBLE_ARC = TIMER_CIRCUMFERENCE * TIMER_VISIBLE_RATIO;
const DESKTOP_BREAKPOINT_PX = 1024;
const STICKY_TOP_OFFSET_PX = 50;
const STICKY_BOTTOM_BUFFER_PX = 16;

const sortByOrderAsc = (items = []) => {
    return [...items].sort((a, b) => {
        const aOrder = a?.order;
        const bOrder = b?.order;

        if (aOrder == null && bOrder == null) return 0;
        if (aOrder == null) return 1;
        if (bOrder == null) return -1;

        return Number(aOrder) - Number(bOrder);
    });
};

const normalizeSectionsWithQuestions = (examContent) => {
    const rawSections = Array.isArray(examContent?.sections) ? examContent.sections : [];
    const rawQuestions = Array.isArray(examContent?.questions) ? examContent.questions : [];

    const sections = sortByOrderAsc(rawSections);
    const questions = sortByOrderAsc(rawQuestions);

    if (!sections.length && questions.length) {
        return [
            {
                sectionId: 'all',
                identity: 'all',
                title: 'Tất cả câu hỏi',
                questions,
            },
        ];
    }

    const sectionQuestions = sections.reduce((acc, section) => {
        acc[String(section?.sectionId)] = [];
        return acc;
    }, {});

    const otherQuestions = [];

    questions.forEach((question) => {
        const sectionKey = question?.sectionId == null ? null : String(question.sectionId);
        if (sectionKey && Object.prototype.hasOwnProperty.call(sectionQuestions, sectionKey)) {
            sectionQuestions[sectionKey].push(question);
            return;
        }

        otherQuestions.push(question);
    });

    const nextSections = sections.map((section, index) => {
        const identity = section?.sectionId == null ? `section-${index + 1}` : String(section.sectionId);

        return {
            ...section,
            identity,
            questions: sectionQuestions[identity] || [],
        };
    });

    if (otherQuestions.length) {
        nextSections.push({
            sectionId: 'other',
            identity: 'other',
            title: 'Khác',
            questions: otherQuestions,
        });
    }

    return nextSections;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getDurationSeconds = (attemptDetail) => {
    const duration = Number(attemptDetail?.duration ?? attemptDetail?.durationMinutes);
    if (!Number.isFinite(duration) || duration <= 0) return null;
    return Math.round(duration * 60);
};

const computeRemainingSeconds = (attemptDetail, totalSeconds) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return null;

    const expectedEndAt = attemptDetail?.expectedEndAt ? new Date(attemptDetail.expectedEndAt) : null;
    const expectedEndAtMs = expectedEndAt?.getTime?.();
    if (Number.isFinite(expectedEndAtMs)) {
        const remainingByExpectedEnd = Math.ceil((expectedEndAtMs - Date.now()) / 1000);
        return clamp(remainingByExpectedEnd, 0, totalSeconds);
    }

    const startedAt = attemptDetail?.startedAt ? new Date(attemptDetail.startedAt) : null;
    const startedAtMs = startedAt?.getTime?.();
    if (Number.isFinite(startedAtMs)) {
        const expectedEndFromStartMs = startedAtMs + totalSeconds * 1000;
        const remainingByStart = Math.ceil((expectedEndFromStartMs - Date.now()) / 1000);
        return clamp(remainingByStart, 0, totalSeconds);
    }

    const apiRemainingSeconds = Number(attemptDetail?.remainingSeconds);
    if (Number.isFinite(apiRemainingSeconds)) {
        return clamp(Math.round(apiRemainingSeconds), 0, totalSeconds);
    }

    return totalSeconds;
};

const formatSeconds = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(remainingSeconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
};

const getProgressColor = (progressRatio) => {
    const safeRatio = clamp(progressRatio, 0, 1);
    const startColor = { r: 239, g: 68, b: 68 };
    const endColor = { r: 22, g: 163, b: 74 };

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * safeRatio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * safeRatio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * safeRatio);

    return `rgb(${r}, ${g}, ${b})`;
};

const resolveTrueFalseMap = (question) => {
    const map = new Map();
    const trueFalseAnswers = Array.isArray(question?.answer?.trueFalseAnswers)
        ? question.answer.trueFalseAnswers
        : [];

    trueFalseAnswers.forEach((item) => {
        if (item?.statementId != null && typeof item?.isTrue === 'boolean') {
            map.set(String(item.statementId), item.isTrue);
        }
    });

    const rawAnswer = question?.answer?.answer;
    if (typeof rawAnswer === 'string' && rawAnswer.trim()) {
        try {
            const parsed = JSON.parse(rawAnswer);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                Object.entries(parsed).forEach(([statementId, isTrue]) => {
                    if (typeof isTrue === 'boolean') {
                        map.set(String(statementId), isTrue);
                    }
                });
            }
        } catch {
            // Ignore malformed JSON and keep collected values.
        }
    }

    return map;
};

const isQuestionDone = (question) => {
    const type = question?.type;

    if (type === 'SINGLE_CHOICE') {
        const selectedIds = Array.isArray(question?.answer?.selectedStatementIds)
            ? question.answer.selectedStatementIds
            : [];
        return question?.answer?.statementId != null || selectedIds.length > 0;
    }

    if (type === 'TRUE_FALSE') {
        const statements = Array.isArray(question?.statements) ? question.statements : [];
        if (!statements.length) return false;

        const answerMap = resolveTrueFalseMap(question);
        return statements.every((statement) => answerMap.has(String(statement?.statementId)));
    }

    if (type === 'SHORT_ANSWER') {
        const rawAnswer = question?.answer?.answerText ?? question?.answer?.answer ?? '';
        return String(rawAnswer ?? '').trim().length > 0;
    }

    return false;
};

const hasSavedAnswer = (question) => {
    const answer = question?.answer;
    if (!answer || typeof answer !== 'object') return false;

    if (answer?.questionId != null || answer?.answerId != null || answer?.id != null) return true;
    if (answer?.statementId != null) return true;
    if (Array.isArray(answer?.selectedStatementIds) && answer.selectedStatementIds.length > 0) return true;
    if (Array.isArray(answer?.trueFalseAnswers) && answer.trueFalseAnswers.length > 0) return true;
    if (typeof answer?.answerText === 'string' || typeof answer?.answerText === 'number') return true;
    if (typeof answer?.answer === 'string' || typeof answer?.answer === 'number') return true;

    return false;
};

const PracticeAttemptSidebar = ({
    attemptDetail,
    attemptId,
    loading = false,
    examContent = null,
    submitAnswerLoading = {},
    submitAnswerError = {},
    asideClassName = '',
    questionListClassName = 'max-h-[52vh]',
}) => {
    const dispatch = useDispatch();
    const { typeExam, typeexam, id } = useParams();
    const asideRef = useRef(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [canUseStickyOnDesktop, setCanUseStickyOnDesktop] = useState(true);
    const sections = useMemo(() => normalizeSectionsWithQuestions(examContent), [examContent]);
    const bookmarkedQuestionIds = useSelector(selectPracticeBookmarkedQuestionIds);
    const normalizedAttemptStatus = String(attemptDetail?.status ?? '').toUpperCase();
    const isSubmittedAttempt = normalizedAttemptStatus === 'SUBMITED' || normalizedAttemptStatus === 'SUBMITTED';
    const isOverTimeAttempt = Boolean(attemptDetail?.isOverTime);
    const hideTimingPanel = isSubmittedAttempt || isOverTimeAttempt;
    const totalSeconds = useMemo(() => getDurationSeconds(attemptDetail), [attemptDetail]);
    const [remainingSeconds, setRemainingSeconds] = useState(() => computeRemainingSeconds(attemptDetail, totalSeconds));
    const isUnlimitedTime = !Number.isFinite(totalSeconds) || totalSeconds <= 0;
    const submitAttemptLoading = useSelector(selectPracticeSubmitAttemptLoading);

    useEffect(() => {
        if (hideTimingPanel) {
            setRemainingSeconds(null);
            return;
        }
        setRemainingSeconds(computeRemainingSeconds(attemptDetail, totalSeconds));
    }, [attemptDetail, hideTimingPanel, totalSeconds]);

    useEffect(() => {
        if (hideTimingPanel || isUnlimitedTime) return undefined;

        const timerId = window.setInterval(() => {
            setRemainingSeconds(computeRemainingSeconds(attemptDetail, totalSeconds));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [attemptDetail, hideTimingPanel, isUnlimitedTime, totalSeconds]);

    useEffect(() => {
        const updateStickyState = () => {
            if (typeof window === 'undefined') return;

            if (window.innerWidth < DESKTOP_BREAKPOINT_PX) {
                setCanUseStickyOnDesktop(true);
                return;
            }

            const sidebarHeight = asideRef.current?.offsetHeight || 0;
            const viewportHeight = window.innerHeight;
            const requiredHeight = sidebarHeight + STICKY_TOP_OFFSET_PX + STICKY_BOTTOM_BUFFER_PX;
            setCanUseStickyOnDesktop(requiredHeight <= viewportHeight);
        };

        updateStickyState();
        window.addEventListener('resize', updateStickyState);

        return () => {
            window.removeEventListener('resize', updateStickyState);
        };
    }, [
        attemptId,
        hideTimingPanel,
        isUnlimitedTime,
        loading,
        questionListClassName,
        sections.length,
        submitAttemptLoading,
    ]);

    const desktopStickyClassName = canUseStickyOnDesktop ? 'lg:sticky lg:top-12.5' : '';

    const safeRemainingSeconds = Number.isFinite(remainingSeconds) ? remainingSeconds : totalSeconds;
    const progressRatio = Number.isFinite(totalSeconds) && totalSeconds > 0
        ? clamp((safeRemainingSeconds || 0) / totalSeconds, 0, 1)
        : 0;

    const progressColor = getProgressColor(progressRatio);
    const progressDashLength = TIMER_VISIBLE_ARC * progressRatio;
    const progressDashArray = `${progressDashLength} ${TIMER_CIRCUMFERENCE}`;
    const trackDashArray = `${TIMER_VISIBLE_ARC} ${TIMER_CIRCUMFERENCE}`;

    const handleNavigateQuestion = (sectionIdentity, questionId) => {
        if (questionId == null) return;

        window.dispatchEvent(
            new CustomEvent('practice-attempt:navigate-question', {
                detail: {
                    sectionIdentity,
                    questionId,
                },
            })
        );
    };

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

        setIsSubmitModalOpen(false);

        const resolvedTypeExam = typeExam || typeexam;
        window.dispatchEvent(
            new CustomEvent('practice-attempt:submit-success', {
                detail: {
                    typeExam: resolvedTypeExam,
                    examId: id,
                },
            })
        );
    };

    if (loading) {
        return (
            <aside ref={asideRef} className={`h-fit w-full max-w-full overflow-x-hidden rounded-2xl border border-gray-200 bg-white p-4 md:p-5 ${desktopStickyClassName} ${asideClassName}`.trim()}>
                <div className="animate-pulse space-y-3">
                    <div className="mx-auto h-32 w-32 rounded-full bg-slate-100 sm:h-36 sm:w-36" />
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="h-10 w-full rounded-xl bg-slate-100" />
                    <div className="h-10 w-full rounded-xl bg-slate-100" />
                    <div className="h-10 w-full rounded-xl bg-slate-100" />
                </div>
            </aside>
        );
    }

    return (
        <>
            <aside ref={asideRef} className={`h-fit w-full max-w-full overflow-x-hidden rounded-2xl border border-gray-200 bg-white p-4 md:p-5 ${desktopStickyClassName} ${asideClassName}`.trim()}>
                <h2 className="text-base font-bold text-gray-900">Theo dõi luyện tập</h2>

                {!hideTimingPanel ? (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-linear-to-b from-slate-50 to-white p-4">
                        <div className="relative mx-auto h-40 w-40">
                            <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
                                <g style={{ transformOrigin: '50% 50%', transform: 'rotate(120deg)' }}>
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={TIMER_RADIUS}
                                        fill="none"
                                        stroke="#E2E8F0"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={trackDashArray}
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={TIMER_RADIUS}
                                        fill="none"
                                        stroke={progressColor}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={progressDashArray}
                                        className="transition-all duration-500"
                                    />
                                </g>
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                {isUnlimitedTime ? (
                                    <Infinity size={40} strokeWidth={2.25} className="text-slate-700" />
                                ) : (
                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {Number.isFinite(safeRemainingSeconds) ? formatSeconds(safeRemainingSeconds) : '--:--:--'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-slate-600">
                            <p>
                                Mã lượt làm: <span className="break-all font-semibold text-slate-900">{attemptId || '--'}</span>
                            </p>
                            <p>
                                Bắt đầu: <span className="font-semibold text-slate-900">{formatDateTime(attemptDetail?.startedAt) || '--'}</span>
                            </p>
                            {!isUnlimitedTime ? (
                                <p>
                                    Dự kiến kết thúc: <span className="font-semibold text-slate-900">{formatDateTime(attemptDetail?.expectedEndAt) || '--'}</span>
                                </p>
                            ) : null}
                            {!isUnlimitedTime ? (
                                <p>
                                    Thời lượng: <span className="font-semibold text-slate-900">{attemptDetail?.duration ?? '--'} phút</span>
                                </p>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div className="mt-4 rounded-xl border border-slate-200 p-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span>Đã lưu và làm xong</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-slate-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span>Lưu thất bại</span>
                    </div>
                </div>

                <div className={`mt-4 min-w-0 space-y-3 overflow-y-auto pr-1 ${questionListClassName}`.trim()}>
                    {sections.length ? sections.map((section, sectionIndex) => {
                        const questions = Array.isArray(section?.questions) ? section.questions : [];

                        return (
                            <div key={section?.identity || `practice-sidebar-section-${sectionIndex + 1}`} className="min-w-0 rounded-xl border border-slate-200 p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                                        {section?.title || `Phần ${sectionIndex + 1}`}
                                    </h3>
                                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                        {questions.length} câu
                                    </span>
                                </div>

                                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                                    {questions.map((question, questionIndex) => {
                                        const questionId = question?.questionId;
                                        const questionOrder = question?.order ?? questionIndex + 1;
                                        const questionKey = questionId == null
                                            ? `practice-sidebar-question-${sectionIndex + 1}-${questionIndex + 1}`
                                            : String(questionId);
                                        const questionError = questionId != null ? submitAnswerError?.[String(questionId)] : null;
                                        const questionLoading = questionId != null ? Boolean(submitAnswerLoading?.[String(questionId)]) : false;
                                        const isBookmarked = questionId != null ? Boolean(bookmarkedQuestionIds?.[String(questionId)]) : false;
                                        const isCompleted = isQuestionDone(question) && hasSavedAnswer(question);

                                        let buttonClassName = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                                        if (questionError) {
                                            buttonClassName = 'border-red-300 bg-red-50 text-red-700 hover:border-red-400';
                                        } else if (isCompleted) {
                                            buttonClassName = 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400';
                                        } else if (questionLoading) {
                                            buttonClassName = 'border-amber-300 bg-amber-50 text-amber-700';
                                        }

                                        return (
                                            <button
                                                key={questionKey}
                                                type="button"
                                                onClick={() => handleNavigateQuestion(section?.identity, questionId)}
                                                disabled={questionId == null}
                                                className={`relative inline-flex h-7 cursor-pointer items-center justify-center rounded-lg border text-[11px] font-semibold transition-colors sm:h-8 sm:text-xs ${buttonClassName} ${questionId == null ? 'cursor-not-allowed opacity-60' : ''}`}
                                                title={`Câu ${questionOrder}${questionError ? ' - Lưu thất bại' : ''}`}
                                            >
                                                {isBookmarked ? (
                                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-amber-100 px-1 py-0.5 text-amber-600">
                                                        <Flag size={10} className="fill-amber-500 text-amber-500" />
                                                    </span>
                                                ) : null}
                                                {questionOrder}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                            Chưa có section hoặc câu hỏi để hiển thị.
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleOpenSubmitModal}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-blue-600 hover:to-blue-700"
                >
                    <Send size={15} />
                    Nộp bài
                </button>
            </aside>

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
        </>
    );
};

export default memo(PracticeAttemptSidebar);

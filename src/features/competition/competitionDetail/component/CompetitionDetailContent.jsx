import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, Info, Lock, MessageCircle, PlayCircle, Share2, Trophy, History } from 'lucide-react';
import { ROUTES } from '../../../../core/constants';
import CompetitionDetailTimelineDescription from './CompetitionDetailTimelineDescription';
import CompetitionDetailStatusCircle from './CompetitionDetailStatusCircle';
import CompetitionDetailTabs from './CompetitionDetailTabs';
import CompetitionStartModal from '../../component/CompetitionStartModal';

const CompetitionDetailContent = ({ detail, competitionId, onCountdownFinished }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [nowTs, setNowTs] = useState(Date.now());
    const [showFloatingHeader, setShowFloatingHeader] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [showAlreadyAttemptedPopup, setShowAlreadyAttemptedPopup] = useState(false);
    const lastTriggeredCountdownKeyRef = useRef(null);
    const headerRef = useRef(null);

    const timelineStatus = detail?.timelineStatus;
    const attemptStatus = detail?.attemptStatus;
    const canAttempt = Boolean(detail?.canAttempt);
    const startDate = detail?.startDate;
    const endDate = detail?.endDate;
    const isInProgressAttempt = attemptStatus === 'IN_PROGRESS';
    const isAttemptCompleted = attemptStatus === 'ATTEMPTED' || attemptStatus === 'SUBMITTED';
    const canStartCompetition = timelineStatus === 'ONGOING' && Boolean(competitionId);
    const canShowAttemptAction = (canStartCompetition || isInProgressAttempt) && canAttempt;
    const canTapStartOnMobile = canShowAttemptAction || isAttemptCompleted;
    const attemptActionLabel = isInProgressAttempt ? 'Làm tiếp' : 'Làm bài';
    const competitionTitle = detail?.title ?? `Cuộc thi #${competitionId}`;
    const canViewExamContent = Boolean(detail?.allowViewExamContent);
    const canViewLeaderboard = Boolean(detail?.allowLeaderboard);
    const canViewHistory = Boolean(detail?.allowViewScore);

    const infoPath = ROUTES.COMPETITION_DETAIL(competitionId ?? '');
    const examPath = competitionId ? `${infoPath}/exam` : '';
    const rankingPath = competitionId ? `${infoPath}/ranking` : '';
    const historyPath = competitionId ? `${infoPath}/history` : '';

    const isOnInfoTab = location.pathname === infoPath;
    const isOnExamTab = Boolean(examPath) && location.pathname.startsWith(examPath);
    const isOnRankingTab = Boolean(rankingPath) && location.pathname.startsWith(rankingPath);
    const isOnHistoryTab = Boolean(historyPath) && location.pathname.startsWith(historyPath);

    const handleStartCompetition = useCallback(() => {
        if (!competitionId) return;

        if (isAttemptCompleted && !canAttempt) {
            setShowAlreadyAttemptedPopup(true);
            return;
        }

        if (!canShowAttemptAction) return;

        setShowStartModal(true);
    }, [competitionId, isAttemptCompleted, canAttempt, canShowAttemptAction]);

    const handleDiscussion = useCallback(() => {
        window.alert('Tính năng thảo luận đang được phát triển.');
    }, []);

    const handleShareCompetition = useCallback(async () => {
        if (!competitionId) return;

        const competitionLink = `${window.location.origin}/student${ROUTES.COMPETITION_DETAIL(competitionId)}`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(competitionLink);
                window.alert('Đã sao chép link cuộc thi.');
                return;
            }
        } catch {
            // Fallback below when clipboard API is unavailable or blocked.
        }

        window.prompt('Sao chép link cuộc thi:', competitionLink);
    }, [competitionId]);

    const renderHeaderActions = (isCompact = false) => {
        const actionsWrapperClass = isCompact
            ? 'flex w-full flex-wrap items-center gap-1.5 md:w-auto justify-end'
            : 'flex flex-wrap items-center gap-2';

        const commonButtonClass = isCompact
            ? 'cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:px-3'
            : 'cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50';

        const startButtonClass = isInProgressAttempt
            ? isCompact
                ? 'cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 sm:px-3'
                : 'cursor-pointer inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700'
            : isCompact
                ? 'cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-3'
                : 'cursor-pointer inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700';

        const iconSize = isCompact ? 14 : 16;

        return (
            <div className={actionsWrapperClass}>
                {canShowAttemptAction && (
                    <button
                        type="button"
                        onClick={handleStartCompetition}
                        className={startButtonClass}
                        aria-label={attemptActionLabel}
                    >
                        <PlayCircle size={iconSize} />
                        <span className={isCompact ? 'hidden sm:inline' : ''}>{attemptActionLabel}</span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleDiscussion}
                    className={commonButtonClass}
                    aria-label="Thảo luận"
                >
                    <MessageCircle size={iconSize} />
                    <span className={isCompact ? 'hidden sm:inline' : ''}>Thảo luận</span>
                </button>

                <button
                    type="button"
                    onClick={handleShareCompetition}
                    className={commonButtonClass}
                    aria-label="Chia sẻ"
                >
                    <Share2 size={iconSize} />
                    <span className={isCompact ? 'hidden sm:inline' : ''}>Chia sẻ</span>
                </button>
            </div>
        );
    };

    useEffect(() => {
        const shouldCountDown = timelineStatus === 'ONGOING' || timelineStatus === 'UPCOMING';
        if (!shouldCountDown) return undefined;

        const timer = setInterval(() => {
            setNowTs(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [timelineStatus]);

    useEffect(() => {
        const headerElement = headerRef.current;
        if (!headerElement || typeof IntersectionObserver === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingHeader(entry.intersectionRatio < 1);
            },
            { threshold: [1] },
        );

        observer.observe(headerElement);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const countdownTarget = timelineStatus === 'ONGOING'
            ? endDate
            : timelineStatus === 'UPCOMING'
                ? startDate
                : null;

        if (!countdownTarget) {
            lastTriggeredCountdownKeyRef.current = null;
            return;
        }

        const countdownTargetTs = new Date(countdownTarget).getTime();
        if (!Number.isFinite(countdownTargetTs)) {
            lastTriggeredCountdownKeyRef.current = null;
            return;
        }

        const countdownKey = `${timelineStatus}-${countdownTargetTs}`;
        if (nowTs < countdownTargetTs) return;
        if (lastTriggeredCountdownKeyRef.current === countdownKey) return;

        lastTriggeredCountdownKeyRef.current = countdownKey;
        onCountdownFinished?.();
    }, [timelineStatus, startDate, endDate, nowTs, onCountdownFinished]);

    return (
        <div className="rounded-2xl pb-24 md:pb-0">
            <div
                className={`hidden md:block fixed left-0 top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 ${showFloatingHeader ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="mx-auto w-full max-w-7xl px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex flex-col items-end gap-2 md:flex-row md:items-center md:justify-between md:gap-3">
                        <h1 className="line-clamp-2 min-w-0 text-base font-semibold text-slate-900 sm:text-lg md:line-clamp-1 md:text-xl">
                            {competitionTitle}
                        </h1>
                        <div className="w-full md:w-auto md:shrink-0">{renderHeaderActions(true)}</div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div ref={headerRef} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <h1 className="text-h1 text-transparent bg-clip-text bg-[linear-gradient(135deg,#2563EB_0%,#60A5FA_100%)]">
                        {competitionTitle}
                    </h1>
                    <CompetitionDetailTimelineDescription
                        timelineStatus={timelineStatus}
                        startDate={startDate}
                        endDate={endDate}
                        nowTs={nowTs}
                    />

                    <div className="mt-3">{renderHeaderActions()}</div>
                </div>

                <CompetitionDetailStatusCircle
                    timelineStatus={timelineStatus}
                    startDate={startDate}
                    endDate={endDate}
                    nowTs={nowTs}
                    attemptStatus={attemptStatus}
                    bestSubmittedScore={detail?.bestSubmittedScore}
                />
            </div>

            <div className="hidden md:block">
                <CompetitionDetailTabs detail={detail} />
            </div>

            <Outlet />

            <CompetitionStartModal
                isOpen={showStartModal}
                competitionId={competitionId}
                onClose={() => setShowStartModal(false)}
            />

            {showAlreadyAttemptedPopup && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-5 shadow-xl">
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-slate-900">Thông báo</h4>
                                <p className="mt-1 text-sm text-slate-600">Bạn đã làm bài rồi.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAlreadyAttemptedPopup(false)}
                                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-xl grid-cols-5 items-end gap-1">
                    <button
                        type="button"
                        onClick={() => navigate(infoPath)}
                        className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors ${
                            isOnInfoTab ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                        }`}
                    >
                        <Info size={18} />
                        <span>Thông tin</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!canViewExamContent || !examPath) return;
                            navigate(examPath);
                        }}
                        disabled={!canViewExamContent || !examPath}
                        className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                            isOnExamTab ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                        }`}
                    >
                        <div className="relative">
                            <FileText size={18} />
                            {!canViewExamContent && <Lock size={10} className="absolute -right-1 -top-1 text-rose-600" />}
                        </div>
                        <span>Đề thi</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleStartCompetition}
                        disabled={!canTapStartOnMobile}
                        className={`-mt-6 inline-flex h-16 w-16 items-center justify-center self-center rounded-full text-white shadow-lg transition-colors disabled:opacity-60 ${
                            canShowAttemptAction && isInProgressAttempt
                                ? 'bg-emerald-600 disabled:bg-slate-400'
                                : canTapStartOnMobile
                                    ? 'bg-blue-600 disabled:bg-slate-400'
                                    : 'bg-slate-400'
                        }`}
                        aria-label={attemptActionLabel}
                    >
                        <div className="relative">
                            <PlayCircle size={28} />
                            {!canShowAttemptAction && !isAttemptCompleted && <Lock size={12} className="absolute -right-1 -top-1 text-white" />}
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!canViewLeaderboard || !rankingPath) return;
                            navigate(rankingPath);
                        }}
                        disabled={!canViewLeaderboard || !rankingPath}
                        className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                            isOnRankingTab ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                        }`}
                    >
                        <div className="relative">
                            <Trophy size={18} />
                            {!canViewLeaderboard && <Lock size={10} className="absolute -right-1 -top-1 text-rose-600" />}
                        </div>
                        <span>Xếp hạng</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (!canViewHistory || !historyPath) return;
                            navigate(historyPath);
                        }}
                        disabled={!canViewHistory || !historyPath}
                        className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                            isOnHistoryTab ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                        }`}
                    >
                        <div className="relative">
                            <History size={18} />
                            {!canViewHistory && <Lock size={10} className="absolute -right-1 -top-1 text-rose-600" />}
                        </div>
                        <span>Lịch sử</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompetitionDetailContent;

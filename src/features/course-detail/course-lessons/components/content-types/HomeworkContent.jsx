import React, { useState, useEffect, useMemo } from "react";
import { Play, Lock, Info, Trophy, FileSearch, History, ChevronRight, CalendarClock } from "lucide-react";
import CompetitionDetailInfoTab from "../../../../competition/competitionDetail/component/CompetitionDetailInfoTab";
import CompetitionRankingPage from "../../../../competition/ranking";
import CompetitionExamPage from "../../../../competition/exam";
import CompetitionHistoryPage from "../../../../competition/history";
import CompetitionResultPage from "../../../../competition/result";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../../core/constants";
import FileHomeworkSubmission from "./FileHomeworkSubmission";
import HomeworkSolutionVideoTab from "./HomeworkSolutionVideoTab";

// Status configuration
const STATUS_CONFIG = {
    NOT_STARTED: {
        label: 'Chưa bắt đầu',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-600',
        dotClass: 'bg-blue-400',
        buttonText: 'Chưa đến thời gian',
        disabled: true
    },
    DO_NOW: {
        label: 'Chưa làm',
        bgClass: 'bg-red-50',
        textClass: 'text-red-500',
        dotClass: 'bg-red-400',
        buttonText: 'Làm ngay'
    },
    REDO: {
        label: 'Làm lại',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-500',
        dotClass: 'bg-orange-400',
        buttonText: 'Làm lại'
    },
    LATE_SUBMIT: {
        label: 'Nộp muộn',
        bgClass: 'bg-yellow-50',
        textClass: 'text-yellow-600',
        dotClass: 'bg-yellow-400',
        buttonText: 'Làm bài (Muộn)'
    },
    LATE_REDO: {
        label: 'Nộp muộn · Làm lại',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-600',
        dotClass: 'bg-orange-400',
        buttonText: 'Làm lại (muộn)'
    },
    OVERDUE: {
        label: 'Quá hạn',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-500',
        dotClass: 'bg-gray-400',
        buttonText: 'Đã quá hạn',
        disabled: true
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        bgClass: 'bg-green-50',
        textClass: 'text-green-600',
        dotClass: 'bg-green-400',
        buttonText: 'Xem lại bài làm'
    },
    RESUME: {
        label: 'Đang làm dở',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-600',
        dotClass: 'bg-purple-400',
        buttonText: 'Tiếp tục làm bài'
    }
};

// Tab constants
const TABS = {
    DETAIL: 'detail',
    RANKING: 'ranking',
    REVIEW: 'review',
    HISTORY: 'history',
    RESULT: 'result',
    SOLUTION_VIDEO: 'solutionVideo'
};

const BASE_TAB_CONFIG = [
    {
        id: TABS.DETAIL,
        label: 'Chi tiết',
        icon: Info,
        requirePermission: null
    },
    {
        id: TABS.SOLUTION_VIDEO,
        label: 'Video lời giải',
        icon: Play,
        requirePermission: 'allowViewSolutionYoutubeUrl'
    },
    {
        id: TABS.RANKING,
        label: 'Xếp hạng',
        icon: Trophy,
        requirePermission: 'allowLeaderboard'
    },
    {
        id: TABS.REVIEW,
        label: 'Xem lại đề',
        icon: FileSearch,
        requirePermission: 'allowViewExamContent'
    },
    {
        id: TABS.HISTORY,
        label: 'Lịch sử',
        icon: History,
        requirePermission: null
    },

];

// Tab Button Component
const TabButton = ({ tab, isActive, onClick, disabled }) => {
    const Icon = tab.icon;
    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            title={disabled ? 'Không có quyền truy cập' : tab.label}
            className={`relative w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all duration-200 ${disabled
                ? 'cursor-not-allowed text-gray-300'
                : isActive
                    ? 'bg-blue-800 text-white shadow-sm cursor-pointer'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-blue-800 cursor-pointer'
                }`}
        >
            <Icon size={14} className="shrink-0" />
            <span className="truncate">{tab.label}</span>
            {disabled && <Lock size={11} className="shrink-0 text-gray-300" />}
        </button>
    );
};


/**
 * Homework Content Component
 * Hiển thị nội dung learning item type HOMEWORK
 */
export const HomeworkContent = ({ learningItemDetail }) => {
    const navigate = useNavigate();
    const { courseId, lessonId, learningItemId, competitionSubmitId } = useParams();
    const homeworkContents = learningItemDetail?.homeworkContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(() => (
        competitionSubmitId ? TABS.RESULT : TABS.DETAIL
    ));
    const [localSubmissions, setLocalSubmissions] = useState({});

    const rawCurrentContent = homeworkContents[selectedIndex] || null;
    const localSubmission = rawCurrentContent?.homeworkContentId
        ? localSubmissions[String(rawCurrentContent.homeworkContentId)]
        : null;
    const currentContent = localSubmission
        ? {
            ...rawCurrentContent,
            homeworkSubmit: localSubmission,
            progress: {
                ...rawCurrentContent?.progress,
                homeworkSubmit: localSubmission,
                isDone: true,
                status: rawCurrentContent?.progress?.status === 'OVERDUE'
                    ? rawCurrentContent?.progress?.status
                    : 'COMPLETED',
            },
        }
        : rawCurrentContent;
    const competition = currentContent?.competition;
    const solutionYoutubeUrl = competition?.exam?.solutionYoutubeUrl;
    const isFileUploadHomework = currentContent?.type === 'FILE_UPLOAD';
    const assignedCompetitionId = competition?.competitionId ?? competition?.id ?? currentContent?.competitionId;
    const isCompetitionAssignmentPending = !isFileUploadHomework && !assignedCompetitionId;

    const tabConfig = useMemo(() => {
        return BASE_TAB_CONFIG.filter((tab) => {
            if (tab.id !== TABS.SOLUTION_VIDEO) return true;
            return !!(competition?.allowViewSolutionYoutubeUrl && solutionYoutubeUrl);
        });
    }, [competition?.allowViewSolutionYoutubeUrl, solutionYoutubeUrl]);

    // Get status config from current content
    const currentStatus = currentContent?.progress?.status || 'DO_NOW';
    const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.DO_NOW;
    const progress = currentContent?.progress;
    const latestCompetitionSubmit = progress?.competitionSubmit;
    const latestCompetitionSubmitId =
        latestCompetitionSubmit?.competitionSubmitId ??
        progress?.homeworkSubmit?.competitionSubmitId ??
        currentContent?.homeworkSubmit?.competitionSubmitId;
    const hasLatestSubmittedAttempt = Boolean(latestCompetitionSubmitId) && latestCompetitionSubmit?.status !== 'IN_PROGRESS';

    // COMPLETED: chỉ cho phép bấm nếu competition có ít nhất 1 rule xem kết quả
    const hasViewRules = !!(competition?.allowViewScore || competition?.showResultDetail || competition?.allowViewAnswer);
    const canViewLatestAttempt = hasLatestSubmittedAttempt && hasViewRules;
    const isAttemptActionDisabled = statusConfig.disabled || progress?.canAttempt === false || currentStatus === 'COMPLETED';
    const attemptButtonText = currentStatus === 'COMPLETED' ? 'Đã dùng hết lượt' : statusConfig.buttonText;
    const reviewButtonText = ['REDO', 'LATE_REDO'].includes(currentStatus)
        ? 'Xem lượt trước'
        : currentStatus === 'COMPLETED'
            ? 'Xem bài làm gần nhất'
            : 'Xem lại bài làm';

    const isTabDisabled = (tab) => {
        if (!tab) return false;
        if (!tab.requirePermission || !competition) return false;
        return !competition[tab.requirePermission];
    };

    const getFirstAvailableTab = () => {
        const availableTab = tabConfig.find(tab => !isTabDisabled(tab));
        return availableTab ? availableTab.id : TABS.DETAIL;
    };

    useEffect(() => {
        // Keep RESULT tab while being on result route.
        if (competitionSubmitId && activeTab === TABS.RESULT) {
            return;
        }

        const isCurrentTabVisible = tabConfig.some(tab => tab.id === activeTab);
        if (!isCurrentTabVisible) {
            setActiveTab(getFirstAvailableTab());
            return;
        }

        const firstAvailable = getFirstAvailableTab();
        if (isTabDisabled(tabConfig.find(t => t.id === activeTab))) {
            setActiveTab(firstAvailable);
        }
    }, [competitionSubmitId, competition, tabConfig, activeTab]);

    useEffect(() => {
        if (!competitionSubmitId) {
            setActiveTab(prev => (prev === TABS.RESULT ? TABS.DETAIL : prev));
            return;
        }

        setActiveTab(TABS.RESULT);
    }, [competitionSubmitId]);

    useEffect(() => {
        if (!competitionSubmitId || !homeworkContents.length) return;

        const foundIndex = homeworkContents.findIndex(
            (item) => String(
                item?.progress?.competitionSubmit?.competitionSubmitId ??
                item?.progress?.homeworkSubmit?.competitionSubmitId
            ) === String(competitionSubmitId)
        );

        if (foundIndex >= 0 && foundIndex !== selectedIndex) {
            setSelectedIndex(foundIndex);
        }
    }, [competitionSubmitId, homeworkContents, selectedIndex]);

    const goToHomeworkResult = (submitId) => {
        if (!courseId || !lessonId || !learningItemId || !submitId) return;

        navigate(ROUTES.COURSE_LEARNING_ITEM_RESULT(courseId, lessonId, learningItemId, submitId));
        setActiveTab(TABS.RESULT);
    };

    const backToHomeworkTabs = (nextTab = TABS.DETAIL) => {
        if (!courseId || !lessonId || !learningItemId) return;

        navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItemId));
        setActiveTab(nextTab);
    };

    /**
     * Handle start competition navigation
     */
    const handleStartCompetition = () => {
        const routeCompetitionId = competition?.competitionId ?? competition?.id ?? currentContent?.competitionId;
        const routeLearningItemId = learningItemDetail?.learningItemId ?? learningItemId;
        const homeworkContentId = currentContent?.homeworkContentId ?? currentContent?.id;
        const activeSubmitId =
            currentContent?.progress?.competitionSubmit?.competitionSubmitId ??
            currentContent?.progress?.homeworkSubmit?.competitionSubmitId ??
            currentContent?.progress?.competitionSubmitId ??
            competition?.competitionSubmitId ??
            competition?.activeSubmitId;

        if (!routeCompetitionId) return;

        if ((currentStatus === 'RESUME' || latestCompetitionSubmit?.status === 'IN_PROGRESS' || competition?.attemptStatus === 'IN_PROGRESS') && activeSubmitId) {
            const targetRoute = ROUTES.DO_HOMEWORK_COMPETITION_SUBMIT(
                courseId,
                lessonId,
                routeLearningItemId,
                homeworkContentId,
                routeCompetitionId,
                activeSubmitId
            );
            navigate(targetRoute);
            return;
        }

        const targetRoute = ROUTES.DO_HOMEWORK_COMPETITION_START(
            courseId,
            lessonId,
            routeLearningItemId,
            homeworkContentId,
            routeCompetitionId
        );
        navigate(targetRoute);
    };

    /**
     * Handle action button:
     * - COMPLETED + có rule → xem kết quả
     * - Các trạng thái khác → bắt đầu / tiếp tục làm bài
     */
    const handleActionButton = () => {
        handleStartCompetition();
    };

    const handleViewLatestAttempt = () => {
        if (!canViewLatestAttempt) return;
        goToHomeworkResult(latestCompetitionSubmitId);
    };

    const handleTabChange = (tabId) => {
        const tab = tabConfig.find(t => t.id === tabId);
        if (tab && isTabDisabled(tab)) return;

        if (competitionSubmitId) {
            backToHomeworkTabs(tabId);
            return;
        }

        setActiveTab(tabId);
    };

    const handleFileHomeworkSubmitted = (homeworkContentId, submitData) => {
        if (!homeworkContentId || !submitData) return;

        setLocalSubmissions((current) => ({
            ...current,
            [String(homeworkContentId)]: submitData,
        }));
    };

    const LockedContent = ({ title, desc }) => (
        <div className="py-12 flex flex-col gap-3 w-full justify-center items-center rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Lock size={22} className="text-gray-400" />
            </div>
            <div className="flex flex-col gap-1 items-center px-4">
                <span className="text-[14px] font-semibold text-gray-700 text-center">{title}</span>
                <span className="text-[12px] text-gray-400 text-center">{desc}</span>
            </div>
        </div>
    );

    const renderTabContent = () => {
        if (isFileUploadHomework) {
            return (
                <FileHomeworkSubmission
                    homeworkContent={currentContent}
                    statusConfig={statusConfig}
                    onSubmitted={handleFileHomeworkSubmitted}
                />
            );
        }

        const competitionId = currentContent?.competition?.competitionId;
        const studentId = currentContent?.progress?.studentId;
        const attemptStatusMap = {
            NOT_STARTED: 'NOT_STARTED',
            DO_NOW: 'NOT_ATTEMPTED',
            REDO: 'NOT_ATTEMPTED',
            LATE_SUBMIT: 'NOT_ATTEMPTED',
            RESUME: 'IN_PROGRESS',
            COMPLETED: 'ATTEMPTED',
            OVERDUE: 'EXPIRED',
        };

        const timelineStatusMap = {
            NOT_STARTED: 'UPCOMING',
            OVERDUE: 'ENDED',
        };

        const mappedDetail = {
            timelineStatus: competition?.timelineStatus ?? timelineStatusMap[currentStatus] ?? 'ONGOING',
            attemptStatus: competition?.attemptStatus ?? attemptStatusMap[currentStatus] ?? 'NOT_ATTEMPTED',
            attemptedCount: progress?.attemptCount ?? progress?.attemptedCount ?? (progress?.competitionSubmit ? 1 : 0),
            durationMinutes: competition?.durationMinutes ?? competition?.duration ?? '--',
            maxAttempts: progress?.maxAttempts ?? competition?.maxAttempts ?? 1,
            canAttempt: typeof progress?.canAttempt === 'boolean'
                ? progress.canAttempt
                : typeof competition?.canAttempt === 'boolean'
                    ? competition.canAttempt
                    : !statusConfig.disabled,
            policies: competition?.policies,
        };

        const currentTabConfig = tabConfig.find(t => t.id === activeTab);
        if (currentTabConfig && isTabDisabled(currentTabConfig)) {
            return <LockedContent title="Nội dung bị khóa" desc="Bạn không có quyền truy cập nội dung này" />;
        }

        switch (activeTab) {
            case TABS.DETAIL:
                return <CompetitionDetailInfoTab detail={mappedDetail} />;
            case TABS.RANKING:
                if (!competition?.allowLeaderboard) {
                    return <LockedContent title="Bảng xếp hạng bị khóa" desc="Cuộc thi này không cho phép xem bảng xếp hạng" />;
                }
                return <CompetitionRankingPage competitionId={competitionId} detail={competition} studentId={studentId} />;
            case TABS.REVIEW:
                if (!competition?.allowViewExamContent) {
                    return <LockedContent title="Xem lại đề bị khóa" desc="Cuộc thi này không cho phép xem lại nội dung đề thi" />;
                }
                return <CompetitionExamPage competitionId={competitionId} />;
            case TABS.HISTORY:
                return (
                    <CompetitionHistoryPage
                        competitionId={competitionId}
                        onViewResult={({ submitId }) => goToHomeworkResult(submitId)}
                    />
                );
            case TABS.SOLUTION_VIDEO:
                return <HomeworkSolutionVideoTab youtubeUrl={solutionYoutubeUrl} />;
            case TABS.RESULT:
                if (!competitionSubmitId || !competitionId) {
                    return <LockedContent title="Không tìm thấy kết quả" desc="Thiếu thông tin để hiển thị kết quả bài làm" />;
                }
                return (
                    <CompetitionResultPage
                        submitId={competitionSubmitId}
                        competitionId={competitionId}
                        onBack={() => backToHomeworkTabs(TABS.HISTORY)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6">
            {/* Multiple homework selector */}
            {homeworkContents.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {homeworkContents.map((hw, idx) => (
                        <button
                            key={hw.homeworkContentId ?? idx}
                            type="button"
                            onClick={() => { setSelectedIndex(idx); setActiveTab(TABS.DETAIL); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${selectedIndex === idx
                                ? 'bg-blue-800 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span>Đề {idx + 1}</span>
                            {selectedIndex === idx && <ChevronRight size={12} />}
                        </button>
                    ))}
                </div>
            )}

            {isCompetitionAssignmentPending ? (
                <section className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white px-5 py-10 text-center shadow-[0_12px_30px_rgba(25,77,182,0.06)] sm:px-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                        <CalendarClock size={25} />
                    </div>
                    <h2 className="mt-4 text-h4 font-bold text-blue-950">Thầy giáo chưa giao bài tập về nhà</h2>
                    <p className="mt-2 max-w-md text-text-5 leading-relaxed text-gray-600">
                        Bài tập này chưa được gán nội dung. Em quay lại sau nhé.
                    </p>
                </section>
            ) : (
                <>
            {/* Header Card */}
            <div className="w-full bg-white rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Status strip */}
                <div className="flex flex-col gap-4 px-4 sm:px-6 pt-4 pb-3">
                    {/* Title row */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <h2 className="text-[18px] sm:text-[20px] font-bold text-blue-950 leading-snug">
                                {currentContent?.content || 'Bài tập'}
                            </h2>
                            <div className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full ${statusConfig.bgClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                                <span className={`text-[11px] font-medium ${statusConfig.textClass}`}>
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                        {!isFileUploadHomework ? (
                            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
                                {hasLatestSubmittedAttempt && (
                                    <button
                                        type="button"
                                        disabled={!canViewLatestAttempt}
                                        onClick={canViewLatestAttempt ? handleViewLatestAttempt : undefined}
                                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition-all ${canViewLatestAttempt
                                            ? 'border-blue-200 bg-white text-blue-800 hover:bg-blue-50 active:scale-95 cursor-pointer'
                                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        <FileSearch size={15} />
                                        <span>{canViewLatestAttempt ? reviewButtonText : 'Chưa thể xem bài làm'}</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    disabled={isAttemptActionDisabled}
                                    onClick={isAttemptActionDisabled ? undefined : handleActionButton}
                                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all ${isAttemptActionDisabled
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-800 text-white shadow-sm hover:bg-blue-900 active:scale-95 cursor-pointer'}`}
                                >
                                    <Play size={15} />
                                    <span>{attemptButtonText}</span>
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {/* Tabs */}
                    {!isFileUploadHomework ? (
                        <div className="grid grid-cols-2 sm:flex gap-1 border-t border-gray-100 pt-3">
                            {tabConfig.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTab === tab.id}
                                    disabled={isTabDisabled(tab)}
                                    onClick={() => handleTabChange(tab.id)}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
                </>
            )}
        </div>
    );
};

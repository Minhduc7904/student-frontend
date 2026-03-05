import React, { useState, useEffect } from "react";
import { Play, Lock, Info, Trophy, FileSearch, History, ChevronRight } from "lucide-react";
import { DetailTabContent } from "./DetailTabContent";
import { RankingTabContent } from "./RankingTabContent";
import { ReviewTabContent } from "./ReviewTabContent";
import { HistoryTabContent } from "./HistoryTabContent";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../../core/constants";

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
    HISTORY: 'history'
};

const TAB_CONFIG = [
    {
        id: TABS.DETAIL,
        label: 'Chi tiết',
        icon: Info,
        requirePermission: null
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
    }
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
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                disabled
                    ? 'cursor-not-allowed text-gray-300'
                    : isActive
                        ? 'bg-blue-800 text-white shadow-sm cursor-pointer'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-blue-800 cursor-pointer'
            }`}
        >
            <Icon size={14} className="shrink-0" />
            <span>{tab.label}</span>
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
    const { courseId, lessonId } = useParams();
    const homeworkContents = learningItemDetail?.homeworkContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS.DETAIL);

    const currentContent = homeworkContents[selectedIndex] || null;
    const competition = currentContent?.competition;

    // Get status config from current content
    const currentStatus = currentContent?.progress?.status || 'DO_NOW';
    const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.DO_NOW;

    // COMPLETED: chỉ cho phép bấm nếu competition có ít nhất 1 rule xem kết quả
    const hasViewRules = !!(competition?.allowViewScore || competition?.showResultDetail || competition?.allowViewAnswer);
    const isButtonDisabled = statusConfig.disabled || (currentStatus === 'COMPLETED' && !hasViewRules);

    const isTabDisabled = (tab) => {
        if (!tab.requirePermission || !competition) return false;
        return !competition[tab.requirePermission];
    };

    const getFirstAvailableTab = () => {
        const availableTab = TAB_CONFIG.find(tab => !isTabDisabled(tab));
        return availableTab ? availableTab.id : TABS.DETAIL;
    };

    useEffect(() => {
        const firstAvailable = getFirstAvailableTab();
        if (isTabDisabled(TAB_CONFIG.find(t => t.id === activeTab))) {
            setActiveTab(firstAvailable);
        }
    }, [competition]);

    /**
     * Handle start competition navigation
     */
    const handleStartCompetition = () => {
        if (competition?.competitionId) {
            const learningItemId = learningItemDetail?.learningItemId;
            const homeworkContentId = currentContent?.homeworkContentId;
            navigate(ROUTES.DO_HOMEWORK_COMPETITION_START(
                courseId,
                lessonId,
                learningItemId,
                homeworkContentId,
                competition.competitionId
            ));
        }
    };

    /**
     * Handle action button:
     * - COMPLETED + có rule → xem kết quả
     * - Các trạng thái khác → bắt đầu / tiếp tục làm bài
     */
    const handleActionButton = () => {
        if (currentStatus === 'COMPLETED' && hasViewRules) {
            const submitId = currentContent?.progress?.homeworkSubmit?.competitionSubmitId;
            if (submitId) {
                navigate(ROUTES.COMPETITION_RESULT(submitId));
            }
            return;
        }
        handleStartCompetition();
    };

    const handleTabChange = (tabId) => {
        const tab = TAB_CONFIG.find(t => t.id === tabId);
        if (tab && isTabDisabled(tab)) return;
        setActiveTab(tabId);
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
        const competitionId = currentContent?.competition?.competitionId;
        const studentId = currentContent?.progress?.studentId;

        const currentTabConfig = TAB_CONFIG.find(t => t.id === activeTab);
        if (currentTabConfig && isTabDisabled(currentTabConfig)) {
            return <LockedContent title="Nội dung bị khóa" desc="Bạn không có quyền truy cập nội dung này" />;
        }

        switch (activeTab) {
            case TABS.DETAIL:
                return <DetailTabContent content={currentContent} onStartCompetition={handleActionButton} />;
            case TABS.RANKING:
                if (!competition?.allowLeaderboard) {
                    return <LockedContent title="Bảng xếp hạng bị khóa" desc="Cuộc thi này không cho phép xem bảng xếp hạng" />;
                }
                return <RankingTabContent competitionId={competitionId} studentId={studentId} />;
            case TABS.REVIEW:
                if (!competition?.allowViewExamContent) {
                    return <LockedContent title="Xem lại đề bị khóa" desc="Cuộc thi này không cho phép xem lại nội dung đề thi" />;
                }
                return <ReviewTabContent />;
            case TABS.HISTORY:
                return <HistoryTabContent competitionId={competitionId} competition={competition} />;
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                                selectedIndex === idx
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
                        <button
                            type="button"
                            disabled={isButtonDisabled}
                            onClick={isButtonDisabled ? undefined : handleActionButton}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl w-full sm:w-auto justify-center font-semibold text-[13px] transition-all shrink-0 ${
                                isButtonDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-800 hover:bg-blue-900 text-white cursor-pointer active:scale-95 shadow-sm'
                            }`}
                        >
                            <Play size={15} />
                            <span>{statusConfig.buttonText}</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto border-t border-gray-100 pt-3">
                        {TAB_CONFIG.map((tab) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                isActive={activeTab === tab.id}
                                disabled={isTabDisabled(tab)}
                                onClick={() => handleTabChange(tab.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
};

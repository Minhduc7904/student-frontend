import React, { useState, useRef, useEffect } from "react";
import { Play, Lock } from "lucide-react";
import { IconInfo, IconRanking, IconSee, IconHistory } from "./icons/index.jsx";
import { DetailTabContent } from "./DetailTabContent";
import { RankingTabContent } from "./RankingTabContent";
import { ReviewTabContent } from "./ReviewTabContent";
import { HistoryTabContent } from "./HistoryTabContent";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../../../core/constants";
// Status configuration - same as DetailTabContent for consistency
const STATUS_CONFIG = {
    DO_NOW: {
        label: 'Chưa làm',
        bgClass: 'bg-red-100',
        textClass: 'text-red-500',
        buttonText: 'Làm ngay'
    },
    REDO: {
        label: 'Làm lại',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-500',
        buttonText: 'Làm lại'
    },
    LATE_SUBMIT: {
        label: 'Nộp muộn',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-600',
        buttonText: 'Làm bài (Muộn)'
    },
    OVERDUE: {
        label: 'Quá hạn',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-500',
        buttonText: 'Đã quá hạn',
        disabled: true
    },
    COMPLETED: {
        label: 'Đã hoàn thành',
        bgClass: 'bg-green-100',
        textClass: 'text-green-600',
        buttonText: 'Xem lại bài làm'
    }
};

// CSS để hỗ trợ animated tabs
const tabStyles = `
    @keyframes slideUnderline {
        0% {
            left: 0;
            width: 0;
        }
        100% {
            left: var(--tab-left);
            width: var(--tab-width);
        }
    }
    
    .tab-indicator {
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: #194DB6;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .tabs-container {
        position: relative;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = tabStyles;
    document.head.appendChild(style);
}

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
        label: 'Thông tin chi tiết', 
        icon: IconInfo,
        requirePermission: null // Always available
    },
    { 
        id: TABS.RANKING, 
        label: 'Bảng xếp hạng', 
        icon: IconRanking,
        requirePermission: 'allowLeaderboard' // Requires allowLeaderboard permission
    },
    { 
        id: TABS.REVIEW, 
        label: 'Xem lại đề', 
        icon: IconSee,
        requirePermission: 'allowViewExamContent' // Requires allowViewExamContent permission
    },
    { 
        id: TABS.HISTORY, 
        label: 'Lịch sử làm bài', 
        icon: IconHistory,
        requirePermission: null // Always available
    }
];

// Tab Button Component
const TabButton = ({ tab, isActive, onClick, index, disabled }) => {
    const Icon = tab.icon;
    const tabRef = useRef(null);

    return (
        <button
            ref={tabRef}
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`pb-3 sm:pb-4 flex flex-row gap-1.5 sm:gap-2 transition-all relative ${
                disabled 
                    ? 'cursor-not-allowed opacity-50' 
                    : 'cursor-pointer hover:opacity-80'
            }`}
            data-tab-index={index}
        >
            <Icon isActive={isActive && !disabled} />
            <div className="p-0.5 flex flex-row gap-1 sm:gap-1.5 items-center">
                <span className={`text-[10px] sm:text-text-5 lg:text-text-4 transition-colors duration-300 whitespace-nowrap ${
                    disabled 
                        ? 'text-gray-400' 
                        : isActive 
                            ? 'text-blue-800 font-medium' 
                            : 'text-[#5E5E5E]'
                }`}>
                    {tab.label}
                </span>
                {disabled && (
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                )}
            </div>
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
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabsContainerRef = useRef(null);

    const currentContent = homeworkContents[selectedIndex] || null;
    const competition = currentContent?.competition;
    
    // Get status config from current content
    const currentStatus = currentContent?.progress?.status || 'DO_NOW';
    const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.DO_NOW;

    /**
     * Check if a tab is disabled based on competition permissions
     */
    const isTabDisabled = (tab) => {
        if (!tab.requirePermission || !competition) return false;
        return !competition[tab.requirePermission];
    };

    /**
     * Get first available (not disabled) tab
     */
    const getFirstAvailableTab = () => {
        const availableTab = TAB_CONFIG.find(tab => !isTabDisabled(tab));
        return availableTab ? availableTab.id : TABS.DETAIL;
    };

    // Initialize with first available tab
    useEffect(() => {
        const firstAvailable = getFirstAvailableTab();
        if (isTabDisabled(TAB_CONFIG.find(t => t.id === activeTab))) {
            setActiveTab(firstAvailable);
        }
    }, [competition]);

    // Initialize indicator on first load
    useEffect(() => {
        const activeTabIndex = TAB_CONFIG.findIndex(tab => tab.id === activeTab);
        const tabButton = tabsContainerRef.current?.querySelector(`[data-tab-index="${activeTabIndex}"]`);

        if (tabButton) {
            const left = tabButton.offsetLeft;
            const width = tabButton.offsetWidth;
            setIndicatorStyle({ left, width });
        }
    }, [activeTab]);

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

    const handleTabChange = (tabId) => {
        // Check if tab is disabled
        const tab = TAB_CONFIG.find(t => t.id === tabId);
        if (tab && isTabDisabled(tab)) {
            return; // Don't allow changing to disabled tab
        }

        setActiveTab(tabId);

        // Tính toán vị trí và chiều rộng của tab indicator
        const activeTabIndex = TAB_CONFIG.findIndex(tab => tab.id === tabId);
        const tabButton = tabsContainerRef.current?.querySelector(`[data-tab-index="${activeTabIndex}"]`);

        if (tabButton) {
            const left = tabButton.offsetLeft;
            const width = tabButton.offsetWidth;
            setIndicatorStyle({ left, width });
        }
    };

    const renderTabContent = () => {
        const competitionId = currentContent?.competition?.competitionId;
        const studentId = currentContent?.progress?.studentId; // Assuming this exists in progress
        
        // Check if current tab is disabled
        const currentTabConfig = TAB_CONFIG.find(t => t.id === activeTab);
        if (currentTabConfig && isTabDisabled(currentTabConfig)) {
            return (
                <div className="py-8 sm:py-10 lg:py-12 flex flex-col gap-3 sm:gap-4 w-full justify-center items-center rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                    <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    <div className="flex flex-col gap-1.5 sm:gap-2 items-center px-4">
                        <span className="text-subhead-5 sm:text-subhead-4 text-gray-900 font-semibold text-center">
                            Nội dung bị khóa
                        </span>
                        <span className="text-text-5 sm:text-text-4 text-gray-500 text-center">
                            Bạn không có quyền truy cập nội dung này
                        </span>
                    </div>
                </div>
            );
        }
        
        switch (activeTab) {
            case TABS.DETAIL:
                return <DetailTabContent content={currentContent} onStartCompetition={handleStartCompetition} />;
            case TABS.RANKING:
                if (!competition?.allowLeaderboard) {
                    return (
                        <div className="py-8 sm:py-10 lg:py-12 flex flex-col gap-3 sm:gap-4 w-full justify-center items-center rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                            <div className="flex flex-col gap-1.5 sm:gap-2 items-center px-4">
                                <span className="text-subhead-5 sm:text-subhead-4 text-gray-900 font-semibold text-center">
                                    Bảng xếp hạng bị khóa
                                </span>
                                <span className="text-text-5 sm:text-text-4 text-gray-500 text-center">
                                    Cuộc thi này không cho phép xem bảng xếp hạng
                                </span>
                            </div>
                        </div>
                    );
                }
                return <RankingTabContent competitionId={competitionId} studentId={studentId} />;
            case TABS.REVIEW:
                if (!competition?.allowViewExamContent) {
                    return (
                        <div className="py-8 sm:py-10 lg:py-12 flex flex-col gap-3 sm:gap-4 w-full justify-center items-center rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                            <div className="flex flex-col gap-1.5 sm:gap-2 items-center px-4">
                                <span className="text-subhead-5 sm:text-subhead-4 text-gray-900 font-semibold text-center">
                                    Xem lại đề bị khóa
                                </span>
                                <span className="text-text-5 sm:text-text-4 text-gray-500 text-center">
                                    Cuộc thi này không cho phép xem lại nội dung đề thi
                                </span>
                            </div>
                        </div>
                    );
                }
                return <ReviewTabContent />;
            case TABS.HISTORY:
                return <HistoryTabContent />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {/* Header Card */}
            <div className="flex flex-col pt-3 sm:pt-4 pb-1.5 sm:pb-2 rounded-2xl sm:rounded-3xl lg:rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] justify-center items-center gap-4 sm:gap-5 lg:gap-6 w-full">
                {/* Title and Action Button */}
                <div className="flex w-full px-3 sm:px-4 flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-col justify-between items-start gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <div className="p-0.5">
                            <h2 className="text-h4 sm:text-h3 lg:text-[24px] font-semibold text-black truncate">
                                {currentContent?.content || 'Bài tập'}
                            </h2>
                        </div>
                        <div className={`w-fit px-2 sm:px-3 py-0.5 ${statusConfig.bgClass} rounded-lg`}>
                            <span className={`${statusConfig.textClass} text-[10px] sm:text-text-5`}>
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={statusConfig.disabled}
                        onClick={statusConfig.disabled ? undefined : handleStartCompetition}
                        className={`flex flex-row w-full sm:w-auto sm:min-w-52 lg:min-w-60 px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-2.5 rounded-lg justify-center items-center transition-all shrink-0 ${
                            statusConfig.disabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-800 hover:bg-blue-900 cursor-pointer active:scale-95'
                        }`}
                    >
                        <Play className={`w-4 h-4 sm:w-5 sm:h-5 ${statusConfig.disabled ? 'text-gray-500' : 'text-white'}`} />
                        <span className={`text-text-5 sm:text-subhead-5 lg:text-subhead-4 ${statusConfig.disabled ? 'text-gray-500' : 'text-white'} whitespace-nowrap`}>
                            {statusConfig.buttonText}
                        </span>
                    </button>
                </div>

                {/* Tabs Container with animated indicator */}
                <div className="px-3 sm:px-6 lg:px-8 pt-1 pb-0 flex justify-between items-center w-full relative overflow-x-auto">
                    <div
                        className="tab-indicator"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`
                        }}
                    />
                    <div
                        ref={tabsContainerRef}
                        className="flex justify-between items-center w-full min-w-max"
                    >
                        {TAB_CONFIG.map((tab, index) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                index={index}
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

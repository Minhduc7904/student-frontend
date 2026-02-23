import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { IconInfo, IconRanking, IconSee, IconHistory } from "./icons/index.jsx";
import { DetailTabContent } from "./DetailTabContent";
import { RankingTabContent } from "./RankingTabContent";
import { ReviewTabContent } from "./ReviewTabContent";
import { HistoryTabContent } from "./HistoryTabContent";

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
    { id: TABS.DETAIL, label: 'Thông tin chi tiết', icon: IconInfo },
    { id: TABS.RANKING, label: 'Bảng xếp hạng', icon: IconRanking },
    { id: TABS.REVIEW, label: 'Xem lại đề', icon: IconSee },
    { id: TABS.HISTORY, label: 'Lịch sử làm bài', icon: IconHistory }
];

// Tab Button Component
const TabButton = ({ tab, isActive, onClick, index }) => {
    const Icon = tab.icon;
    const tabRef = useRef(null);

    return (
        <button
            ref={tabRef}
            type="button"
            onClick={onClick}
            className="pb-4 flex flex-row gap-2 transition-all cursor-pointer hover:opacity-80 relative"
            data-tab-index={index}
        >
            <Icon isActive={isActive} />
            <div className="p-0.5">
                <span className={`text-text-4 transition-colors duration-300 ${
                    isActive ? 'text-blue-800 font-medium' : 'text-[#5E5E5E]'
                }`}>
                    {tab.label}
                </span>
            </div>
        </button>
    );
};


/**
 * Homework Content Component
 * Hiển thị nội dung learning item type HOMEWORK
 */
export const HomeworkContent = ({ learningItemDetail }) => {
    const homeworkContents = learningItemDetail?.homeworkContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS.DETAIL);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabsContainerRef = useRef(null);

    const currentContent = homeworkContents[selectedIndex] || null;

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

    const handleTabChange = (tabId) => {
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
        switch (activeTab) {
            case TABS.DETAIL:
                return <DetailTabContent content={currentContent} />;
            case TABS.RANKING:
                return <RankingTabContent />;
            case TABS.REVIEW:
                return <ReviewTabContent />;
            case TABS.HISTORY:
                return <HistoryTabContent />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Header Card */}
            <div className="flex flex-col pt-4 pb-2 rounded-4xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] justify-center items-center gap-6 w-full">
                {/* Title and Action Button */}
                <div className="flex w-full px-4 flex-row justify-between items-center">
                    <div className="flex flex-col justify-between items-start gap-2">
                        <div className="p-0.5">
                            <span className="text-[24px] font-semibold text-black">
                                {currentContent?.content || 'Bài tập'}
                            </span>
                        </div>
                        <div className="w-fit px-3 py-0.5 bg-red-100 rounded-lg">
                            <span className="text-red-500 text-text-5">
                                Chưa làm
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex flex-row min-w-60 px-4 py-3 gap-2.5 bg-blue-800 rounded-lg justify-center items-center hover:bg-blue-900 transition-all cursor-pointer active:scale-95"
                    >
                        <Play className="w-5 h-5 text-white" />
                        <span className="text-white text-subhead-4">
                            Làm ngay
                        </span>
                    </button>
                </div>

                {/* Tabs Container with animated indicator */}
                <div className="px-8 pt-1 pb-0 flex justify-between items-center w-full relative">
                    <div
                        className="tab-indicator"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`
                        }}
                    />
                    <div
                        ref={tabsContainerRef}
                        className="flex justify-between items-center w-full"
                    >
                        {TAB_CONFIG.map((tab, index) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                index={index}
                                isActive={activeTab === tab.id}
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

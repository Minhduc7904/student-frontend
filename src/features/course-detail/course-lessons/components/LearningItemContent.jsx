import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from '../../../../assets/icons/Home.svg';
import { SvgIcon } from "../../../../shared/components";
import { ROUTES } from "../../../../core/constants";
import { YoutubeContent, VideoContent, DocumentContent, HomeworkContent } from "./content-types";
import { Menu, X } from "lucide-react";

/**
 * Learning Item Content Component
 * Hiển thị nội dung chi tiết của learning item
 */
export const LearningItemContent = ({ learningItemDetail, lessonDetail, loading = false }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Tìm vị trí của learning item hiện tại trong lesson
    const learningItems = lessonDetail?.learningItems || [];
    const currentIndex = learningItems.findIndex(
        item => item.learningItemId === learningItemDetail?.learningItemId
    );
    const currentPosition = currentIndex !== -1 ? currentIndex + 1 : 0;
    const totalItems = learningItems.length;

    const percentage = totalItems > 0 ? (currentPosition / totalItems) * 100 : 0;

    const handleGoHome = () => {
        navigate(ROUTES.DASHBOARD);
    };

    // Render content theo type
    const renderContentByType = () => {
        const type = learningItemDetail?.type;

        switch (type) {
            case 'YOUTUBE':
                return <YoutubeContent learningItemDetail={learningItemDetail} />;
            case 'VIDEO':
                return <VideoContent learningItemDetail={learningItemDetail} />;
            case 'DOCUMENT':
                return <DocumentContent learningItemDetail={learningItemDetail} />;
            case 'HOMEWORK':
                return <HomeworkContent learningItemDetail={learningItemDetail} />;
            default:
                return (
                    <div className="w-full p-10">
                        <p className="text-text-4 text-gray-600">
                            Loại nội dung không được hỗ trợ: {type}
                        </p>
                    </div>
                );
        }
    };
    
    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-6 bg-white rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-[1px_-1px_4px_4px_rgba(138,138,138,0.25)] border border-[#E1E1E1]/30 flex justify-start items-center flex-col">
            <div className="flex flex-col gap-3 sm:gap-4 w-full justify-center items-center">
                {/* Header với title và nút quay về trang chủ */}
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full px-3 sm:px-6 lg:px-10">
                    {/* Nút toggle sidebar - Hidden on mobile as we already have the main toggle */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 translate-x-1/2
                                w-9 h-9 items-center justify-center
                                bg-white cursor-pointer hover:bg-gray-50 rounded-lg transition-colors
                                "
                    >
                        {isSidebarOpen ? (
                            <X className="active:scale-95 transition hover:scale-105" size={24} />
                        ) : (
                            <Menu className="active:scale-95 transition hover:scale-105" size={24} />
                        )}
                    </button>

                    <div className="flex flex-col justify-start items-start flex-1 min-w-0">
                        <div className="p-0.5">
                            {loading ? (
                                <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <span className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-blue-800">
                                    {currentPosition > 0
                                        ? `Mục học tập ${currentPosition} / ${totalItems}`
                                        : "Mục học tập"
                                    }
                                </span>
                            )}
                        </div>
                        <div className="p-0.5">
                            {loading ? (
                                <div className="h-5 sm:h-6 w-48 sm:w-64 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <h1 className="text-subhead-5 sm:text-subhead-4 lg:text-h4 text-gray-900 truncate">
                                    {learningItemDetail?.title || "Tiêu đề mục học tập"}
                                </h1>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="px-3 py-2 gap-1 sm:gap-1.5 justify-center items-center flex flex-row bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-500 active:scale-105 transition shrink-0"
                    >
                        <SvgIcon src={Home} width={16} height={16} className="sm:w-5 sm:h-5" />
                        <div className="p-0.5 flex justify-center items-center">
                            <span className="text-[10px] sm:text-text-5 lg:text-subhead-5 text-blue-800 whitespace-nowrap">
                                Quay lại trang chủ
                            </span>
                        </div>
                    </button>
                </div>
                <div className="mx-3 sm:mx-6 lg:ml-10 w-full lg:w-[calc(100%-40px)] h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-800 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {/* Content */}
                <div className="w-full flex-1">
                    {loading ? (
                        <div className="w-full p-4 sm:p-6 lg:p-10">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                                <div className="h-48 sm:h-56 lg:h-64 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                            </div>
                        </div>
                    ) : (
                        renderContentByType()
                    )}
                </div>
            </div>

        </div>
    );
};

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
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-6 bg-white rounded-[40px] shadow-[1px_-1px_4px_4px_rgba(138,138,138,0.25)] border border-[#E1E1E1]/30 flex justify-start items-center flex-col">
            <div className="flex flex-col gap-4 w-full justify-center items-center">
                {/* Header với title và nút quay về trang chủ */}
                <div className="relative flex justify-between items-center flex-row w-full px-10">
                    {/* Nút toggle sidebar */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 translate-x-1/2
                                w-9 h-9 flex items-center justify-center
                                bg-white cursor-pointer
                                "
                                    >
                        {isSidebarOpen ? (
                            <X className="active:scale-95 transition hover:scale-105" size={24} />
                        ) : (
                            <Menu className="active:scale-95 transition hover:scale-105" size={24} />
                        )}
                    </button>

                    <div className="flex flex-col justify-start items-start">
                        <div className="p-[2px]">
                            {loading ? (
                                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <span className="text-subhead-4 text-blue-800">
                                    {currentPosition > 0
                                        ? `Mục học tập ${currentPosition} / ${totalItems}`
                                        : "Mục học tập"
                                    }
                                </span>
                            )}
                        </div>
                        <div className="p-[2px]">
                            {loading ? (
                                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <span className="text-subhead-4 text-gray-900">
                                    {learningItemDetail?.title || "Tiêu đề mục học tập"}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="px-3 gap-1 justify-center items-center flex flex-row bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-500 active:scale-105 transition"
                    >
                        <SvgIcon src={Home} width={20} height={20} />
                        <div className="p-[2px]">
                            <span className="text-subhead-5 text-blue-800">
                                Quay lại trang chủ
                            </span>
                        </div>
                    </button>
                </div>
                <div className="ml-10 w-[calc(100%-40px)] h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-800 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {/* Content */}
                <div className="w-full flex-1">
                    {loading ? (
                        <div className="w-full p-10">
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                                <div className="h-64 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
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

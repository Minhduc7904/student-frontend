import React, { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { learningItemService } from "@/core/services";

/**
 * Video Content Component
 * Hiển thị nội dung learning item type VIDEO với streaming support
 */
export const VideoContent = ({ learningItemDetail }) => {
    const videoContents = learningItemDetail?.videoContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentContent = videoContents[selectedIndex] || null;
    const mediaFile = currentContent?.mediaFiles?.[0];
    
    // Tạo streaming URL với Range Request support
    const videoUrl = mediaFile && learningItemDetail?.learningItemId
        ? learningItemService.getVideoStreamUrl(
            learningItemDetail.learningItemId,
            mediaFile.mediaId
        )
        : null;

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* Tab để switch video */}
                {videoContents.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto w-full justify-center items-center rounded-2xl border border-blue-100 bg-blue-50/70 p-2">
                        {videoContents.map((content, index) => (
                            <button
                                key={content.videoContentId}
                                onClick={() => setSelectedIndex(index)}
                                className={`min-h-10 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${
                                    selectedIndex === index
                                        ? 'bg-blue-800 text-white shadow-sm'
                                        : 'bg-white text-blue-800 hover:bg-blue-100'
                                }`}
                            >
                                Video {index + 1}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Custom Video Player */}
                {videoUrl ? (
                    <VideoPlayer videoUrl={videoUrl} />
                ) : (
                    <div className="w-full aspect-video rounded-2xl border border-blue-100 bg-blue-50/70 flex items-center justify-center">
                        <p className="text-text-5 sm:text-text-4 text-gray-500">Không có video</p>
                    </div>
                )}
            </div>

            {/* Content text */}
            {currentContent?.content && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <h3 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900 font-semibold">Nội dung video</h3>
                    <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {currentContent.content}
                    </div>
                </div>
            )}
        </div>
    );
};

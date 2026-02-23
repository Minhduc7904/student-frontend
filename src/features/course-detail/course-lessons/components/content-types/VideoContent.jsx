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
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                {/* Tab để switch video */}
                {videoContents.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto w-full justify-center items-center">
                        {videoContents.map((content, index) => (
                            <button
                                key={content.videoContentId}
                                onClick={() => setSelectedIndex(index)}
                                className={`px-4 py-2 rounded-lg text-subhead-5 transition whitespace-nowrap cursor-pointer ${
                                    selectedIndex === index
                                        ? 'bg-blue-800 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                    <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center">
                        <p className="text-text-4 text-gray-500">Không có video</p>
                    </div>
                )}
            </div>

            {/* Content text */}
            {currentContent?.content && (
                <div className="flex flex-col gap-4">
                    <h3 className="text-h3 text-gray-900 font-semibold">Nội dung video</h3>
                    <div className="text-text-4 text-gray-700 whitespace-pre-wrap">
                        {currentContent.content}
                    </div>
                </div>
            )}
        </div>
    );
};

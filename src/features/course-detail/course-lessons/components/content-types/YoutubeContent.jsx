import React, { useState } from "react";

/**
 * Extract YouTube video ID from URL
 */
const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Youtube Content Component
 * Hiển thị nội dung learning item type YOUTUBE
 */
export const YoutubeContent = ({ learningItemDetail }) => {
    const youtubeContents = learningItemDetail?.youtubeContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const currentContent = youtubeContents[selectedIndex] || null;
    const videoId = currentContent ? getYoutubeVideoId(currentContent.youtubeUrl) : null;

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                {/* Tab để switch video */}
                {youtubeContents.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto w-full justify-center items-center">
                        {youtubeContents.map((content, index) => (
                            <button
                                key={content.youtubeContentId}
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
                
                {/* Video youtube player */}
                {videoId ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
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

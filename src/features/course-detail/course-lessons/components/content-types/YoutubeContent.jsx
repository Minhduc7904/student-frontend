import React, { useState } from "react";

/**
 * Extract YouTube video ID from URL
 */
const getYoutubeVideoId = (url) => {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        // 👉 youtu.be/VIDEO_ID
        if (parsed.hostname.includes('youtu.be')) {
            const id = parsed.pathname.slice(1);
            return id.length === 11 ? id : null;
        }

        // 👉 youtube.com/watch?v=VIDEO_ID
        const v = parsed.searchParams.get('v');
        if (v && v.length === 11) return v;

        // 👉 youtube.com/embed/VIDEO_ID
        if (parsed.pathname.includes('/embed/')) {
            const id = parsed.pathname.split('/embed/')[1];
            return id?.length === 11 ? id : null;
        }

        // 👉 youtube.com/shorts/VIDEO_ID
        if (parsed.pathname.includes('/shorts/')) {
            const id = parsed.pathname.split('/shorts/')[1];
            return id?.length === 11 ? id : null;
        }

        return null;
    } catch {
        return null;
    }
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
        <div className="w-full flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* Tab để switch video */}
                {youtubeContents.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto w-full justify-center items-center rounded-2xl border border-blue-100 bg-blue-50/70 p-2">
                        {youtubeContents.map((content, index) => (
                            <button
                                key={content.youtubeContentId}
                                onClick={() => setSelectedIndex(index)}
                                className={`min-h-10 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${selectedIndex === index
                                    ? 'bg-blue-800 text-white shadow-sm'
                                    : 'bg-white text-blue-800 hover:bg-blue-100'
                                    }`}
                            >
                                Video {index + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Video youtube player */}
                {videoId ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-blue-100 bg-blue-950 shadow-sm">
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

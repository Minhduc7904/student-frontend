import React from "react";
import { Download, Video } from "lucide-react";
import { VideoPlayer } from "../VideoPlayer";
import { learningItemService } from "@/core/services";

/**
 * Video Section Component
 * Hiển thị danh sách video files
 */
export const VideoSection = ({ videoFiles, learningItemId, onDownload }) => {
    if (videoFiles.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-h3 text-gray-900 font-semibold flex items-center gap-2">
                <Video size={24} className="text-blue-800" />
                Video
            </h3>
            {videoFiles.map((file) => {
                // Sử dụng streaming URL nếu có learningItemId
                const videoUrl = learningItemId
                    ? learningItemService.getVideoStreamUrl(learningItemId, file.mediaId)
                    : file.viewUrl;
                
                return (
                    <div key={file.mediaId} className="flex flex-col gap-3">
                        <VideoPlayer videoUrl={videoUrl} />
                        <button
                            onClick={() => onDownload(file)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition self-start"
                        >
                            <Download size={18} />
                            <span className="text-subhead-4">Tải xuống {file.filename}</span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

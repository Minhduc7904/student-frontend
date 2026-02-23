import React from "react";
import { Download, Image as ImageIcon } from "lucide-react";

/**
 * Image Section Component
 * Hiển thị danh sách images theo chiều ngang với scroll
 */
export const ImageSection = ({ imageFiles, onImageClick, onDownload }) => {
    if (imageFiles.length === 0) return null;

    return (
        <div className="flex flex-col w-full gap-4">
            <h3 className="text-h3 text-gray-900 font-semibold flex items-center gap-2">
                <ImageIcon size={24} className="text-blue-800" />
                Hình ảnh
            </h3>
            
            {/* Horizontal scroll container */}
            <div className="flex gap-4 w-full overflow-x-auto pb-2">
                {imageFiles.map((file, index) => (
                    <div key={file.mediaId} className="flex flex-col gap-2 group shrink-0 w-64">
                        {/* Image */}
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition">
                            <img
                                src={file.viewUrl}
                                alt={file.filename}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onClick={() => onImageClick(index)}
                            />
                        </div>
                        
                        {/* Download Button */}
                        <button
                            onClick={() => onDownload(file)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-text-5"
                        >
                            <Download size={14} />
                            <span className="truncate">{file.filename}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

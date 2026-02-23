import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Image Modal Component
 * Modal để xem full size images với navigation
 */
export const ImageModal = ({
    isOpen,
    imageFiles,
    currentIndex,
    onClose,
    onPrev,
    onNext,
    onSelectImage
}) => {
    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onPrev, onNext]);

    if (!isOpen || imageFiles.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" >
            {/* Header với nút đóng */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <div className="text-white text-subhead-4">
                    {currentIndex + 1} / {imageFiles.length}
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Image Container */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }} // Ngăn click đóng modal khi click vào container
                className="flex-1 flex items-center justify-center p-16" >
                {/* Prev Button */}
                {imageFiles.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrev();
                        }}
                        className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition backdrop-blur-sm hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                {/* Image */}
                <img
                    src={imageFiles[currentIndex].viewUrl}
                    alt={imageFiles[currentIndex].filename}
                    className="max-w-full max-h-full object-contain cursor-default"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Next Button */}
                {imageFiles.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext();
                        }}
                        className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition backdrop-blur-sm hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}
            </div>

            {/* Footer với thumbnail list */}
            {imageFiles.length > 1 && (
                <div className="bg-black/50 h-fit backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 overflow-x-auto overflow-y-hidden justify-center">
                        {imageFiles.map((file, index) => (
                            <button
                                key={file.mediaId}
                                onClick={() => onSelectImage(index)}
                                className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition cursor-pointer ${index === currentIndex
                                        ? 'border-blue-500 scale-110'
                                        : 'border-transparent hover:border-white/50'
                                    }`}
                            >
                                <img
                                    src={file.viewUrl}
                                    alt={file.filename}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

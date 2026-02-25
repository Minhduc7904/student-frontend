import React, { useState } from "react";
import { PDFSection, VideoSection, ImageSection, ImageModal } from "./document-sections";

/**
 * Document Content Component
 * Hiển thị nội dung learning item type DOCUMENT với PDF viewer, images, và videos
 */
export const DocumentContent = ({ learningItemDetail }) => {
    const documentContents = learningItemDetail?.documentContents || [];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const currentContent = documentContents[selectedIndex] || null;
    const mediaFiles = currentContent?.mediaFiles || [];

    // Group media files by type (chỉ lấy PDF files có đuôi .pdf)
    const pdfFiles = mediaFiles.filter(file =>
        file.type === 'DOCUMENT' && file.filename.toLowerCase().endsWith('.pdf')
    );
    const imageFiles = mediaFiles.filter(file => file.type === 'IMAGE');
    const videoFiles = mediaFiles.filter(file => file.type === 'VIDEO');

    // Handle file download
    const handleDownload = (file) => {
        window.open(file.viewUrl, '_blank');
    };

    // Image modal handlers
    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageFiles.length - 1));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev < imageFiles.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {/* Tabs để switch documents */}
            {documentContents.length > 1 && (
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto w-full justify-center items-center pb-2">
                    {documentContents.map((content, index) => (
                        <button
                            key={content.documentContentId}
                            onClick={() => setSelectedIndex(index)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-text-5 sm:text-subhead-5 transition whitespace-nowrap cursor-pointer ${selectedIndex === index
                                ? 'bg-blue-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tài liệu {index + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Content text */}
            {currentContent?.content && (
                <div className="flex flex-col gap-3 sm:gap-4">
                    <h3 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900 font-semibold">Nội dung tài liệu</h3>
                    <div className="text-text-5 sm:text-text-4 text-gray-700 whitespace-pre-wrap">
                        {currentContent.content}
                    </div>
                </div>
            )}

            {/* PDF Files Section */}
            <PDFSection
                pdfFiles={pdfFiles}
                onDownload={handleDownload}
            />

            {/* Video Files Section */}
            <VideoSection
                videoFiles={videoFiles}
                learningItemId={learningItemDetail?.learningItemId}
                onDownload={handleDownload}
            />

            {/* Image Files Section */}
            <ImageSection
                imageFiles={imageFiles}
                onImageClick={openImageModal}
                onDownload={handleDownload}
            />

            {/* Empty state */}
            {!currentContent && (
                <div className="w-full py-12 sm:py-16 flex items-center justify-center">
                    <p className="text-text-5 sm:text-text-4 text-gray-500">Không có tài liệu</p>
                </div>
            )}

            {/* Image Modal */}
            <ImageModal
                isOpen={isImageModalOpen}
                imageFiles={imageFiles}
                currentIndex={currentImageIndex}
                onClose={closeImageModal}
                onPrev={goToPrevImage}
                onNext={goToNextImage}
                onSelectImage={setCurrentImageIndex}
            />
        </div>
    );
};

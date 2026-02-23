import React from "react";
import { Download, FileText } from "lucide-react";

/**
 * PDF Section Component
 * Hiển thị danh sách PDF files
 */
export const PDFSection = ({ pdfFiles, onDownload }) => {
    if (pdfFiles.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-h3 text-gray-900 font-semibold flex items-center gap-2">
                <FileText size={24} className="text-blue-800" />
                Tài liệu PDF
            </h3>
            {pdfFiles.map((file) => (
                <div key={file.mediaId} className="flex flex-col gap-3">
                    {/* PDF Viewer */}
                    <div className="w-full aspect-3/4 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <iframe
                            src={file.viewUrl}
                            title={file.filename}
                            className="w-full h-full"
                        />
                    </div>
                    
                    {/* Download Button */}
                    <button
                        onClick={() => onDownload(file)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition self-start"
                    >
                        <Download size={18} />
                        <span className="text-subhead-4">Tải xuống {file.filename}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

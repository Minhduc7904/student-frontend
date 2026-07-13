import React from "react";
import { Download, FileText } from "lucide-react";

const PDF_VIEWER_OPTIONS = {
    toolbar: "0",
    navpanes: "0",
    scrollbar: "1",
    view: "FitH",
    pagemode: "none",
};

const getPdfViewerUrl = (url) => {
    if (!url) return "";

    const [baseUrl, rawHash = ""] = url.split("#");
    const params = new URLSearchParams(rawHash);

    Object.entries(PDF_VIEWER_OPTIONS).forEach(([key, value]) => {
        if (!params.has(key)) params.set(key, value);
    });

    return `${baseUrl}#${params.toString()}`;
};

export const PDFSection = ({ pdfFiles, onDownload }) => {
    if (pdfFiles.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-h3 font-semibold text-gray-900">
                <FileText size={24} className="text-blue-800" />
                Tài liệu PDF
            </h3>

            {pdfFiles.map((file) => (
                <div key={file.mediaId} className="flex flex-col gap-3">
                    <div className="aspect-3/4 w-full overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                        <iframe
                            src={getPdfViewerUrl(file.viewUrl)}
                            title={file.filename}
                            className="h-full w-full"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => onDownload(file)}
                        className="flex items-center gap-2 self-start rounded-lg bg-blue-800 px-4 py-2 text-white transition hover:bg-blue-900"
                    >
                        <Download size={18} />
                        <span className="text-subhead-4">Tải xuống {file.filename}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

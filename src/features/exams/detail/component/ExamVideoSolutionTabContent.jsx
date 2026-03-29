import { memo } from 'react';

const ExamVideoSolutionTabContent = ({ videoEmbedUrl }) => {
    if (videoEmbedUrl) {
        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="aspect-video w-full">
                    <iframe
                        title="Video chữa đề"
                        src={videoEmbedUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Không thể hiển thị video chữa do đường dẫn chưa hợp lệ.
        </div>
    );
};

export default memo(ExamVideoSolutionTabContent);

import { AlertCircle } from "lucide-react";
import {
    DocumentContent,
    HomeworkContent,
    VideoContent,
    YoutubeContent,
} from "./content-types";

export const LearningItemBody = ({ learningItemDetail, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4 p-4 sm:p-6">
                <div className="h-7 w-48 animate-pulse rounded-xl bg-blue-100" />
                <div className="aspect-video w-full animate-pulse rounded-2xl bg-blue-50" />
                <div className="h-4 w-3/4 animate-pulse rounded-lg bg-blue-100" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-blue-100" />
            </div>
        );
    }

    switch (learningItemDetail?.type) {
        case "YOUTUBE":
            return <YoutubeContent learningItemDetail={learningItemDetail} />;
        case "VIDEO":
            return <VideoContent learningItemDetail={learningItemDetail} />;
        case "DOCUMENT":
            return <DocumentContent learningItemDetail={learningItemDetail} />;
        case "HOMEWORK":
            return <HomeworkContent learningItemDetail={learningItemDetail} />;
        default:
            return (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/70 p-6 text-center">
                    <div>
                        <AlertCircle className="mx-auto text-blue-700" size={28} />
                        <p className="mt-3 text-sm font-bold text-blue-950">Không hỗ trợ loại nội dung này</p>
                        <p className="mt-1 text-xs text-gray-600">{learningItemDetail?.type || "Chưa có dữ liệu"}</p>
                    </div>
                </div>
            );
    }
};

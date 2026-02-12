import { memo } from "react";
import { BookOpen } from "lucide-react";
import ChapterSection from "./ChapterSection";

/**
 * LessonList - Danh sách các chapters và lessons
 */
const LessonList = memo(({ courseId, chapters, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <span className="text-text-5 text-gray-subtle">
                    Đang tải danh sách bài học...
                </span>
            </div>
        );
    }

    if (!chapters || chapters.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <p className="text-subhead-5 text-gray-subtle">
                    Chưa có bài học nào
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {chapters.map((chapter, index) => (
                <ChapterSection
                    key={chapter.chapterId}
                    chapter={chapter}
                    courseId={courseId}
                    defaultExpanded={true}
                />
            ))}
        </div>
    );
});

LessonList.displayName = "LessonList";

export default LessonList;

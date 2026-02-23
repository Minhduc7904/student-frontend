import { memo, useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import CircularProgress from "../../components/CircularProgress";
import { LessonItemWithDropdown } from "./LessonItemWithDropdown";

/**
 * ChapterSection - Hiển thị chương học với các bài học
 */
export const ChapterSection = memo(({ chapter, courseId, currentLessonId, defaultExpanded = false }) => {
    const hasInitializedRef = useRef(false);
    
    // Kiểm tra xem chapter có chứa lesson hiện tại không
    const containsCurrentLesson = currentLessonId && chapter.lessons.some(
        lesson => lesson.lessonId === parseInt(currentLessonId)
    );
    
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || containsCurrentLesson);

    // Tự động expand lần đầu nếu chứa lesson hiện tại
    useEffect(() => {
        if (!hasInitializedRef.current && containsCurrentLesson) {
            setIsExpanded(true);
            hasInitializedRef.current = true;
        }
    }, [containsCurrentLesson]);

    return (
        <div className="flex flex-col rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            {/* Chapter Header */}
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full flex cursor-pointer items-center justify-between py-3 px-2 transition-colors hover:bg-blue-50 active:bg-blue-50"
            >
                <div className="flex flex-row w-full justify-between items-center gap-3">
                    <div
                        className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <ChevronRight size={24} className="text-gray-700" />
                    </div>

                    <div className="text-left flex flex-row justify-start items-center gap-1 flex-1">
                        <h3 className="text-subhead-4 text-blue-800">
                            {chapter.name}
                        </h3>
                        <p className="text-text-5 text-gray-subtle">
                            {chapter.lessons.length} bài học
                        </p>
                    </div>

                    <CircularProgress
                        size={28}
                        strokeWidth={3}
                        progress={chapter.completionPercentage || 0}
                    />
                </div>
            </button>

            {/* Animated Lessons List */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    {chapter.lessons.map((lesson) => (
                        <LessonItemWithDropdown
                            key={lesson.lessonId}
                            lesson={lesson}
                            courseId={courseId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

ChapterSection.displayName = "ChapterSection";

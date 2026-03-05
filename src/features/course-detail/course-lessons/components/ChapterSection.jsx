import { memo, useState, useEffect, useRef } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import CircularProgress from "../../components/CircularProgress";
import { LessonItemWithDropdown } from "./LessonItemWithDropdown";

/**
 * ChapterSection - Hiển thị chương học với các bài học
 */
export const ChapterSection = memo(({ chapter, courseId, currentLessonId, defaultExpanded = false }) => {
    const hasInitializedRef = useRef(false);

    const containsCurrentLesson = currentLessonId && chapter.lessons.some(
        lesson => lesson.lessonId === parseInt(currentLessonId)
    );

    const [isExpanded, setIsExpanded] = useState(defaultExpanded || containsCurrentLesson);

    useEffect(() => {
        if (!hasInitializedRef.current && containsCurrentLesson) {
            setIsExpanded(true);
            hasInitializedRef.current = true;
        }
    }, [containsCurrentLesson]);

    const completedLessons = chapter.lessons.filter(l => l.completionPercentage === 100).length;
    const totalLessons = chapter.lessons.length;

    return (
        <div className="flex flex-col overflow-hidden">
            {/* Chapter Header */}
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${isExpanded ? 'bg-blue-800 shadow-sm' : 'bg-blue-50 hover:bg-blue-100'}
                `}
            >
                {/* Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${isExpanded ? 'bg-white/20' : 'bg-blue-100'}
                `}>
                    <BookOpen size={16} className={isExpanded ? 'text-white' : 'text-blue-800'} />
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                    <p className={`text-subhead-5 font-semibold truncate
                        ${isExpanded ? 'text-white' : 'text-blue-950'}
                    `}>
                        {chapter.name}
                    </p>
                    <p className={`text-[10px] mt-0.5
                        ${isExpanded ? 'text-blue-100' : 'text-gray-500'}
                    `}>
                        {completedLessons}/{totalLessons} bài đã hoàn thành
                    </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                    <CircularProgress
                        size={26}
                        strokeWidth={3}
                        progress={chapter.completionPercentage || 0}
                        color={isExpanded ? '#ffffff' : '#194DB6'}
                        trackColor={isExpanded ? 'rgba(255,255,255,0.3)' : '#DFE9FF'}
                    />
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-white' : 'text-blue-800'
                        }`}
                    />
                </div>
            </button>

            {/* Animated Lessons List */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="mt-1 flex flex-col gap-1 pl-2">
                        {chapter.lessons.map((lesson, index) => (
                            <LessonItemWithDropdown
                                key={lesson.lessonId}
                                lesson={lesson}
                                courseId={courseId}
                                index={index + 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

ChapterSection.displayName = "ChapterSection";

import { memo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, BookMarked, CheckCircle2 } from "lucide-react";
import { LearningItem } from "./LearningItem";
import { ROUTES } from "../../../../core/constants";

/**
 * LessonItemWithDropdown - Hiển thị bài học có thể mở rộng
 */
export const LessonItemWithDropdown = memo(({ lesson, courseId, index }) => {
    const navigate = useNavigate();
    const { lessonId: currentLessonId, learningItemId } = useParams();

    const containsCurrentLearningItem = learningItemId && lesson.learningItems?.some(
        item => item.learningItemId === parseInt(learningItemId)
    );

    const isActive = !learningItemId && currentLessonId && parseInt(currentLessonId) === lesson.lessonId;
    const isCompleted = lesson.completionPercentage === 100;

    const hasInitializedRef = useRef(false);
    const [isExpanded, setIsExpanded] = useState(isActive || containsCurrentLearningItem);

    useEffect(() => {
        if (!hasInitializedRef.current && (isActive || containsCurrentLearningItem)) {
            setIsExpanded(true);
            hasInitializedRef.current = true;
        }
    }, [isActive, containsCurrentLearningItem]);

    const handleClick = () => {
        navigate(ROUTES.COURSE_LESSON(courseId, lesson.lessonId));
        setIsExpanded(prev => !prev);
    };

    const hasItems = lesson.learningItems && lesson.learningItems.length > 0;

    return (
        <div className="flex flex-col">
            <button
                onClick={handleClick}
                className={`w-full flex cursor-pointer items-center gap-2.5 px-2 py-2.5 rounded-lg transition-all duration-200
                    ${isActive
                        ? 'bg-blue-100 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }
                `}
            >
                {/* Lesson icon / completed badge */}
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold
                    ${isCompleted
                        ? 'bg-green-100 text-green-500'
                        : isActive
                            ? 'bg-blue-800 text-white'
                            : 'bg-gray-100 text-gray-500'
                    }
                `}>
                    {isCompleted
                        ? <CheckCircle2 size={16} className="text-green-500" />
                        : index ?? <BookMarked size={14} />
                    }
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                    <p className={`text-[13px] font-semibold truncate leading-tight
                        ${isActive ? 'text-blue-800' : 'text-blue-950'}
                    `}>
                        {lesson.title}
                    </p>
                    {hasItems && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {lesson.learningItems.length} nội dung
                        </p>
                    )}
                </div>

                {/* Expand chevron */}
                {hasItems && (
                    <ChevronDown
                        size={14}
                        className={`shrink-0 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-blue-800' : 'text-gray-400'
                        }`}
                    />
                )}
            </button>

            {/* Animated Learning Items */}
            {hasItems && (
                <div
                    className={`grid transition-all duration-300 ease-in-out ${
                        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                    <div className="overflow-hidden">
                        <div className="ml-4 pl-3 border-l-2 border-blue-100 flex flex-col gap-0.5 py-1">
                            {lesson.learningItems.map((learningItem) => (
                                <LearningItem
                                    key={learningItem.learningItemId}
                                    learningItem={learningItem}
                                    courseId={courseId}
                                    lessonId={lesson.lessonId}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!hasItems && isExpanded && (
                <p className="ml-10 pl-3 py-2 text-[11px] text-gray-400 italic">
                    Chưa có nội dung
                </p>
            )}
        </div>
    );
});

LessonItemWithDropdown.displayName = "LessonItemWithDropdown";

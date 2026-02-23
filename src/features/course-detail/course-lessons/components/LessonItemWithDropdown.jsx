import { memo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import CircularProgress from "../../components/CircularProgress";
import { LearningItem } from "./LearningItem";
import { ROUTES } from "../../../../core/constants";

/**
 * LessonItemWithDropdown - Hiển thị bài học có thể mở rộng để xem learning items
 */
export const LessonItemWithDropdown = memo(({ lesson, courseId }) => {
    const navigate = useNavigate();
    const { lessonId: currentLessonId, learningItemId } = useParams();
    
    // Kiểm tra lesson có chứa learning item hiện tại không
    const containsCurrentLearningItem = learningItemId && lesson.learningItems?.some(
        item => item.learningItemId === parseInt(learningItemId)
    );
    
    // Chỉ highlight lesson khi không có learningItemId
    const isActive = !learningItemId && currentLessonId && parseInt(currentLessonId) === lesson.lessonId;
    
    const hasInitializedRef = useRef(false);
    const [isExpanded, setIsExpanded] = useState(isActive || containsCurrentLearningItem);

    // Auto expand lần đầu khi lesson được chọn hoặc chứa learning item được chọn
    useEffect(() => {
        if (!hasInitializedRef.current && (isActive || containsCurrentLearningItem)) {
            setIsExpanded(true);
            hasInitializedRef.current = true;
        }
    }, [isActive, containsCurrentLearningItem]);

    const handleClick = () => {
        // Navigate đến lesson
        navigate(ROUTES.COURSE_LESSON(courseId, lesson.lessonId));
        // Toggle expand
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                className={`pl-8 w-full flex cursor-pointer items-center justify-between py-3 px-2 transition-colors hover:bg-blue-50 active:bg-blue-50 ${
                    isActive ? 'bg-blue-50' : ''
                }`}
            >
                <div className="flex flex-row justify-between items-center gap-3 w-full">
                    <div
                        className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <ChevronRight size={24} className="text-gray-700" />
                    </div>
                    <div className="text-left flex flex-row justify-start items-center gap-2 flex-1">
                        <h3 className={`text-subhead-4 ${
                            isActive ? 'text-blue-800' : 'text-gray-900'
                        }`}>
                            {lesson.title}
                        </h3>
                        <p className="text-text-5 text-gray-subtle">
                            {lesson.learningItems?.length > 0 ? lesson.learningItems.length : 0} mục học tập
                        </p>
                    </div>
                    <CircularProgress
                        size={28}
                        strokeWidth={3}
                        progress={lesson.completionPercentage || 0}
                    />
                </div>
            </button>

            {/* Animated Learning Items List */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    {lesson.learningItems && lesson.learningItems.length > 0 ? (
                        lesson.learningItems.map((learningItem) => (
                            <LearningItem
                                key={learningItem.learningItemId}
                                learningItem={learningItem}
                                courseId={courseId}
                                lessonId={lesson.lessonId}
                            />
                        ))
                    ) : (
                        <div className="pl-16 py-3 px-3">
                            <p className="text-text-5 text-gray-subtle">
                                Chưa có mục học tập nào
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

LessonItemWithDropdown.displayName = "LessonItemWithDropdown";

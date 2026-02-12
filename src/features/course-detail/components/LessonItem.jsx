import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import CircularProgress from "./CircularProgress";

/**
 * LessonItem - Hiển thị thông tin một bài học
 */
const LessonItem = memo(({ lesson, courseId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTES.COURSE_LESSON(courseId, lesson.lessonId));
    };

    return (
        <button
            onClick={handleClick}
            className="pl-8 w-full flex cursor-pointer items-center justify-between py-4 px-3 transition-colors hover:bg-blue-50 active:bg-blue-50"
        >
            <div className="flex flex-row justify-between items-center gap-3 w-full">
                <div className="flex-shrink-0">
                    <ChevronRight size={24} className="text-gray-700" />
                </div>
                <div className="text-left flex flex-row justify-start items-center gap-2 flex-1">
                    <h3 className="text-subhead-4 text-gray-900">
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
    );
});

LessonItem.displayName = "LessonItem";

export default LessonItem;

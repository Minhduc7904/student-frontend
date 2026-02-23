import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SvgIcon } from "../../../../shared/components";
import Video from '../../../../assets/icons/Video.svg';
import Document from '../../../../assets/icons/Document.svg';
import Task from '../../../../assets/icons/Task.svg';
import { ROUTES } from "../../../../core/constants";

/**
 * LearningItem - Hiển thị thông tin một mục học tập
 */
export const LearningItem = memo(({ learningItem, courseId, lessonId }) => {
    const navigate = useNavigate();
    const { learningItemId: currentLearningItemId } = useParams();
    const isActive = currentLearningItemId && parseInt(currentLearningItemId) === learningItem.learningItemId;

    const handleClick = () => {
        navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItem.learningItemId));
    };
    const getIconByType = (type) => {
        switch (type) {
            case 'DOCUMENT':
                return Document;
            case 'HOMEWORK':
                return Task;
            case 'VIDEO':
            case 'YOUTUBE':
                return Video;
            default:
                return Document;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'HOMEWORK':
                return 'Bài tập';
            case 'VIDEO':
            case 'YOUTUBE':
                return 'Video';
            case 'DOCUMENT':
                return 'Tài liệu';
            default:
                return 'Tài liệu';
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`pl-16 w-full flex cursor-pointer items-center justify-between py-3 px-2 transition-colors hover:bg-blue-50 active:bg-blue-50 ${
                isActive ? 'bg-blue-50' : ''
            }`}
        >
            <div className="flex flex-row justify-between items-center gap-3 w-full">
                <div className="flex-shrink-0">
                    <SvgIcon src={getIconByType(learningItem.type)} width={20} height={20} />
                </div>
                <div className="text-left flex flex-row justify-start items-center gap-2 flex-1">
                    <h4 className={`text-text-4 ${
                        isActive ? 'text-blue-800 font-semibold' : 'text-gray-900'
                    }`}>
                        {learningItem.learningItemName}
                    </h4>
                    <span className="text-text-6 text-gray-subtle">
                        {getTypeLabel(learningItem.type)}
                    </span>
                </div>
            </div>
        </button>
    );
});

LearningItem.displayName = "LearningItem";

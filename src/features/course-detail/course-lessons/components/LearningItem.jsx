import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayCircle, FileText, PenLine, Youtube } from "lucide-react";
import { ROUTES } from "../../../../core/constants";

/**
 * TYPE_CONFIG - Config icon và màu cho từng loại learning item
 */
const TYPE_CONFIG = {
    VIDEO: {
        icon: PlayCircle,
        label: 'Video',
        color: 'text-blue-800',
        bg: 'bg-blue-50',
    },
    YOUTUBE: {
        icon: Youtube,
        label: 'Video',
        color: 'text-red-500',
        bg: 'bg-red-50',
    },
    DOCUMENT: {
        icon: FileText,
        label: 'Tài liệu',
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
    },
    HOMEWORK: {
        icon: PenLine,
        label: 'Bài tập',
        color: 'text-green-500',
        bg: 'bg-green-50',
    },
};

/**
 * LearningItem - Hiển thị một mục học tập
 */
export const LearningItem = memo(({ learningItem, courseId, lessonId }) => {
    const navigate = useNavigate();
    const { learningItemId: currentLearningItemId } = useParams();
    const isActive = currentLearningItemId && parseInt(currentLearningItemId) === learningItem.learningItemId;

    const config = TYPE_CONFIG[learningItem.type] ?? TYPE_CONFIG.DOCUMENT;
    const Icon = config.icon;

    const handleClick = () => {
        navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, learningItem.learningItemId));
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 group
                ${isActive
                    ? 'bg-blue-800'
                    : 'hover:bg-blue-50'
                }
            `}
        >
            {/* Type icon */}
            <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center
                ${isActive ? 'bg-white/20' : config.bg}
            `}>
                <Icon size={13} className={isActive ? 'text-white' : config.color} />
            </div>

            {/* Name */}
            <span className={`flex-1 text-left text-[12px] font-medium truncate leading-tight
                ${isActive ? 'text-white' : 'text-blue-950 group-hover:text-blue-800'}
            `}>
                {learningItem.learningItemName}
            </span>

            {/* Type badge */}
            <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full
                ${isActive
                    ? 'bg-white/20 text-white'
                    : `${config.bg} ${config.color}`
                }
            `}>
                {config.label}
            </span>
        </button>
    );
});

LearningItem.displayName = "LearningItem";

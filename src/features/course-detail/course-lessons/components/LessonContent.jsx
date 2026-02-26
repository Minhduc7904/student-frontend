import { memo } from "react";
import { Clock, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SvgIcon } from "../../../../shared/components";
import Video from '../../../../assets/icons/Video.svg';
import Document from '../../../../assets/icons/Document.svg';
import Task from '../../../../assets/icons/Task.svg';
import Home from '../../../../assets/icons/Home.svg';
import { ROUTES } from "../../../../core/constants";

/**
 * LearningItemCard - Card hiển thị từng learning item
 */
const LearningItemCard = memo(({ item, index, courseId, lessonId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, item.learningItemId));
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

    const getTypeBgColor = (type) => {
        switch (type) {
            case 'HOMEWORK':
                return 'bg-amber-50';
            case 'VIDEO':
            case 'YOUTUBE':
                return 'bg-blue-50';
            case 'DOCUMENT':
                return 'bg-purple-50';
            default:
                return 'bg-gray-50';
        }
    };

    const getTypeTextColor = (type) => {
        switch (type) {
            case 'HOMEWORK':
                return 'text-amber-700';
            case 'VIDEO':
            case 'YOUTUBE':
                return 'text-blue-700';
            case 'DOCUMENT':
                return 'text-purple-700';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <button 
            onClick={handleClick}
            className="w-full bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
            <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon & Status */}
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getTypeBgColor(item.type)} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-gray-100`}>
                        <SvgIcon src={getIconByType(item.type)} width={20} height={20} className="sm:w-6 sm:h-6" />
                    </div>
                    {item.isLearned ? (
                        <CheckCircle2 size={16} className="sm:w-5 sm:h-5 text-green-500" />
                    ) : (
                        <Circle size={16} className="sm:w-5 sm:h-5 text-gray-300" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                        <span className="text-[10px] sm:text-text-5 text-gray-500 font-semibold">
                            Mục {index + 1}
                        </span>
                        <span className={`text-[10px] sm:text-text-5 px-2 sm:px-2.5 py-0.5 sm:py-1 ${getTypeBgColor(item.type)} ${getTypeTextColor(item.type)} rounded-full font-semibold border border-current border-opacity-20`}>
                            {getTypeLabel(item.type)}
                        </span>
                    </div>
                    <h4 className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-gray-900 mb-1 line-clamp-2 font-semibold">
                        {item.learningItemName}
                    </h4>
                    {item.isLearned && (
                        <span className="text-[10px] sm:text-text-5 text-green-600 font-semibold">
                            ✓ Đã hoàn thành
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
});

LearningItemCard.displayName = "LearningItemCard";

/**
 * LessonContent - Hiển thị nội dung chi tiết của bài học
 */
export const LessonContent = memo(({ lessonDetail }) => {
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const handleGoHome = () => {
        navigate(ROUTES.DASHBOARD);
    };

    if (!lessonDetail) {
        return (
            <div className="h-full w-full overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-6 bg-white rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-[1px_-1px_4px_4px_rgba(138,138,138,0.25)] border border-[#E1E1E1]/30 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-text-5 sm:text-text-4 text-gray-500">
                        Chọn một bài học để xem nội dung
                    </p>
                </div>
            </div>
        );
    }

    const {
        title,
        teacherName,
        learningItems = [],
        totalLearningItems,
        completedLearningItems,
        completionPercentage,
        chapters = []
    } = lessonDetail;

    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-6 bg-white rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-[1px_-1px_4px_4px_rgba(138,138,138,0.25)] border border-[#E1E1E1]/30">
            <div className="flex flex-col gap-4 sm:gap-6 w-full">
                {/* Header với title và nút quay về trang chủ */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full px-3 sm:px-6 lg:px-10">
                    <div className="flex flex-col justify-start items-start flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                            <BookOpen size={16} className="sm:w-5 sm:h-5 text-blue-800" />
                            <span className="text-[10px] sm:text-text-5 text-blue-800 font-semibold uppercase">
                                Bài học
                            </span>
                        </div>
                        <h1 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900">
                            {title}
                        </h1>
                        {teacherName && (
                            <p className="text-text-5 sm:text-subhead-5 text-gray-600 mt-1">
                                Giảng viên: {teacherName}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="px-3 py-2 gap-1 sm:gap-1.5 justify-center items-center flex flex-row bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-500 active:scale-105 transition shrink-0"
                    >
                        <SvgIcon src={Home} width={16} height={16} className="sm:w-5 sm:h-5" />
                        <div className="p-0.5">
                            <span className="text-[10px] sm:text-text-5 lg:text-subhead-5 text-blue-800 whitespace-nowrap">
                                Quay lại trang chủ
                            </span>
                        </div>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-3 sm:px-6 lg:px-10">
                    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                            <span className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-gray-900 font-semibold">
                                Tiến độ học tập
                            </span>
                            <span className="text-subhead-5 sm:text-h4 text-blue-800 font-bold">
                                {completionPercentage}%
                            </span>
                        </div>
                        <div className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 ease-out rounded-full"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <p className="text-[10px] sm:text-text-5 text-gray-600 mt-2">
                            {completedLearningItems}/{totalLearningItems} mục đã hoàn thành
                        </p>
                    </div>
                </div>

                {/* Chapters Info */}
                {chapters.length > 0 && (
                    <div className="px-3 sm:px-6 lg:px-10">
                        <h3 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900 mb-3 sm:mb-4">
                            Chương học liên quan
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                            {chapters.map((chapter) => (
                                <span
                                    key={chapter.chapterId}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-800 text-[10px] sm:text-text-5 rounded-lg font-semibold border border-blue-100"
                                >
                                    {chapter.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Items */}
                <div className="px-3 sm:px-6 lg:px-10">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <h3 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900">
                            Nội dung học tập ({learningItems.length})
                        </h3>
                    </div>

                    {learningItems.length > 0 ? (
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {learningItems.map((item, index) => (
                                <LearningItemCard
                                    key={item.learningItemId}
                                    item={item}
                                    index={index}
                                    courseId={courseId}
                                    lessonId={lessonId}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-8 sm:p-10 lg:p-12 border border-gray-100 text-center">
                            <BookOpen size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-text-5 sm:text-text-4 text-gray-500">
                                Bài học này chưa có nội dung học tập
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-text-5 text-gray-500">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Clock size={14} className="sm:w-4 sm:h-4" />
                            <span>Cập nhật gần đây</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

LessonContent.displayName = "LessonContent";

import { memo } from "react";
import { Clock, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { SvgIcon } from "../../../../shared/components";
import Video from '../../../../assets/icons/Video.svg';
import Document from '../../../../assets/icons/Document.svg';
import Task from '../../../../assets/icons/Task.svg';

/**
 * LearningItemCard - Card hiển thị từng learning item
 */
const LearningItemCard = memo(({ item, index }) => {
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
        <button className="w-full bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] hover:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.1)] transition-all duration-200 hover:scale-[1.01]">
            <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon & Status */}
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getTypeBgColor(item.type)} rounded-lg flex items-center justify-center shrink-0`}>
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
                        <span className={`text-[10px] sm:text-text-5 px-1.5 sm:px-2 py-0.5 ${getTypeBgColor(item.type)} ${getTypeTextColor(item.type)} rounded-full font-semibold`}>
                            {getTypeLabel(item.type)}
                        </span>
                    </div>
                    <h4 className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-gray-900 mb-1 line-clamp-2">
                        {item.learningItemName}
                    </h4>
                    {item.isLearned && (
                        <span className="text-[10px] sm:text-text-5 text-green-600">
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
    if (!lessonDetail) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-4 text-gray-500">Chọn một bài học để xem nội dung</p>
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
        <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="p-3 sm:p-4 lg:p-6">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <BookOpen size={16} className="sm:w-5 sm:h-5 text-blue-800" />
                        <span className="text-[10px] sm:text-text-5 text-blue-800 font-semibold uppercase">
                            Bài học
                        </span>
                    </div>
                    <h1 className="text-h3 sm:text-h2 lg:text-h1 text-gray-900 mb-2 sm:mb-3">
                        {title}
                    </h1>
                    {teacherName && (
                        <p className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-gray-600 mb-3 sm:mb-4">
                            Giảng viên: {teacherName}
                        </p>
                    )}

                    {/* Progress Bar */}
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)]">
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                            <span className="text-text-5 sm:text-subhead-5 lg:text-subhead-4 text-gray-900">Tiến độ học tập</span>
                            <span className="text-subhead-5 sm:text-h4 text-blue-800">{completionPercentage}%</span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-700 ease-out rounded-full"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <p className="text-[10px] sm:text-text-5 text-gray-600 mt-1.5 sm:mt-2">
                            {completedLearningItems}/{totalLearningItems} mục đã hoàn thành
                        </p>
                    </div>
                </div>

                {/* Chapters Info */}
                {chapters.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-subhead-5 sm:text-h4 lg:text-h3 text-gray-900 mb-3 sm:mb-4">Chương học liên quan</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {chapters.map((chapter) => (
                                <span
                                    key={chapter.chapterId}
                                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-800 text-[10px] sm:text-text-5 rounded-lg font-semibold"
                                >
                                    {chapter.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Items */}
                <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg sm:rounded-xl p-8 sm:p-10 lg:p-12 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] text-center">
                            <BookOpen size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-text-5 sm:text-text-4 text-gray-500">
                                Bài học này chưa có nội dung học tập
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
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

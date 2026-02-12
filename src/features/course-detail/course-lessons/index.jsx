import { useParams } from "react-router-dom";
import { useLessonDetail } from "../hooks";
import { useSelector } from "react-redux";
import { selectCourseDetail, selectChapters } from "../store/courseDetailSlice";
import { ChevronRight } from "lucide-react";
import { memo, useState } from "react";
import CircularProgress from "../components/CircularProgress";
import Video from '../../../assets/icons/Video.svg';
import Document from '../../../assets/icons/Document.svg';
import Task from '../../../assets/icons/Task.svg';
import { SvgIcon } from "../../../shared/components";
/**
 * LearningItem - Hiển thị thông tin một mục học tập
 */
const LearningItem = memo(({ learningItem }) => {
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
            className="pl-16 w-full flex cursor-pointer items-center justify-between py-3 px-3 transition-colors hover:bg-blue-25 active:bg-blue-50"
        >
            <div className="flex flex-row justify-between items-center gap-3 w-full">
                <div className="flex-shrink-0">
                    <SvgIcon src={getIconByType(learningItem.type)} width={20} height={20} />
                </div>
                <div className="text-left flex flex-row justify-start items-center gap-2 flex-1">
                    <h4 className="text-text-4 text-gray-900">
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

/**
 * LessonItemWithDropdown - Hiển thị bài học có thể mở rộng để xem learning items
 */
const LessonItemWithDropdown = memo(({ lesson, courseId }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="pl-8 w-full flex cursor-pointer items-center justify-between py-4 px-3 transition-colors hover:bg-blue-50 active:bg-blue-50"
            >
                <div className="flex flex-row justify-between items-center gap-3 w-full">
                    <div
                        className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"
                            }`}
                    >
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

const ChapterSection = memo(({ chapter, courseId, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="flex flex-col rounded-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
            {/* Chapter Header */}
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full flex cursor-pointer items-center justify-between py-4 px-3 transition-colors hover:bg-blue-50 active:bg-blue-50"
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

export const CourseLessonsPage = () => {
    const { lessonId, courseId } = useParams();
    const { lessonDetail, loading, error } = useLessonDetail();
    const courseDetail = useSelector(selectCourseDetail);
    const chapters = useSelector(selectChapters);
    if (loading) {
        return <div>Đang tải bài học...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <main className="flex-1 flex flex-row justify-center bg-[#FAFCFF]">
            {/* Sidebar */}
            <div className="flex flex-col w-[427px] h-[calc(100vh-80px)] ">

                {/* Header Card */}
                <div className="p-4 flex-shrink-0">
                    <div className="flex px-6 py-5 gap-6 flex-col bg-blue-800 rounded-xl w-full">
                        <div className="flex flex-row gap-2.5">
                            <div className="w-14 h-14 bg-amber-50" />
                            <div className="flex flex-col gap-1.5">
                                <span className="text-subhead-4 text-white">
                                    {courseDetail?.title}
                                </span>
                                <span className="text-text-5 text-white">
                                    {lessonDetail?.teacherName}
                                </span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-white">Hoàn thành</span>
                                <span className="font-semibold text-white">75%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 transition-all duration-700 ease-out rounded-full"
                                    style={{ width: `75%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Area */}
                <div className="flex-1 min-h-0 px-5 pb-5">
                    <div className="h-full overflow-y-auto rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] bg-white custom-scrollbar flex flex-col gap-4 p-5">
                        {chapters.map((chapter) => (
                            <div key={chapter.chapterId} className="flex-shrink-0">
                                <ChapterSection
                                    chapter={chapter}
                                    courseId={courseId}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right content */}
            <div className="flex-1 overflow-auto">
                {/* Content */}
            </div>
        </main>

    );
};
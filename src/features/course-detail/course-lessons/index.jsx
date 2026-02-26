import { useParams, Link } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLessonDetail, useLearningItemDetail } from "../hooks";
import { useSelector } from "react-redux";
import { selectCourseDetail, selectChapters, selectCourseLessonsLoading, selectCourseLessonsError } from "../store/courseDetailSlice";
import CircularProgress from "../components/CircularProgress";
import { ChapterSection, LessonContent, LearningItemContent } from "./components";
import { ContentLoading } from "../../../shared/components/loading";
import { ROUTES } from "../../../core/constants";

/**
 * Lesson Not Found Component
 */
const LessonNotFound = ({ courseId }) => {
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold text-gray-300 mb-3 sm:mb-4">404</h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Không tìm thấy bài học
                </h2>
                <p className="text-text-5 sm:text-text-4 text-gray-600 mb-6 sm:mb-8">
                    Bài học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    to={ROUTES.COURSE_DETAIL(courseId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg inline-block text-text-5 sm:text-text-4 transition-colors"
                >
                    Quay về khóa học
                </Link>
            </div>
        </div>
    );
};

export const CourseLessonsPage = () => {
    const { lessonId, courseId, learningItemId } = useParams();
    const { lessonDetail, loading: lessonLoading, error: lessonError } = useLessonDetail();
    const { learningItemDetail, loading: learningItemLoading, error: learningItemError } = useLearningItemDetail();
    const courseDetail = useSelector(selectCourseDetail);
    const chapters = useSelector(selectChapters);
    const chaptersLoading = useSelector(selectCourseLessonsLoading);
    const chaptersError = useSelector(selectCourseLessonsError);

    // Mobile sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Toggle sidebar
    const handleToggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    // Close sidebar when clicking on a lesson (mobile only)
    const handleCloseSidebar = useCallback(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, []);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    return (
        <main className="flex-1 flex flex-row justify-center bg-[#FAFCFF] relative">
            {/* Mobile Toggle Button - Fixed position */}
            <button
                onClick={handleToggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
            >
                {isSidebarOpen ? (
                    <X size={24} className="text-gray-900" />
                ) : (
                    <Menu size={24} className="text-gray-900" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={handleToggleSidebar}
                />
            )}

            {/* Sidebar - Responsive */}
            <div
                className={`
                    flex flex-col
                    w-full md:w-80 lg:w-96 xl:w-106.75
                    h-[calc(100dvh-80px)]
                    fixed md:relative
                    top-20 left-0
                    z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:top-0
                    bg-[#FAFCFF]
                `}
            >
                {/* Header Card */}
                <div className="p-3 sm:p-4 shrink-0">
                    <div className="flex px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5 gap-4 sm:gap-5 lg:gap-6 flex-col bg-blue-800 rounded-lg sm:rounded-xl w-full">
                        <div className="flex flex-row gap-2 sm:gap-2.5">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 rounded shrink-0" />
                            <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                                <span className="text-text-5 sm:text-subhead-4 text-white truncate">
                                    {courseDetail?.title}
                                </span>
                                <span className="text-[10px] sm:text-text-5 text-white truncate">
                                    {lessonDetail?.teacherName}
                                </span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-1.5 sm:gap-2">
                            <div className="flex justify-between items-center text-[10px] sm:text-xs">
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
                <div className="flex-1 min-h-0 px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
                    <div className="h-full overflow-y-auto rounded-2xl sm:rounded-[20px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] bg-white custom-scrollbar flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5">
                        {chaptersLoading ? (
                            <ContentLoading message="Đang tải danh sách bài học..." height="h-full" />
                        ) : chaptersError ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-text-5 sm:text-text-4 text-red-500">Lỗi: {chaptersError}</p>
                            </div>
                        ) : (
                            chapters.map((chapter) => (
                                <div key={chapter.chapterId} className="shrink-0">
                                    <ChapterSection
                                        chapter={chapter}
                                        courseId={courseId}
                                        currentLessonId={lessonId}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right content - Responsive */}
            <div className="flex-1 h-[calc(100dvh-80px)] overflow-y-auto custom-scrollbar p-3 sm:p-4 w-full md:w-[calc(100%-20rem)] lg:w-[calc(100%-24rem)] xl:w-[calc(100%-427px)]">
                {learningItemId ? (
                    // Nếu có learningItemId, hiển thị LearningItemContent
                    learningItemError || (!learningItemLoading && !learningItemDetail) ? (
                        <LessonNotFound courseId={courseId} />
                    ) : (
                        <LearningItemContent
                            learningItemDetail={learningItemDetail}
                            lessonDetail={lessonDetail}
                            loading={learningItemLoading}
                        />
                    )
                ) : (
                    // Nếu không có learningItemId, hiển thị LessonContent
                    lessonLoading ? (
                        <ContentLoading message="Đang tải nội dung bài học..." height="h-full" />
                    ) : lessonId && (lessonError || !lessonDetail) ? (
                        <LessonNotFound courseId={courseId} />
                    ) : (
                        <LessonContent lessonDetail={lessonDetail} />
                    )
                )}
            </div>
        </main>
    );
};
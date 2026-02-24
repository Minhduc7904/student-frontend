import { useParams, Link } from "react-router-dom";
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
                <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Không tìm thấy bài học
                </h2>
                <p className="text-gray-600 mb-8">
                    Bài học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    to={ROUTES.COURSE_DETAIL(courseId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg inline-block"
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
                        {chaptersLoading ? (
                            <ContentLoading message="Đang tải danh sách bài học..." height="h-full" />
                        ) : chaptersError ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-text-4 text-red-500">Lỗi: {chaptersError}</p>
                            </div>
                        ) : (
                            chapters.map((chapter) => (
                                <div key={chapter.chapterId} className="flex-shrink-0">
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

            {/* Right content */}
            <div className="flex-1 h-[calc(100vh-80px)] p-4 w-[calc(100%-427px)]">
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
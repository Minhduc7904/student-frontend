import { useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../../core/constants";
import {
    selectChapters,
    selectCourseLessonsError,
    selectCourseLessonsLoading,
} from "./store/courseDetailSlice";
import { CourseHero } from "./components/CourseHero";
import { CourseInfoPanel } from "./components/CourseInfoPanel";
import { CourseLearningProgram } from "./components/CourseLearningProgram";
import { CourseMediaGallery } from "./components/CourseMediaGallery";
import {
    getCourseBanner,
    getCourseImage,
    getCourseSummary,
    getNextLesson,
} from "./components/courseDetailUtils";

export const CourseDetailPage = () => {
    const { courseId: routeCourseId } = useParams();
    const navigate = useNavigate();
    const outletContext = useOutletContext() || {};
    const chapters = useSelector(selectChapters);
    const fallbackLessonsLoading = useSelector(selectCourseLessonsLoading);
    const fallbackLessonsError = useSelector(selectCourseLessonsError);
    const {
        courseId = routeCourseId,
        courseDetail,
        lessons = [],
        lessonsLoading = fallbackLessonsLoading,
        lessonsError = fallbackLessonsError,
    } = outletContext;

    const summary = useMemo(
        () => getCourseSummary({ courseDetail, chapters, lessons }),
        [chapters, courseDetail, lessons]
    );
    const nextLesson = useMemo(() => getNextLesson(lessons), [lessons]);
    const courseImage = getCourseImage(courseDetail);
    const bannerSrc = getCourseBanner(courseDetail);
    const isEnrolled = courseDetail?.isEnrolled !== false;

    const openLesson = (lesson) => {
        if (lesson?.lessonId) {
            navigate(ROUTES.COURSE_LESSON(courseId, lesson.lessonId));
        }
    };

    const openLearningItem = (lesson, item) => {
        if (lesson?.lessonId && item?.learningItemId) {
            navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lesson.lessonId, item.learningItemId));
        }
    };

    const scrollToLessons = () => {
        document.getElementById("course-lessons")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <main className="min-h-[calc(100dvh-80px)] overflow-x-clip bg-blue-50 text-blue-950">
            <CourseHero
                course={courseDetail}
                courseId={courseId}
                bannerSrc={bannerSrc}
                summary={summary}
                isEnrolled={isEnrolled}
                onContinue={() => openLesson(nextLesson)}
                onViewRoadmap={scrollToLessons}
            />

            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-10">
                <section id="course-roadmap" className="order-2 min-w-0 lg:order-1">
                    <div className="mb-5 max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-wide text-blue-800">Lộ trình học</p>
                        <h2 className="mt-2 text-2xl font-bold text-blue-950 sm:text-3xl">Xem trước toàn bộ nội dung khóa học</h2>
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Mở từng chương để xem các buổi học và ảnh xem trước của nội dung. Video, tài liệu và bài tập chỉ mở trong trang học.
                        </p>
                    </div>
                    <CourseMediaGallery course={courseDetail} />
                    <div id="course-lessons" className="scroll-mt-6">
                        <CourseLearningProgram
                            chapters={chapters}
                            loading={lessonsLoading}
                            error={lessonsError}
                            courseImage={courseImage}
                            onOpenItem={openLearningItem}
                        />
                    </div>
                </section>

                <CourseInfoPanel
                    course={courseDetail}
                    courseImage={courseImage}
                    totalLessons={summary.totalLessons}
                    isEnrolled={isEnrolled}
                    onContinue={() => openLesson(nextLesson)}
                />
            </div>
        </main>
    );
};

export default CourseDetailPage;

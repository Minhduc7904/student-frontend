import { ChevronRight } from "lucide-react"
import { selectCourseDetail, selectChapters, selectCourseLessonsLoading } from "./store"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { ROUTES } from "../../core/constants"
import { LessonList } from "./components"

export const CourseDetailPage = () => {
    const { courseId } = useParams();
    const courseDetail = useSelector(selectCourseDetail);
    const chapters = useSelector(selectChapters);
    const lessonsLoading = useSelector(selectCourseLessonsLoading);

    return (
        <main className="flex-1 flex justify-center pt-4 sm:pt-6 lg:pt-8 overflow-y-auto custom-scrollbar mb-4 sm:mb-6 lg:mb-8">
            <div className="px-4 sm:px-6 lg:px-8 xl:px-0 max-w-5xl w-full flex flex-col gap-3 sm:gap-4">
                {/* Breadcrumb */}
                <div className="flex flex-row gap-3 sm:gap-4 lg:gap-6 items-center">
                    <Link to={ROUTES.COURSE_ENROLLMENTS} className="cursor-pointer hover:underline text-text-5 sm:text-subhead-5 text-[#5E5E5E] transition-colors">
                        Khóa học
                    </Link>
                    <ChevronRight size={16} color="#5E5E5E" className="shrink-0" />
                    <span className="text-text-5 sm:text-subhead-5 text-gray-900 truncate">
                        {courseDetail?.title}
                    </span>
                </div>

                {/* Course Title */}
                <div className="flex flex-row gap-3 justify-start items-center">
                    <div className="p-0.5">
                        <h1 className="text-h3 sm:text-h2 lg:text-[28px] font-680 text-blue-800">
                            {courseDetail?.title}
                        </h1>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="p-0.5">
                    <p className="text-gray-900 text-subhead-5 sm:text-h4 lg:text-h3">
                        Chọn một bài để bắt đầu học
                    </p>
                </div>

                {/* Danh sách bài học */}
                <div className="mt-2 sm:mt-3 lg:mt-4">
                    <LessonList courseId={courseId} chapters={chapters} loading={lessonsLoading} />
                </div>
            </div>
        </main>
    )
}
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
        <main className="flex-1 flex justify-center pt-8 overflow-y-auto custom-scrollbar mb-8">

            <div className="lg:px-0 px-4 max-w-5xl w-full flex flex-col gap-4 ">
                <div className="flex flex-row gap-6">
                    <Link to={ROUTES.COURSE_ENROLLMENTS} className="cursor-pointer hover:underline text-text-5 text-[#5E5E5E]">
                        Khóa học
                    </Link>
                    <ChevronRight size={16} color="#5E5E5E" />
                    <span className="text-subhead-5 text-gray-900">
                        {courseDetail?.title}
                    </span>
                </div>
                <div className="flex flex-row gap-3 justify-start items-center">
                    <div className="p-[2px]">
                        <span className="text-[28px] font-680 text-blue-800">
                            {courseDetail?.title}
                        </span>
                    </div>
                </div>
                <div className="p-[2px]">
                    <span className="text-gray-900 text-h3">
                        Chọn một bài để bắt đầu học
                    </span>
                </div>
                {/* Danh sách bài học */}
                <div className="mt-4">
                    <LessonList courseId={courseId} chapters={chapters} loading={lessonsLoading} />
                </div>
            </div>
        </main>
    )
}
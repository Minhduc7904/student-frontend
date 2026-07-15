import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, Image } from "../../../../shared/components/images";
import { ROUTES } from "../../../../core/constants";
import {
    getEnrollmentGrade,
    getEnrollmentProgress,
    getEnrollmentSubject,
    getEnrollmentTeacher,
    getEnrollmentThumbnail,
} from "./courseCardUtils";

const CourseCard = memo(({ enrollment }) => {
    const course = enrollment?.course || {};
    const progress = getEnrollmentProgress(enrollment);
    const teacher = getEnrollmentTeacher(enrollment);

    return (
        <Link
            to={ROUTES.COURSE_DETAIL(course.courseId)}
            className="group block cursor-pointer overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
            aria-label={`Xem khóa học ${course.title || ""}`}
        >
            <div className="relative aspect-[16/9] overflow-hidden bg-blue-100">
                <Image
                    src={getEnrollmentThumbnail(enrollment)}
                    alt={course.title || "Ảnh khóa học"}
                    className="h-full w-full"
                    loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-lg bg-blue-950/85 px-2.5 py-1 text-xs font-bold text-white">
                    {enrollment?.statusDisplay || "Đang học"}
                </span>
            </div>

            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800">
                        {getEnrollmentSubject(enrollment)}
                    </span>
                    <span className="rounded-lg bg-yellow-50 px-2.5 py-1 text-xs font-bold text-blue-950">
                        {getEnrollmentGrade(enrollment)}
                    </span>
                    {course.academicYear ? <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">{course.academicYear}</span> : null}
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-blue-950">
                        {course.title || "Khóa học đang cập nhật"}
                    </h2>
                    <ArrowUpRight size={18} className="mt-1 shrink-0 text-blue-800 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
                        <span className="text-gray-600">Tiến độ học</span>
                        <span className="text-blue-800">{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-blue-100" aria-label={`Tiến độ ${progress}%`}>
                        <div className="h-full rounded-full bg-blue-800 transition-[width] duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-blue-100 pt-4">
                    <Avatar src={teacher.avatarUrl} alt={teacher.name} size="sm" className="shrink-0 ring-2 ring-blue-50" />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500">Giáo viên</p>
                        <p className="truncate text-sm font-bold text-blue-950">{teacher.name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
});

CourseCard.displayName = "CourseCard";

export default CourseCard;

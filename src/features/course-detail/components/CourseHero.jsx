import { BookOpen, ChevronRight, GraduationCap, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../core/constants";
import { cleanText } from "./courseDetailUtils";
import { getLastNameFirstName } from "../../../shared/utils";

const Metric = ({ icon: Icon, children }) => (
    <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
        <Icon size={15} />
        {children}
    </span>
);

export const CourseHero = ({
    course,
    courseId,
    bannerSrc,
    summary,
    isEnrolled,
    onContinue,
    onViewRoadmap,
    primaryAction,
    backRoute = ROUTES.COURSE_ENROLLMENTS,
    backLabel = "Khóa học của tôi",
}) => {
    const description = cleanText(course?.description)
        || "Khám phá lộ trình học, các buổi học và nội dung được sắp xếp theo từng chủ đề.";
    const teacher = {
        ...course?.teacher,
        firstName: course?.teacher?.firstName || course?.teacherFirstName,
        lastName: course?.teacher?.lastName || course?.teacherLastName,
    };
    const teacherName = getLastNameFirstName(teacher, course?.teacherName);
    const teacherAvatarUrl = course?.teacherAvatarUrl || course?.teacher?.avatarUrl;
    const PrimaryActionIcon = primaryAction?.Icon;

    return (
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-blue-950 text-white">
            {bannerSrc ? (
                <img
                    src={bannerSrc}
                    alt={`Ảnh khóa học ${course?.title || ""}`}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : null}
            <div className="absolute inset-0 bg-blue-950/80" />

            <div className="relative mx-auto min-h-[340px] w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:min-h-[390px] lg:px-8 lg:py-10">
                <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-blue-100 sm:text-sm">
                    <Link to={backRoute} className="cursor-pointer transition hover:text-white">{backLabel}</Link>
                    <ChevronRight size={15} />
                    <span className="max-w-full truncate font-semibold text-white">{course?.title || "Chi tiết khóa học"}</span>
                </nav>

                <div className="mt-12 max-w-3xl lg:mt-16">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                        <span>{course?.subjectName || course?.subject?.name || "Khóa học trực tuyến"}</span>
                        {course?.grade ? <span>/ Lớp {course.grade}</span> : null}
                        {course?.academicYear ? <span>/ {course.academicYear}</span> : null}
                    </div>
                    <h1 className="mt-4 text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
                        {course?.title || "Chi tiết khóa học"}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
                        {description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Metric icon={BookOpen}>{summary.totalLessons} buổi học</Metric>
                        <Metric icon={PlayCircle}>{summary.learningItems} nội dung</Metric>
                        {teacherName ? (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
                                {teacherAvatarUrl ? (
                                    <img src={teacherAvatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                                ) : <GraduationCap size={15} />}
                                {teacherName}
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                        {primaryAction ? (
                            <button
                                type="button"
                                onClick={primaryAction.onClick}
                                disabled={primaryAction.disabled}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                            >
                                {PrimaryActionIcon ? <PrimaryActionIcon size={18} /> : null}
                                {primaryAction.label}
                            </button>
                        ) : isEnrolled ? (
                            <button
                                type="button"
                                onClick={onContinue}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-100 active:scale-[0.98]"
                            >
                                <PlayCircle size={18} />
                                Học tiếp
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={onViewRoadmap}
                            className="inline-flex cursor-pointer items-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"
                        >
                            Xem lộ trình
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

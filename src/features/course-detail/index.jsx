import { useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Clock3,
    GraduationCap,
    Layers3,
    PlayCircle,
    Sparkles,
    Target,
} from "lucide-react";
import MathCourseImage from "../../assets/images/MathCourseImage.png";
import EnglishCourseImage from "../../assets/images/EnglishCourseImage.png";
import PhysicCourseImage from "../../assets/images/PhysicCourseImage.png";
import { ROUTES } from "../../core/constants";
import { SUBJECT_IDS } from "../../core/constants/subject";
import {
    selectChapters,
    selectCourseLessonsError,
    selectCourseLessonsLoading,
} from "./store/courseDetailSlice";
import CircularProgress from "./components/CircularProgress";

const motionClass = "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

const clampProgress = (value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(numericValue)));
};

const cleanText = (value) => {
    if (!value) {
        return "";
    }

    return String(value)
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const getCourseImage = (courseDetail) => {
    if (courseDetail?.imageUrl) {
        return courseDetail.imageUrl;
    }

    switch (courseDetail?.subjectId) {
        case SUBJECT_IDS.ENGLISH:
            return EnglishCourseImage;
        case SUBJECT_IDS.PHYSICS:
            return PhysicCourseImage;
        case SUBJECT_IDS.MATH:
        default:
            return MathCourseImage;
    }
};

const getLessonLearningItemCount = (lesson) => lesson?.learningItems?.length || 0;

const getNextLesson = (lessons) => {
    if (!lessons?.length) {
        return null;
    }

    return lessons.find((lesson) => clampProgress(lesson?.completionPercentage) < 100) || lessons[0];
};

const getCourseSummary = ({ courseDetail, chapters, lessons }) => {
    const totalLessons = lessons?.length || 0;
    const completedLessons = lessons?.filter((lesson) => clampProgress(lesson?.completionPercentage) >= 100).length || 0;
    const learningItems = lessons?.reduce((total, lesson) => total + getLessonLearningItemCount(lesson), 0) || 0;
    const averageLessonProgress = totalLessons
        ? Math.round(lessons.reduce((total, lesson) => total + clampProgress(lesson?.completionPercentage), 0) / totalLessons)
        : 0;
    const progress = clampProgress(courseDetail?.completionPercentage ?? averageLessonProgress);

    return {
        progress,
        totalChapters: chapters?.length || 0,
        totalLessons,
        completedLessons,
        learningItems,
    };
};

const AnimatedBlock = ({ children, delay = 0, className = "" }) => (
    <div
        className={`opacity-0 animate-slide-up ${className}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        {children}
    </div>
);

const StatCard = ({ icon: Icon, label, value, helper, accent = "blue" }) => {
    const accentClasses = {
        blue: "bg-blue-800 text-white shadow-[0_18px_45px_rgba(25,77,182,0.22)]",
        cyan: "bg-cyan-50 text-blue-900 ring-1 ring-blue-100",
        amber: "bg-yellow-50 text-gray-900 ring-1 ring-yellow-100",
        green: "bg-green-100 text-gray-900 ring-1 ring-green-100",
    };

    return (
        <div className={`group rounded-[24px] p-1 ${accent === "blue" ? "bg-blue-100/70" : "bg-white/70"} ${motionClass} hover:-translate-y-1`}>
            <div className={`h-full rounded-[20px] p-4 sm:p-5 ${accentClasses[accent]} ${motionClass}`}>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
                            {label}
                        </p>
                        <p className="mt-2 text-2xl font-680 tabular-nums sm:text-3xl">
                            {value}
                        </p>
                    </div>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${accent === "blue" ? "bg-white/15" : "bg-white"}`}>
                        <Icon size={20} />
                    </span>
                </div>
                {helper ? (
                    <p className={`mt-4 text-xs leading-5 ${accent === "blue" ? "text-white/78" : "text-gray-subtle"}`}>
                        {helper}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

const ProgressBand = ({ progress }) => (
    <div className="rounded-[28px] bg-white/80 p-1 shadow-[0_18px_50px_rgba(15,37,82,0.08)] ring-1 ring-blue-100/70">
        <div className="rounded-[24px] bg-[#F8FBFF] p-4 sm:p-5">
            <div className="flex items-center gap-4">
                <CircularProgress size={74} strokeWidth={7} progress={progress} color="#194DB6" trackColor="#DFE9FF" />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-680 text-gray-900">Tiến độ khóa học</p>
                        <span className="text-sm font-680 tabular-nums text-blue-800">{progress}%</span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100">
                        <div
                            className="h-full rounded-full bg-linear-to-r from-blue-800 via-blue-cyan to-green-500 transition-[width] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-subtle">
                        Học từng phần nhỏ, hoàn thành bài cũ trước khi chuyển sang phần tiếp theo.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const LessonRow = ({ courseId, lesson, index }) => {
    const progress = clampProgress(lesson?.completionPercentage);
    const itemCount = getLessonLearningItemCount(lesson);
    const isCompleted = progress >= 100;

    return (
        <Link
            to={ROUTES.COURSE_LESSON(courseId, lesson.lessonId)}
            className={`group flex items-center gap-3 rounded-2xl px-3 py-3 ${motionClass} hover:bg-blue-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 active:scale-[0.99]`}
        >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-680 tabular-nums ${isCompleted ? "bg-green-100 text-green-700" : "bg-white text-blue-800 ring-1 ring-blue-100"}`}>
                {isCompleted ? <CheckCircle2 size={18} /> : String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-680 text-gray-900 transition-colors duration-300 group-hover:text-blue-800 sm:line-clamp-1">
                    {lesson?.title || "Bài học chưa có tiêu đề"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-subtle">
                    <span className="inline-flex items-center gap-1">
                        <Layers3 size={13} />
                        {itemCount} mục học tập
                    </span>
                    <span className="tabular-nums">{progress}% hoàn thành</span>
                </div>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-800 ring-1 ring-blue-100 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                <ArrowRight size={17} />
            </span>
        </Link>
    );
};

const ChapterCard = ({ chapter, courseId, collapsed, onToggle, index }) => {
    const lessons = chapter?.lessons || [];
    const progress = clampProgress(chapter?.completionPercentage);
    const completedLessons = lessons.filter((lesson) => clampProgress(lesson?.completionPercentage) >= 100).length;

    return (
        <article
            className="rounded-[28px] bg-white/80 p-1 shadow-[0_18px_50px_rgba(15,37,82,0.07)] ring-1 ring-blue-100/70"
            style={{ animationDelay: `${index * 70}ms` }}
        >
            <div className="rounded-[24px] bg-white">
                <button
                    type="button"
                    onClick={onToggle}
                    className={`group flex w-full cursor-pointer items-center gap-4 rounded-[24px] px-4 py-4 text-left ${motionClass} hover:bg-[#F7FAFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 sm:px-5`}
                    aria-expanded={!collapsed}
                >
                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 sm:flex">
                        <BookOpen size={23} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-680 text-blue-800">
                                Chương {index + 1}
                            </span>
                            <span className="text-xs text-gray-subtle">
                                {completedLessons}/{lessons.length} bài hoàn thành
                            </span>
                        </div>
                        <h2 className="mt-2 line-clamp-2 text-base font-680 text-gray-900 sm:text-lg">
                            {chapter?.name || "Chương học"}
                        </h2>
                    </div>
                    <div className="hidden min-w-[84px] flex-col items-end gap-2 sm:flex">
                        <span className="text-sm font-680 tabular-nums text-blue-800">{progress}%</span>
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-blue-100">
                            <div
                                className="h-full rounded-full bg-blue-800 transition-[width] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <ChevronDown
                        size={22}
                        className={`shrink-0 text-gray-700 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${collapsed ? "rotate-0" : "rotate-180"}`}
                    />
                </button>
                <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                    <div className="overflow-hidden">
                        <div className="border-t border-blue-50 px-2 py-2 sm:px-3">
                            {lessons.map((lesson, lessonIndex) => (
                                <LessonRow
                                    key={lesson.lessonId}
                                    courseId={courseId}
                                    lesson={lesson}
                                    index={lessonIndex}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

const LessonsSkeleton = () => (
    <div className="space-y-4">
        {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-[28px] bg-white/80 p-1 ring-1 ring-blue-100/70">
                <div className="rounded-[24px] bg-white p-5">
                    <div className="h-4 w-32 animate-pulse rounded-full bg-blue-100" />
                    <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
                    <div className="mt-5 space-y-3">
                        <div className="h-12 animate-pulse rounded-2xl bg-gray-50" />
                        <div className="h-12 animate-pulse rounded-2xl bg-gray-50" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyLessons = () => (
    <div className="rounded-[28px] bg-white/80 p-1 shadow-[0_18px_50px_rgba(15,37,82,0.07)] ring-1 ring-blue-100/70">
        <div className="flex flex-col items-center justify-center rounded-[24px] bg-white px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-800">
                <BookOpen size={30} />
            </div>
            <h2 className="mt-5 text-lg font-680 text-gray-900">Chưa có bài học nào</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-subtle">
                Khóa học này chưa mở nội dung học tập. Quay lại sau hoặc kiểm tra các khóa học khác trong danh sách của bạn.
            </p>
        </div>
    </div>
);

const LessonsError = ({ message }) => (
    <div className="rounded-[28px] bg-white/80 p-1 shadow-[0_18px_50px_rgba(15,37,82,0.07)] ring-1 ring-red-100">
        <div className="flex items-start gap-3 rounded-[24px] bg-red-50 px-5 py-5 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={22} />
            <div>
                <h2 className="text-sm font-680">Không tải được danh sách bài học</h2>
                <p className="mt-1 text-sm leading-6 text-red-600">{message || "Vui lòng thử lại sau."}</p>
            </div>
        </div>
    </div>
);

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
    const [collapsedChapters, setCollapsedChapters] = useState(() => new Set());

    const summary = useMemo(
        () => getCourseSummary({ courseDetail, chapters, lessons }),
        [courseDetail, chapters, lessons]
    );
    const nextLesson = useMemo(() => getNextLesson(lessons), [lessons]);
    const courseImage = getCourseImage(courseDetail);
    const description = cleanText(courseDetail?.description)
        || "Theo dõi tiến độ, chọn chương học và tiếp tục bài học phù hợp với nhịp học của bạn.";
    const teacherName = courseDetail?.teacherName || courseDetail?.teacher?.fullName || "Giáo viên phụ trách";

    const toggleChapter = (chapterId) => {
        setCollapsedChapters((current) => {
            const next = new Set(current);

            if (next.has(chapterId)) {
                next.delete(chapterId);
            } else {
                next.add(chapterId);
            }

            return next;
        });
    };

    const handleContinueLearning = () => {
        if (nextLesson?.lessonId) {
            navigate(ROUTES.COURSE_LESSON(courseId, nextLesson.lessonId));
        }
    };

    return (
        <main className="min-h-[calc(100dvh-80px)] w-full overflow-x-hidden bg-[#F4F8FF] text-gray-900">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(128,199,253,0.36),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(253,210,44,0.18),transparent_28%),linear-gradient(180deg,#F8FBFF_0%,#F4F8FF_48%,#FFFFFF_100%)]" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
                <AnimatedBlock>
                    <nav className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                            to={ROUTES.COURSE_ENROLLMENTS}
                            className={`group inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-sm font-680 text-gray-700 shadow-[0_12px_30px_rgba(15,37,82,0.08)] ring-1 ring-blue-100/80 ${motionClass} hover:-translate-y-0.5 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 active:scale-[0.98]`}
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-800 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5">
                                <ArrowLeft size={16} />
                            </span>
                            Khóa học của tôi
                        </Link>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-680 text-blue-800 ring-1 ring-blue-100">
                            <Sparkles size={14} />
                            Đang học
                        </div>
                    </nav>
                </AnimatedBlock>

                <section className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
                    <AnimatedBlock delay={80} className="lg:col-span-8">
                        <div className="h-full rounded-[34px] bg-white/70 p-1 shadow-[0_24px_70px_rgba(15,37,82,0.10)] ring-1 ring-blue-100/80">
                            <div className="relative h-full overflow-hidden rounded-[30px] bg-blue-950 px-5 py-6 text-white sm:px-7 sm:py-8 lg:px-8 lg:py-9">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(91,250,255,0.28),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(253,210,44,0.20),transparent_24%),linear-gradient(135deg,rgba(15,37,82,0.86),rgba(25,77,182,0.94))]" />
                                <div className="relative z-10 grid gap-7 md:grid-cols-[1.35fr_0.65fr] md:items-end">
                                    <div className="min-w-0">
                                        <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-680 text-white/85 ring-1 ring-white/15">
                                            <GraduationCap size={15} />
                                            {teacherName}
                                        </p>
                                        <h1 className="mt-5 max-w-4xl text-[clamp(2rem,6vw,4.8rem)] font-680 leading-[1.02] text-white">
                                            {courseDetail?.title || "Chi tiết khóa học"}
                                        </h1>
                                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                                            {description}
                                        </p>
                                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={handleContinueLearning}
                                                disabled={!nextLesson}
                                                className={`group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-680 text-blue-950 shadow-[0_18px_45px_rgba(255,255,255,0.20)] ${motionClass} hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 active:scale-[0.98]`}
                                            >
                                                Học tiếp
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-950 text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                                                    <PlayCircle size={17} />
                                                </span>
                                            </button>
                                            <a
                                                href="#course-roadmap"
                                                className={`inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-680 text-white ring-1 ring-white/20 ${motionClass} hover:-translate-y-1 hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.98]`}
                                            >
                                                Xem lộ trình
                                            </a>
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] bg-white/10 p-2 ring-1 ring-white/15">
                                        <div className="overflow-hidden rounded-[23px] bg-white/10">
                                            <img
                                                src={courseImage}
                                                alt={courseDetail?.title || "Ảnh khóa học"}
                                                className="h-52 w-full object-contain p-6 drop-shadow-[0_24px_34px_rgba(0,0,0,0.22)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 sm:h-64 lg:h-72"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedBlock>

                    <AnimatedBlock delay={150} className="lg:col-span-4">
                        <div className="grid h-full gap-4">
                            <ProgressBand progress={summary.progress} />
                            <div className="rounded-[28px] bg-white/80 p-1 shadow-[0_18px_50px_rgba(15,37,82,0.08)] ring-1 ring-blue-100/70">
                                <div className="rounded-[24px] bg-white p-4 sm:p-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-680 text-gray-900">Bài học kế tiếp</p>
                                            <p className="mt-1 text-xs text-gray-subtle">
                                                {nextLesson ? `${getLessonLearningItemCount(nextLesson)} mục học tập` : "Chưa có bài học"}
                                            </p>
                                        </div>
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-50 text-gray-900">
                                            <Clock3 size={20} />
                                        </span>
                                    </div>
                                    <p className="mt-4 line-clamp-2 text-base font-680 leading-6 text-blue-950">
                                        {nextLesson?.title || "Nội dung đang được chuẩn bị"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleContinueLearning}
                                        disabled={!nextLesson}
                                        className={`mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-800 px-4 py-3 text-sm font-680 text-white ${motionClass} hover:-translate-y-1 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 active:scale-[0.98]`}
                                    >
                                        Vào bài học
                                        <ArrowRight size={17} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AnimatedBlock>
                </section>

                <AnimatedBlock delay={210}>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            icon={Target}
                            label="Tiến độ"
                            value={`${summary.progress}%`}
                            helper={`${summary.completedLessons}/${summary.totalLessons} bài đã hoàn thành`}
                            accent="blue"
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Chương"
                            value={summary.totalChapters}
                            helper="Các phần học được sắp xếp theo lộ trình"
                            accent="cyan"
                        />
                        <StatCard
                            icon={PlayCircle}
                            label="Bài học"
                            value={summary.totalLessons}
                            helper="Chọn một bài để bắt đầu học"
                            accent="amber"
                        />
                        <StatCard
                            icon={Layers3}
                            label="Mục học tập"
                            value={summary.learningItems}
                            helper="Video, tài liệu và bài tập trong khóa"
                            accent="green"
                        />
                    </section>
                </AnimatedBlock>

                <section id="course-roadmap" className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <AnimatedBlock delay={280}>
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-680 uppercase tracking-[0.16em] text-blue-800">Lộ trình học</p>
                                <h2 className="mt-2 text-2xl font-680 tracking-normal text-gray-900 sm:text-3xl">
                                    Chọn một bài để bắt đầu học
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-6 text-gray-subtle">
                                Các chương mở sẵn để bạn quét nhanh nội dung và tiếp tục đúng điểm đang học.
                            </p>
                        </div>

                        {lessonsLoading ? (
                            <LessonsSkeleton />
                        ) : lessonsError ? (
                            <LessonsError message={lessonsError} />
                        ) : chapters?.length ? (
                            <div className="space-y-4">
                                {chapters.map((chapter, index) => (
                                    <ChapterCard
                                        key={chapter.chapterId}
                                        chapter={chapter}
                                        courseId={courseId}
                                        collapsed={collapsedChapters.has(chapter.chapterId)}
                                        onToggle={() => toggleChapter(chapter.chapterId)}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyLessons />
                        )}
                    </AnimatedBlock>

                    <AnimatedBlock delay={350} className="lg:sticky lg:top-6 lg:self-start">
                        <aside className="rounded-[32px] bg-white/80 p-1 shadow-[0_22px_60px_rgba(15,37,82,0.09)] ring-1 ring-blue-100/80">
                            <div className="rounded-[28px] bg-white p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-680 text-gray-900">Tổng quan hôm nay</p>
                                        <p className="mt-1 text-xs text-gray-subtle">Giữ nhịp học đều trong khóa này</p>
                                    </div>
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-800">
                                        <Sparkles size={21} />
                                    </span>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="flex items-center justify-between rounded-2xl bg-[#F7FAFF] px-4 py-3">
                                        <span className="text-sm text-gray-subtle">Hoàn thành</span>
                                        <span className="text-sm font-680 tabular-nums text-gray-900">
                                            {summary.completedLessons}/{summary.totalLessons}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-2xl bg-[#F7FAFF] px-4 py-3">
                                        <span className="text-sm text-gray-subtle">Còn lại</span>
                                        <span className="text-sm font-680 tabular-nums text-gray-900">
                                            {Math.max(summary.totalLessons - summary.completedLessons, 0)} bài
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-3xl bg-blue-950 p-4 text-white">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/12">
                                            <CheckCircle2 size={18} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-680">Gợi ý học tập</p>
                                            <p className="mt-2 text-xs leading-6 text-white/76">
                                                Hoàn thành từng bài theo thứ tự trong chương để tiến độ được ghi nhận rõ ràng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </AnimatedBlock>
                </section>
            </div>
        </main>
    );
};

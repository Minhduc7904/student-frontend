import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    FileText,
    Home,
    LayoutList,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    PenLine,
    PlayCircle,
    X,
    Youtube,
} from "lucide-react";
import { useLessonDetail, useLearningItemDetail } from "../hooks";
import { learningItemService } from "../../../core/services/modules/learningItemService";
import {
    selectChapters,
    selectCourseDetail,
    selectCourseLessonsError,
    selectCourseLessonsLoading,
} from "../store/courseDetailSlice";
import { ContentLoading } from "../../../shared/components/loading";
import { ROUTES } from "../../../core/constants";
import {
    DocumentContent,
    HomeworkContent,
    VideoContent,
    YoutubeContent,
} from "./components/content-types";

const shellMotion = "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

const ITEM_TYPE_META = {
    VIDEO: {
        label: "Video",
        icon: PlayCircle,
        className: "bg-[#E1F3FE] text-[#1F6C9F]",
    },
    YOUTUBE: {
        label: "YouTube",
        icon: Youtube,
        className: "bg-[#FDEBEC] text-[#9F2F2D]",
    },
    DOCUMENT: {
        label: "Tài liệu",
        icon: FileText,
        className: "bg-[#FBF3DB] text-[#956400]",
    },
    HOMEWORK: {
        label: "Bài tập",
        icon: PenLine,
        className: "bg-[#EDF3EC] text-[#346538]",
    },
};

const getId = (value) => (value == null ? "" : String(value));

const getItemTitle = (item) => (
    item?.title
    || item?.learningItemName
    || item?.name
    || "Mục học tập"
);

const getLessonProgress = (lesson) => {
    const value = Number(lesson?.completionPercentage);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(value)));
};

const getItemMeta = (type) => ITEM_TYPE_META[type] || ITEM_TYPE_META.DOCUMENT;

const flattenLearningItems = (chapters = []) => {
    const rows = [];

    chapters.forEach((chapter, chapterIndex) => {
        (chapter?.lessons || []).forEach((lesson, lessonIndex) => {
            (lesson?.learningItems || []).forEach((learningItem, itemIndex) => {
                rows.push({
                    chapter,
                    chapterIndex,
                    lesson,
                    lessonIndex,
                    learningItem,
                    itemIndex,
                });
            });
        });
    });

    return rows;
};

const findLessonInChapters = (chapters, lessonId) => {
    const targetId = getId(lessonId);

    for (const chapter of chapters || []) {
        const lesson = (chapter?.lessons || []).find((item) => getId(item?.lessonId) === targetId);

        if (lesson) {
            return lesson;
        }
    }

    return null;
};

const LearningItemBody = ({ learningItemDetail, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4 p-4 sm:p-6">
                <div className="h-7 w-48 animate-pulse rounded-md bg-[#EAEAEA]" />
                <div className="aspect-video w-full animate-pulse rounded-xl bg-[#F0F0EE]" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-[#EAEAEA]" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#EAEAEA]" />
            </div>
        );
    }

    switch (learningItemDetail?.type) {
        case "YOUTUBE":
            return <YoutubeContent learningItemDetail={learningItemDetail} />;
        case "VIDEO":
            return <VideoContent learningItemDetail={learningItemDetail} />;
        case "DOCUMENT":
            return <DocumentContent learningItemDetail={learningItemDetail} />;
        case "HOMEWORK":
            return <HomeworkContent learningItemDetail={learningItemDetail} />;
        default:
            return (
                <div className="flex min-h-64 items-center justify-center rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-6 text-center">
                    <div>
                        <AlertCircle className="mx-auto text-[#787774]" size={28} />
                        <p className="mt-3 text-sm font-semibold text-[#2F3437]">Không hỗ trợ loại nội dung này</p>
                        <p className="mt-1 text-xs text-[#787774]">{learningItemDetail?.type || "Chưa có dữ liệu"}</p>
                    </div>
                </div>
            );
    }
};

const LessonOverview = ({ lessonDetail, courseId, lessonId, onOpenItem }) => {
    const learningItems = lessonDetail?.learningItems || [];
    const progress = getLessonProgress(lessonDetail);

    if (!lessonDetail) {
        return (
            <div className="flex min-h-80 items-center justify-center rounded-xl border border-[#EAEAEA] bg-white p-6 text-center">
                <div>
                    <BookOpen className="mx-auto text-[#B8B8B4]" size={34} />
                    <p className="mt-3 text-sm font-semibold text-[#2F3437]">Chọn một bài học ở bên trái</p>
                    <p className="mt-1 text-xs text-[#787774]">Nội dung bài học sẽ hiển thị tại đây.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="rounded-xl border border-[#EAEAEA] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">Bài học</p>
                        <h1 className="mt-2 text-xl font-semibold leading-tight text-[#2F3437] sm:text-2xl">
                            {lessonDetail.title || "Bài học"}
                        </h1>
                        {lessonDetail.teacherName ? (
                            <p className="mt-2 text-sm text-[#787774]">Giảng viên: {lessonDetail.teacherName}</p>
                        ) : null}
                    </div>
                    <div className="w-full shrink-0 sm:w-44">
                        <div className="flex items-center justify-between text-xs text-[#787774]">
                            <span>Tiến độ</span>
                            <span className="font-semibold tabular-nums text-[#2F3437]">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded bg-[#EAEAEA]">
                            <div className="h-full rounded bg-[#2F3437]" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-4">
                    <p className="text-xs text-[#787774]">Mục học tập</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#2F3437]">
                        {lessonDetail.totalLearningItems ?? learningItems.length}
                    </p>
                </div>
                <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-4">
                    <p className="text-xs text-[#787774]">Đã hoàn thành</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#2F3437]">
                        {lessonDetail.completedLearningItems ?? learningItems.filter((item) => item?.isLearned).length}
                    </p>
                </div>
                <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-4">
                    <p className="text-xs text-[#787774]">Chương liên quan</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#2F3437]">
                        {lessonDetail.chapters?.length || 0}
                    </p>
                </div>
            </div>

            <section className="rounded-xl border border-[#EAEAEA] bg-white">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] px-4 py-3">
                    <h2 className="text-sm font-semibold text-[#2F3437]">Nội dung học tập</h2>
                    <span className="text-xs text-[#787774]">{learningItems.length} mục</span>
                </div>

                {learningItems.length ? (
                    <div className="divide-y divide-[#EAEAEA]">
                        {learningItems.map((item, index) => {
                            const meta = getItemMeta(item.type);
                            const Icon = meta.icon;

                            return (
                                <button
                                    type="button"
                                    key={item.learningItemId}
                                    onClick={() => onOpenItem(item)}
                                    className={`group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left ${shellMotion} hover:bg-[#FBFBFA] active:scale-[0.995]`}
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#EAEAEA] bg-[#FBFBFA] text-xs font-semibold tabular-nums text-[#787774]">
                                        {index + 1}
                                    </span>
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.className}`}>
                                        <Icon size={16} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-[#2F3437]">
                                            {getItemTitle(item)}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-[#787774]">{meta.label}</span>
                                    </span>
                                    {item.isLearned ? (
                                        <CheckCircle2 size={18} className="shrink-0 text-[#346538]" />
                                    ) : (
                                        <ArrowRight size={17} className="shrink-0 text-[#B8B8B4] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2F3437]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-sm text-[#787774]">
                        Bài học này chưa có mục học tập.
                    </div>
                )}
            </section>
        </div>
    );
};

const LessonNotFound = ({ courseId }) => (
    <div className="flex min-h-80 items-center justify-center p-6 text-center">
        <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#EAEAEA] bg-white">
                <AlertCircle size={26} className="text-[#787774]" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-[#2F3437]">Không tìm thấy bài học</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#787774]">
                Bài học không tồn tại hoặc đã bị xóa khỏi khóa học.
            </p>
            <Link
                to={ROUTES.COURSE_DETAIL(courseId)}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#2F3437] px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
                <ArrowLeft size={16} />
                Quay về khóa học
            </Link>
        </div>
    </div>
);

const SidebarLessonItem = ({
    lesson,
    courseId,
    currentLessonId,
    currentLearningItemId,
    learnedItemIds,
    index,
    onNavigate,
}) => {
    const containsCurrentLearningItem = currentLearningItemId && lesson.learningItems?.some(
        (item) => getId(item.learningItemId) === getId(currentLearningItemId)
    );
    const isActiveLesson = getId(currentLessonId) === getId(lesson.lessonId);
    const [isExpanded, setIsExpanded] = useState(isActiveLesson || containsCurrentLearningItem);
    const hasItems = Boolean(lesson.learningItems?.length);
    const progress = getLessonProgress(lesson);

    useEffect(() => {
        if (isActiveLesson || containsCurrentLearningItem) {
            setIsExpanded(true);
        }
    }, [isActiveLesson, containsCurrentLearningItem]);

    const handleLessonClick = () => {
        onNavigate(ROUTES.COURSE_LESSON(courseId, lesson.lessonId));
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleLessonClick}
                className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left ${shellMotion} ${
                    isActiveLesson && !currentLearningItemId
                        ? "bg-[#2F3437] text-white"
                        : "text-[#2F3437] hover:bg-[#F7F6F3]"
                }`}
            >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold tabular-nums ${
                    progress >= 100
                        ? "bg-[#EDF3EC] text-[#346538]"
                        : isActiveLesson && !currentLearningItemId
                            ? "bg-white/15 text-white"
                            : "bg-white text-[#787774] ring-1 ring-[#EAEAEA]"
                }`}>
                    {progress >= 100 ? <Check size={13} /> : index}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold">{lesson.title || "Bài học"}</span>
                    <span className={`mt-0.5 block text-[10px] ${
                        isActiveLesson && !currentLearningItemId ? "text-white/65" : "text-[#787774]"
                    }`}>
                        {lesson.learningItems?.length || 0} mục · {progress}%
                    </span>
                </span>
                {hasItems ? (
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsExpanded((value) => !value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                setIsExpanded((value) => !value);
                            }
                        }}
                        className="rounded-md p-1"
                        aria-label={isExpanded ? "Thu gọn bài học" : "Mở rộng bài học"}
                    >
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                    </span>
                ) : null}
            </button>

            {hasItems ? (
                <div className={`grid ${shellMotion} ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                        <div className="ml-3 mt-1 space-y-1 border-l border-[#EAEAEA] pl-2">
                            {lesson.learningItems.map((item) => {
                                const meta = getItemMeta(item.type);
                                const Icon = meta.icon;
                                const isActiveItem = getId(currentLearningItemId) === getId(item.learningItemId);
                                const isItemLearned = item.isLearned || learnedItemIds?.has(getId(item.learningItemId));

                                return (
                                    <button
                                        type="button"
                                        key={item.learningItemId}
                                        onClick={() => onNavigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lesson.lessonId, item.learningItemId))}
                                        className={`group flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left ${shellMotion} ${
                                            isActiveItem
                                                ? "bg-[#111111] text-white"
                                                : "text-[#2F3437] hover:bg-[#FBFBFA]"
                                        }`}
                                    >
                                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                                            isActiveItem ? "bg-white/15 text-white" : meta.className
                                        }`}>
                                            <Icon size={13} />
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-[12px] font-medium">
                                            {getItemTitle(item)}
                                        </span>
                                        {isItemLearned ? (
                                            <CheckCircle2 size={13} className={isActiveItem ? "text-white" : "text-[#346538]"} />
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const CourseSidebar = ({
    chapters,
    chaptersLoading,
    chaptersError,
    courseId,
    courseDetail,
    currentLessonId,
    currentLearningItemId,
    learnedItemIds,
    onNavigate,
}) => (
    <aside className="flex h-full min-h-0 flex-col bg-[#FBFBFA]">
        <div className="border-b border-[#EAEAEA] p-3">
            <Link
                to={ROUTES.COURSE_DETAIL(courseId)}
                className={`inline-flex max-w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-[#787774] hover:bg-white hover:text-[#2F3437] ${shellMotion}`}
            >
                <ChevronLeft size={15} />
                <span className="truncate">Quay về khóa học</span>
            </Link>
            <h2 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-[#2F3437]">
                {courseDetail?.title || "Khóa học"}
            </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 custom-scrollbar">
            {chaptersLoading ? (
                <div className="space-y-2">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="h-12 animate-pulse rounded-lg bg-[#EAEAEA]" />
                    ))}
                </div>
            ) : chaptersError ? (
                <div className="rounded-lg border border-[#FDEBEC] bg-[#FDEBEC] p-3 text-xs leading-5 text-[#9F2F2D]">
                    {chaptersError}
                </div>
            ) : chapters?.length ? (
                <div className="space-y-4">
                    {chapters.map((chapter, chapterIndex) => (
                        <section key={chapter.chapterId}>
                            <div className="mb-2 flex items-center justify-between gap-2 px-1">
                                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
                                    {chapter.name || `Chương ${chapterIndex + 1}`}
                                </p>
                                <span className="shrink-0 text-[10px] tabular-nums text-[#787774]">
                                    {chapter.lessons?.length || 0}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {(chapter.lessons || []).map((lesson, lessonIndex) => (
                                    <SidebarLessonItem
                                        key={lesson.lessonId}
                                        lesson={lesson}
                                        courseId={courseId}
                                        currentLessonId={currentLessonId}
                                        currentLearningItemId={currentLearningItemId}
                                        learnedItemIds={learnedItemIds}
                                        index={lessonIndex + 1}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-[#EAEAEA] bg-white p-4 text-center text-xs text-[#787774]">
                    Chưa có bài học.
                </div>
            )}
        </div>
    </aside>
);

export const CourseLessonsPage = () => {
    const { lessonId, courseId, learningItemId } = useParams();
    const navigate = useNavigate();
    const { lessonDetail, loading: lessonLoading, error: lessonError } = useLessonDetail();
    const { learningItemDetail, loading: learningItemLoading, error: learningItemError } = useLearningItemDetail();
    const courseDetail = useSelector(selectCourseDetail);
    const chapters = useSelector(selectChapters);
    const chaptersLoading = useSelector(selectCourseLessonsLoading);
    const chaptersError = useSelector(selectCourseLessonsError);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRailCollapsed, setIsRailCollapsed] = useState(false);
    const [locallyLearnedItems, setLocallyLearnedItems] = useState(() => new Set());
    const [markLearnedLoading, setMarkLearnedLoading] = useState(false);
    const [markLearnedError, setMarkLearnedError] = useState("");

    const flatItems = useMemo(() => flattenLearningItems(chapters), [chapters]);
    const listLesson = useMemo(() => findLessonInChapters(chapters, lessonId), [chapters, lessonId]);
    const activeLesson = lessonDetail || listLesson;
    const activeItemIndex = useMemo(
        () => flatItems.findIndex((row) => getId(row.learningItem?.learningItemId) === getId(learningItemId)),
        [flatItems, learningItemId]
    );
    const currentNavRow = activeItemIndex >= 0 ? flatItems[activeItemIndex] : null;
    const firstItemInLesson = useMemo(() => {
        if (!lessonId) {
            return null;
        }

        const sidebarRow = flatItems.find((row) => getId(row.lesson?.lessonId) === getId(lessonId));

        if (sidebarRow) {
            return sidebarRow;
        }

        const firstLessonItem = activeLesson?.learningItems?.[0];

        return firstLessonItem ? { lesson: activeLesson, learningItem: firstLessonItem } : null;
    }, [activeLesson, flatItems, lessonId]);
    const fallbackActiveItemIndex = learningItemId && activeLesson?.learningItems?.length
        ? activeLesson.learningItems.findIndex((item) => getId(item.learningItemId) === getId(learningItemId))
        : -1;
    const previousRow = activeItemIndex > 0
        ? flatItems[activeItemIndex - 1]
        : fallbackActiveItemIndex > 0
            ? { lesson: activeLesson, learningItem: activeLesson.learningItems[fallbackActiveItemIndex - 1] }
            : null;
    const nextRow = activeItemIndex >= 0
        ? flatItems[activeItemIndex + 1]
        : fallbackActiveItemIndex >= 0
            ? (
                activeLesson?.learningItems?.[fallbackActiveItemIndex + 1]
                    ? { lesson: activeLesson, learningItem: activeLesson.learningItems[fallbackActiveItemIndex + 1] }
                    : null
            )
            : firstItemInLesson;
    const totalItemsInLesson = activeLesson?.learningItems?.length || listLesson?.learningItems?.length || 0;
    const activePositionInLesson = learningItemId && activeLesson?.learningItems?.length
        ? activeLesson.learningItems.findIndex((item) => getId(item.learningItemId) === getId(learningItemId)) + 1
        : 0;
    const currentItemId = getId(learningItemId);
    const isCurrentItemLearned = Boolean(
        currentItemId
        && (
            locallyLearnedItems.has(currentItemId)
            || learningItemDetail?.isLearned
            || currentNavRow?.learningItem?.isLearned
        )
    );
    const currentTypeMeta = getItemMeta(learningItemDetail?.type || currentNavRow?.learningItem?.type);
    const CurrentTypeIcon = currentTypeMeta.icon;

    const goToRow = useCallback((row) => {
        if (!row) {
            return;
        }

        navigate(ROUTES.COURSE_LEARNING_ITEM(courseId, row.lesson.lessonId, row.learningItem.learningItemId));
        setIsSidebarOpen(false);
    }, [courseId, navigate]);

    const handleNavigate = useCallback((path) => {
        navigate(path);
        setIsSidebarOpen(false);
    }, [navigate]);

    const handleMarkLearned = async () => {
        if (!currentItemId || markLearnedLoading || isCurrentItemLearned) {
            return;
        }

        setMarkLearnedLoading(true);
        setMarkLearnedError("");

        try {
            const response = await learningItemService.markLearned(currentItemId);
            const learnedRecord = response?.data?.data || response?.data || response;
            const learnedItemId = getId(learnedRecord?.learningItemId || currentItemId);

            setLocallyLearnedItems((current) => {
                const next = new Set(current);
                next.add(learnedItemId);
                return next;
            });
        } catch (error) {
            setMarkLearnedError(error?.message || "Không thể đánh dấu đã học. Vui lòng thử lại.");
        } finally {
            setMarkLearnedLoading(false);
        }
    };

    useEffect(() => {
        setMarkLearnedError("");
    }, [currentItemId]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    const showLearningItem = Boolean(learningItemId);
    const hasLearningItemError = learningItemError || (!learningItemLoading && showLearningItem && !learningItemDetail);
    const hasLessonError = lessonId && (lessonError || (!lessonLoading && !activeLesson));

    return (
        <main
            className="flex h-dvh min-h-[560px] w-full overflow-hidden bg-[#F7F6F3] text-[#2F3437]"
            style={{ fontFamily: '"SF Pro Display", "Geist Sans", "Helvetica Neue", system-ui, sans-serif' }}
        >
            <div className={`hidden shrink-0 border-r border-[#EAEAEA] bg-[#FBFBFA] md:block ${shellMotion} ${isRailCollapsed ? "w-0 overflow-hidden" : "w-[320px] lg:w-[348px]"}`}>
                <CourseSidebar
                    chapters={chapters}
                    chaptersLoading={chaptersLoading}
                    chaptersError={chaptersError}
                    courseId={courseId}
                    courseDetail={courseDetail}
                    currentLessonId={lessonId}
                    currentLearningItemId={learningItemId}
                    learnedItemIds={locallyLearnedItems}
                    onNavigate={handleNavigate}
                />
            </div>

            {isSidebarOpen ? (
                <div className="fixed inset-0 z-40 bg-black/25 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            ) : null}

            <div className={`fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[360px] border-r border-[#EAEAEA] bg-[#FBFBFA] md:hidden ${shellMotion} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-12 items-center justify-between border-b border-[#EAEAEA] px-3">
                    <span className="text-xs font-semibold text-[#787774]">Lộ trình học</span>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[#787774] hover:bg-white hover:text-[#2F3437]"
                        aria-label="Đóng danh sách bài học"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="h-[calc(100%-48px)]">
                    <CourseSidebar
                        chapters={chapters}
                        chaptersLoading={chaptersLoading}
                        chaptersError={chaptersError}
                        courseId={courseId}
                        courseDetail={courseDetail}
                        currentLessonId={lessonId}
                        currentLearningItemId={learningItemId}
                        learnedItemIds={locallyLearnedItems}
                        onNavigate={handleNavigate}
                    />
                </div>
            </div>

            <section className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#EAEAEA] bg-white/92 px-3 sm:px-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#EAEAEA] bg-white text-[#2F3437] md:hidden"
                            aria-label="Mở danh sách bài học"
                        >
                            <Menu size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRailCollapsed((value) => !value)}
                            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#EAEAEA] bg-white text-[#787774] hover:text-[#2F3437] md:flex"
                            aria-label={isRailCollapsed ? "Mở cột bài học" : "Thu gọn cột bài học"}
                        >
                            {isRailCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>
                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">
                                {showLearningItem ? `Mục ${activePositionInLesson || "-"}/${totalItemsInLesson || "-"}` : "Tổng quan bài học"}
                            </p>
                            <h1 className="truncate text-sm font-semibold text-[#2F3437] sm:text-base">
                                {showLearningItem ? getItemTitle(learningItemDetail || currentNavRow?.learningItem) : activeLesson?.title || "Bài học"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        {showLearningItem ? (
                            <span className={`hidden items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold sm:inline-flex ${currentTypeMeta.className}`}>
                                <CurrentTypeIcon size={14} />
                                {currentTypeMeta.label}
                            </span>
                        ) : null}
                        <Link
                            to={ROUTES.DASHBOARD}
                            className="hidden h-9 items-center gap-2 rounded-md border border-[#EAEAEA] bg-white px-3 text-xs font-semibold text-[#787774] hover:text-[#2F3437] sm:inline-flex"
                        >
                            <Home size={15} />
                            Trang chủ
                        </Link>
                    </div>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mx-auto w-full max-w-5xl p-3 sm:p-5 lg:p-6">
                        {showLearningItem ? (
                            hasLearningItemError ? (
                                <LessonNotFound courseId={courseId} />
                            ) : (
                                <article className="rounded-xl border border-[#EAEAEA] bg-white p-3 sm:p-5">
                                    <LearningItemBody
                                        learningItemDetail={learningItemDetail}
                                        loading={learningItemLoading}
                                    />
                                </article>
                            )
                        ) : lessonLoading ? (
                            <ContentLoading message="Đang tải nội dung bài học..." height="h-full" />
                        ) : hasLessonError ? (
                            <LessonNotFound courseId={courseId} />
                        ) : (
                            <LessonOverview
                                lessonDetail={activeLesson}
                                courseId={courseId}
                                lessonId={lessonId}
                                onOpenItem={(item) => handleNavigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, item.learningItemId))}
                            />
                        )}
                    </div>
                </div>

                <footer className="shrink-0 border-t border-[#EAEAEA] bg-white px-3 py-2 sm:px-4">
                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-[#787774]">
                            <div className="flex min-w-0 items-center gap-2">
                                <LayoutList size={16} className="shrink-0" />
                                <span className="truncate">
                                    {showLearningItem
                                        ? getItemTitle(learningItemDetail || currentNavRow?.learningItem)
                                        : "Chọn một mục học tập để bắt đầu"}
                                </span>
                            </div>
                            {markLearnedError ? (
                                <span className="truncate text-[11px] font-medium text-[#9F2F2D]" role="status">
                                    {markLearnedError}
                                </span>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end">
                            <button
                                type="button"
                                onClick={() => goToRow(previousRow)}
                                disabled={!previousRow}
                                className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#EAEAEA] bg-white px-3 text-xs font-semibold text-[#2F3437] disabled:cursor-not-allowed disabled:opacity-40 ${shellMotion} active:scale-[0.98]`}
                            >
                                <ArrowLeft size={15} />
                                Trước
                            </button>
                            <button
                                type="button"
                                onClick={handleMarkLearned}
                                disabled={!showLearningItem || learningItemLoading || markLearnedLoading || isCurrentItemLearned}
                                className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold ${shellMotion} active:scale-[0.98] ${
                                    isCurrentItemLearned
                                        ? "border border-[#EDF3EC] bg-[#EDF3EC] text-[#346538]"
                                        : "border border-[#2F3437] bg-[#2F3437] text-white disabled:cursor-not-allowed disabled:border-[#EAEAEA] disabled:bg-[#F7F6F3] disabled:text-[#B8B8B4]"
                                }`}
                            >
                                {isCurrentItemLearned ? <CheckCircle2 size={15} /> : <Check size={15} />}
                                {markLearnedLoading ? "Đang lưu" : isCurrentItemLearned ? "Đã học" : "Đánh dấu"}
                            </button>
                            <button
                                type="button"
                                onClick={() => goToRow(nextRow)}
                                disabled={!nextRow}
                                className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#2F3437] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 ${shellMotion} active:scale-[0.98]`}
                            >
                                Tiếp
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                </footer>
            </section>
        </main>
    );
};

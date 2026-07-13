import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, X } from "lucide-react";
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
    CourseSidebar,
    LearningItemBody,
    LessonLearningFooter,
    LessonLearningHeader,
    LessonOverview,
} from "./components";
import {
    applyLearnedStateToChapters,
    applyLearnedStateToLesson,
    findLessonInChapters,
    flattenLearningItems,
    getId,
    getItemMeta,
    getItemTitle,
    shellMotion,
} from "./components/learningPageUtils";

const LessonNotFound = ({ courseId }) => (
    <div className="flex min-h-80 items-center justify-center p-6 text-center">
        <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-white">
                <AlertCircle size={26} className="text-blue-700" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-blue-950">Không tìm thấy bài học</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                Bài học không tồn tại hoặc đã bị xóa khỏi khóa học.
            </p>
            <Link
                to={ROUTES.COURSE_DETAIL(courseId)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98]"
            >
                Quay về khóa học
            </Link>
        </div>
    </div>
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

    const viewChapters = useMemo(
        () => applyLearnedStateToChapters(chapters, locallyLearnedItems),
        [chapters, locallyLearnedItems]
    );
    const flatItems = useMemo(() => flattenLearningItems(viewChapters), [viewChapters]);
    const listLesson = useMemo(() => findLessonInChapters(viewChapters, lessonId), [viewChapters, lessonId]);
    const activeLesson = useMemo(
        () => applyLearnedStateToLesson(lessonDetail || listLesson, locallyLearnedItems),
        [lessonDetail, listLesson, locallyLearnedItems]
    );
    const activeItemIndex = useMemo(
        () => flatItems.findIndex((row) => getId(row.learningItem?.learningItemId) === getId(learningItemId)),
        [flatItems, learningItemId]
    );
    const currentNavRow = activeItemIndex >= 0 ? flatItems[activeItemIndex] : null;
    const currentNavItem = currentNavRow?.learningItem;

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
    const localLearningItemDetail = useMemo(() => {
        if (!learningItemDetail || !currentItemId || !locallyLearnedItems.has(currentItemId) || learningItemDetail.isLearned) {
            return learningItemDetail;
        }

        return {
            ...learningItemDetail,
            isLearned: true,
        };
    }, [currentItemId, learningItemDetail, locallyLearnedItems]);
    const isCurrentItemLearned = Boolean(
        currentItemId
        && (
            locallyLearnedItems.has(currentItemId)
            || localLearningItemDetail?.isLearned
            || currentNavItem?.isLearned
        )
    );
    const currentTypeMeta = getItemMeta(localLearningItemDetail?.type || currentNavItem?.type);

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
        <main className="flex h-dvh min-h-[560px] w-full overflow-hidden bg-blue-50 text-blue-950">
            <div className={`hidden shrink-0 border-r border-blue-100 bg-blue-50/70 md:block ${shellMotion} ${isRailCollapsed ? "w-0 overflow-hidden" : "w-[320px] lg:w-[348px]"}`}>
                <CourseSidebar
                    chapters={viewChapters}
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
                <div className="fixed inset-0 z-40 bg-blue-950/35 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            ) : null}

            <div className={`fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[360px] border-r border-blue-100 bg-blue-50 md:hidden ${shellMotion} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-14 items-center justify-between border-b border-blue-100 bg-white px-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Lộ trình học</span>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-blue-700 hover:bg-blue-50"
                        aria-label="Đóng danh sách bài học"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="h-[calc(100%-56px)]">
                    <CourseSidebar
                        chapters={viewChapters}
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
                <LessonLearningHeader
                    showLearningItem={showLearningItem}
                    activePositionInLesson={activePositionInLesson}
                    totalItemsInLesson={totalItemsInLesson}
                    learningItemDetail={localLearningItemDetail}
                    currentNavItem={currentNavItem}
                    activeLesson={activeLesson}
                    currentTypeMeta={currentTypeMeta}
                    isRailCollapsed={isRailCollapsed}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    onToggleRail={() => setIsRailCollapsed((value) => !value)}
                />

                <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mx-auto w-full max-w-5xl p-3 sm:p-5 lg:p-6">
                        {showLearningItem ? (
                            hasLearningItemError ? (
                                <LessonNotFound courseId={courseId} />
                            ) : (
                                <article className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-5">
                                    <LearningItemBody
                                        learningItemDetail={localLearningItemDetail}
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
                                onOpenItem={(item) => handleNavigate(ROUTES.COURSE_LEARNING_ITEM(courseId, lessonId, item.learningItemId))}
                            />
                        )}
                    </div>
                </div>

                <LessonLearningFooter
                    showLearningItem={showLearningItem}
                    learningItemLoading={learningItemLoading}
                    learningItemDetail={localLearningItemDetail}
                    currentNavItem={currentNavItem}
                    previousRow={previousRow}
                    nextRow={nextRow}
                    markLearnedLoading={markLearnedLoading}
                    markLearnedError={markLearnedError}
                    isCurrentItemLearned={isCurrentItemLearned}
                    onPrevious={() => goToRow(previousRow)}
                    onNext={() => goToRow(nextRow)}
                    onMarkLearned={handleMarkLearned}
                />
            </section>
        </main>
    );
};

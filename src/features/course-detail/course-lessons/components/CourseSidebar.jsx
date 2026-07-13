import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "../../../../core/constants";
import { SidebarLessonItem } from "./SidebarLessonItem";
import { shellMotion } from "./learningPageUtils";

export const CourseSidebar = ({
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
    <aside className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-blue-100 p-3">
            <Link
                to={ROUTES.COURSE_DETAIL(courseId)}
                className={`inline-flex max-w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-blue-700 hover:bg-white hover:text-blue-950 ${shellMotion}`}
            >
                <ChevronLeft size={15} />
                <span className="truncate">Quay về khóa học</span>
            </Link>
            <div className="mt-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
                <p className="text-xs font-semibold uppercase text-blue-700">Lộ trình học</p>
                <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-blue-950">
                    {courseDetail?.title || "Khóa học"}
                </h2>
            </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 custom-scrollbar">
            {chaptersLoading ? (
                <div className="space-y-2">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="h-14 animate-pulse rounded-2xl bg-blue-100" />
                    ))}
                </div>
            ) : chaptersError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-xs leading-5 text-red-700">
                    {chaptersError}
                </div>
            ) : chapters?.length ? (
                <div className="space-y-4">
                    {chapters.map((chapter, chapterIndex) => (
                        <section key={chapter.chapterId}>
                            <div className="mb-2 flex items-center justify-between gap-2 px-1">
                                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-blue-700">
                                    {chapter.name || `Chương ${chapterIndex + 1}`}
                                </p>
                                <span className="shrink-0 rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold tabular-nums text-blue-700">
                                    {chapter.lessons?.length || 0}
                                </span>
                            </div>
                            <div className="space-y-1.5">
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
                <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center text-xs text-gray-600">
                    Chưa có bài học.
                </div>
            )}
        </div>
    </aside>
);

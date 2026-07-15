import { useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronDown, LockKeyhole, Play } from "lucide-react";
import {
    clampProgress,
    getLearningItemMeta,
    getLearningItemPreview,
    getLessonLearningItemCount,
} from "./courseDetailUtils";

const Collapse = ({ open, children }) => (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
);

const LearningItemPreview = ({ item, lesson, courseImage, onOpenItem, previewOnly }) => {
    const meta = getLearningItemMeta(item?.type);
    const Icon = meta.Icon;
    const previewUrl = getLearningItemPreview(item) || courseImage;

    return (
        <div
            className={`group flex w-full items-stretch overflow-hidden rounded-xl border border-blue-100 bg-white text-left transition ${previewOnly ? "" : "cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 active:scale-[0.995]"}`}
            {...(!previewOnly ? { role: "button", tabIndex: 0, onClick: () => onOpenItem(lesson, item), onKeyDown: (event) => { if (event.key === "Enter" || event.key === " ") onOpenItem(lesson, item); } } : {})}
        >
            <div className="relative h-20 w-28 shrink-0 bg-blue-50 sm:h-24 sm:w-36">
                <img src={previewUrl} alt={`Ảnh xem trước ${item?.title || "nội dung học"}`} className="h-full w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-blue-950/35 text-white">
                    {previewOnly ? <LockKeyhole size={18} /> : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 text-white shadow-sm">
                            <Play size={16} fill="currentColor" className="ml-0.5" />
                        </span>
                    )}
                </span>
            </div>
            <div className="min-w-0 flex-1 p-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${meta.className}`}>
                        <Icon size={13} />
                        {meta.label}
                    </span>
                    <span className={`text-[11px] font-semibold ${previewOnly ? "text-gray-500" : "text-blue-800"}`}>
                        {previewOnly ? "Chỉ xem trước" : "Bấm vào học ngay"}
                    </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-bold leading-5 text-blue-950 group-hover:text-blue-800">
                    {item?.title || "Nội dung học tập"}
                </p>
                {item?.description ? (
                    <p className="mt-1 line-clamp-1 text-xs leading-5 text-gray-600">{item.description}</p>
                ) : null}
            </div>
        </div>
    );
};

const LessonPreview = ({ lesson, lessonIndex, courseImage, onOpenItem, previewOnly }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const learningItems = lesson?.learningItems || [];
    const progress = clampProgress(lesson?.completionPercentage);

    return (
        <article className="overflow-hidden rounded-xl border border-blue-100 bg-white">
            <div className="flex items-center gap-3 p-3 sm:p-4">
                <button
                    type="button"
                    onClick={() => setIsExpanded((value) => !value)}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40"
                    aria-expanded={isExpanded}
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold tabular-nums text-blue-800">
                        {String(lessonIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block line-clamp-2 text-sm font-bold leading-5 text-blue-950">{lesson?.title || "Buổi học"}</span>
                        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                            <span>{getLessonLearningItemCount(lesson)} nội dung</span>
                            <span>{progress}% hoàn thành</span>
                        </span>
                    </span>
                </button>
                <ChevronDown size={19} className={`shrink-0 text-blue-800 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </div>

            <Collapse open={isExpanded}>
                <div className="border-t border-blue-100 bg-blue-50/60 p-3 sm:p-4">
                    {learningItems.length ? (
                        <div className="space-y-2.5">
                            {learningItems.map((item) => (
                                <LearningItemPreview
                                    key={item.learningItemId}
                                    item={item}
                                    lesson={lesson}
                                    courseImage={courseImage}
                                    onOpenItem={onOpenItem}
                                    previewOnly={previewOnly}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-blue-200 bg-white px-3 py-4 text-sm leading-6 text-gray-600">
                            Nội dung của buổi học đang được cập nhật.
                        </p>
                    )}
                </div>
            </Collapse>
        </article>
    );
};

export const CourseLearningProgram = ({
    chapters,
    loading,
    error,
    courseImage,
    onOpenItem,
    previewOnly = false,
}) => {
    const [openChapterIds, setOpenChapterIds] = useState(() => new Set());
    const initializedChapterKey = useRef("");
    const chapterKey = (chapters || []).map((chapter) => chapter.chapterId).join("|");

    useEffect(() => {
        if (!chapterKey || initializedChapterKey.current === chapterKey) {
            return;
        }

        initializedChapterKey.current = chapterKey;
        setOpenChapterIds(new Set(chapters.map((chapter) => chapter.chapterId)));
    }, [chapterKey, chapters]);

    const toggleChapter = (chapterId) => {
        setOpenChapterIds((current) => {
            const next = new Set(current);
            if (next.has(chapterId)) next.delete(chapterId);
            else next.add(chapterId);
            return next;
        });
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-blue-100" />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <span>{error}</span>
            </div>
        );
    }

    if (!chapters?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-12 text-center text-sm leading-6 text-gray-600">
                Lộ trình của khóa học đang được cập nhật.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {chapters.map((chapter, chapterIndex) => {
                const isOpen = openChapterIds.has(chapter.chapterId);
                const lessons = chapter.lessons || [];
                const progress = clampProgress(chapter.completionPercentage);

                return (
                    <section key={chapter.chapterId} className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                        <button
                            type="button"
                            onClick={() => toggleChapter(chapter.chapterId)}
                            className="flex w-full cursor-pointer items-center gap-3 p-4 text-left transition hover:bg-blue-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800/40 sm:p-5"
                            aria-expanded={isOpen}
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-sm font-bold text-white">
                                {String(chapterIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs font-bold uppercase tracking-wide text-blue-700">Chương {chapterIndex + 1}</span>
                                <span className="mt-1 block line-clamp-2 text-base font-bold text-blue-950">{chapter.name || "Chương học"}</span>
                                <span className="mt-1 block text-xs text-gray-600">{lessons.length} buổi học · {progress}% hoàn thành</span>
                            </span>
                            <ChevronDown size={20} className={`shrink-0 text-blue-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        <Collapse open={isOpen}>
                            <div className="space-y-2 border-t border-blue-100 bg-blue-50/50 p-3 sm:p-4">
                                {lessons.map((lesson, lessonIndex) => (
                                    <LessonPreview
                                        key={lesson.lessonId}
                                        lesson={lesson}
                                        lessonIndex={lessonIndex}
                                        courseImage={courseImage}
                                        onOpenItem={onOpenItem}
                                        previewOnly={previewOnly}
                                    />
                                ))}
                            </div>
                        </Collapse>
                    </section>
                );
            })}
        </div>
    );
};

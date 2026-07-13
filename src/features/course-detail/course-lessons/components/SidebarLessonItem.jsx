import { useEffect, useState } from "react";
import {
    Check,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";
import { ROUTES } from "../../../../core/constants";
import {
    getId,
    getItemMeta,
    getItemTitle,
    getLessonProgress,
    shellMotion,
} from "./learningPageUtils";

export const SidebarLessonItem = ({
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
        <div className="rounded-2xl">
            <button
                type="button"
                onClick={handleLessonClick}
                className={`group flex w-full cursor-pointer items-center gap-2 rounded-2xl border px-2.5 py-2.5 text-left ${shellMotion} ${
                    isActiveLesson && !currentLearningItemId
                        ? "border-blue-800 bg-blue-800 text-white shadow-sm"
                        : "border-blue-100 bg-white text-blue-950 hover:border-blue-200 hover:bg-blue-50"
                }`}
            >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold tabular-nums ${
                    progress >= 100
                        ? "bg-green-100 text-green-700"
                        : isActiveLesson && !currentLearningItemId
                            ? "bg-white/15 text-white"
                            : "bg-blue-50 text-blue-800"
                }`}>
                    {progress >= 100 ? <Check size={14} /> : index}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold">{lesson.title || "Bài học"}</span>
                    <span className={`mt-0.5 block text-[11px] ${
                        isActiveLesson && !currentLearningItemId ? "text-white/75" : "text-gray-500"
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
                        className="rounded-lg p-1"
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
                        <div className="ml-4 mt-1.5 space-y-1 border-l border-blue-100 pl-2">
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
                                        className={`group flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-left ${shellMotion} ${
                                            isActiveItem
                                                ? "bg-yellow-500 text-blue-950 shadow-sm"
                                                : "text-blue-950 hover:bg-blue-50"
                                        }`}
                                    >
                                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                                            isActiveItem ? "border-yellow-100 bg-white/70 text-blue-950" : meta.className
                                        }`}>
                                            <Icon size={14} />
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                                            {getItemTitle(item)}
                                        </span>
                                        {isItemLearned ? (
                                            <CheckCircle2 size={14} className={isActiveItem ? "text-blue-950" : "text-green-600"} />
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

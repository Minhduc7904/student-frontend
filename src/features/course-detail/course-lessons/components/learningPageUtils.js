import {
    FileText,
    PenLine,
    PlayCircle,
    Youtube,
} from "lucide-react";

export const shellMotion = "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

export const ITEM_TYPE_META = {
    VIDEO: {
        label: "Video",
        icon: PlayCircle,
        className: "bg-blue-50 text-blue-800 border-blue-100",
    },
    YOUTUBE: {
        label: "YouTube",
        icon: Youtube,
        className: "bg-red-50 text-red-600 border-red-100",
    },
    DOCUMENT: {
        label: "Tài liệu",
        icon: FileText,
        className: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    HOMEWORK: {
        label: "Bài tập",
        icon: PenLine,
        className: "bg-green-50 text-green-700 border-green-100",
    },
};

export const getId = (value) => (value == null ? "" : String(value));

export const getItemTitle = (item) => (
    item?.title
    || item?.learningItemName
    || item?.name
    || "Mục học tập"
);

export const getLessonProgress = (lesson) => {
    const value = Number(lesson?.completionPercentage);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(value)));
};

export const getItemMeta = (type) => ITEM_TYPE_META[type] || ITEM_TYPE_META.DOCUMENT;

const hasLearnedIds = (learnedItemIds) => learnedItemIds instanceof Set && learnedItemIds.size > 0;

export const applyLearnedStateToLesson = (lesson, learnedItemIds) => {
    if (!lesson || !hasLearnedIds(learnedItemIds)) {
        return lesson;
    }

    const learningItems = lesson.learningItems || [];
    let hasLocalChange = false;

    const nextLearningItems = learningItems.map((item) => {
        const shouldBeLearned = learnedItemIds.has(getId(item?.learningItemId));

        if (!shouldBeLearned || item?.isLearned) {
            return item;
        }

        hasLocalChange = true;
        return {
            ...item,
            isLearned: true,
        };
    });

    if (!hasLocalChange) {
        return lesson;
    }

    const totalLearningItems = Number.isFinite(Number(lesson.totalLearningItems))
        ? Number(lesson.totalLearningItems)
        : nextLearningItems.length;
    const learnedCount = nextLearningItems.filter((item) => item?.isLearned).length;
    const completedLearningItems = Math.max(Number(lesson.completedLearningItems) || 0, learnedCount);
    const localCompletionPercentage = totalLearningItems > 0
        ? Math.round((completedLearningItems / totalLearningItems) * 100)
        : getLessonProgress(lesson);

    return {
        ...lesson,
        learningItems: nextLearningItems,
        totalLearningItems,
        completedLearningItems,
        completionPercentage: Math.max(getLessonProgress(lesson), localCompletionPercentage),
    };
};

export const applyLearnedStateToChapters = (chapters = [], learnedItemIds) => {
    if (!hasLearnedIds(learnedItemIds)) {
        return chapters;
    }

    return chapters.map((chapter) => {
        let hasLocalChange = false;

        const lessons = (chapter?.lessons || []).map((lesson) => {
            const nextLesson = applyLearnedStateToLesson(lesson, learnedItemIds);

            if (nextLesson !== lesson) {
                hasLocalChange = true;
            }

            return nextLesson;
        });

        if (!hasLocalChange) {
            return chapter;
        }

        const localCompletionPercentage = lessons.length
            ? Math.round(lessons.reduce((total, lesson) => total + getLessonProgress(lesson), 0) / lessons.length)
            : getLessonProgress(chapter);

        return {
            ...chapter,
            lessons,
            completionPercentage: Math.max(getLessonProgress(chapter), localCompletionPercentage),
        };
    });
};

export const flattenLearningItems = (chapters = []) => {
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

export const findLessonInChapters = (chapters, lessonId) => {
    const targetId = getId(lessonId);

    for (const chapter of chapters || []) {
        const lesson = (chapter?.lessons || []).find((item) => getId(item?.lessonId) === targetId);

        if (lesson) {
            return lesson;
        }
    }

    return null;
};

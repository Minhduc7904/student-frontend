export const getLessonProgress = (lesson) => {
    const progress = Number(lesson?.completionPercentage);
    return Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0;
};

export const getLessonTitle = (lesson) => lesson?.title || lesson?.lessonTitle || "Bài học đang cập nhật";

export const getLessonCourseName = (lesson) => lesson?.courseName || lesson?.course?.title || "Khóa học đang cập nhật";

export const getLessonItemCounts = (lesson) => ({
    total: Number(lesson?.totalLearningItems ?? lesson?.learningItems?.length ?? 0),
    completed: Number(lesson?.completedLearningItems ?? lesson?.learningItems?.filter((item) => item?.isLearned).length ?? 0),
});

import {
    ClipboardList,
    FileText,
    PlayCircle,
    Sparkles,
    Video,
} from "lucide-react";
import MathCourseImage from "../../../assets/images/MathCourseImage.jpg";
import EnglishCourseImage from "../../../assets/images/EnglishCourseImage.png";
import PhysicCourseImage from "../../../assets/images/PhysicCourseImage.png";
import { SUBJECT_IDS } from "../../../core/constants/subject";

const getUrl = (value) => (typeof value === "string" ? value : value?.viewUrl || value?.url || "");

export const cleanText = (value) => String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const clampProgress = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.min(100, Math.max(0, Math.round(numericValue))) : 0;
};

export const getCourseImage = (course) => {
    const courseImage = getUrl(course?.thumbnail)
        || getUrl(course?.media?.thumbnail)
        || getUrl(course?.image)
        || getUrl(course?.imageUrl);

    if (courseImage) return courseImage;

    switch (course?.subjectId) {
        case SUBJECT_IDS.ENGLISH:
            return EnglishCourseImage;
        case SUBJECT_IDS.PHYSICS:
            return PhysicCourseImage;
        case SUBJECT_IDS.MATH:
        default:
            return MathCourseImage;
    }
};

export const getCourseBanner = (course) => getUrl(course?.banner)
    || getUrl(course?.media?.banner)
    || getCourseImage(course);

export const getLessonLearningItemCount = (lesson) => lesson?.learningItems?.length || 0;

export const getNextLesson = (lessons = []) => lessons.find(
    (lesson) => clampProgress(lesson?.completionPercentage) < 100
) || lessons[0] || null;

export const getCourseSummary = ({ courseDetail, chapters = [], lessons = [] }) => {
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) => clampProgress(lesson?.completionPercentage) >= 100).length;
    const learningItems = lessons.reduce((total, lesson) => total + getLessonLearningItemCount(lesson), 0);
    const averageProgress = totalLessons
        ? Math.round(lessons.reduce((total, lesson) => total + clampProgress(lesson?.completionPercentage), 0) / totalLessons)
        : 0;

    return {
        progress: clampProgress(courseDetail?.completionPercentage ?? averageProgress),
        totalChapters: chapters.length,
        totalLessons,
        completedLessons,
        learningItems,
    };
};

export const formatPrice = (value, isFree) => {
    if (isFree || Number(value) === 0) return "Miễn phí";
    if (!Number.isFinite(Number(value))) return "Liên hệ";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value));
};

const getLearningItemMedia = (item) => [
    ...(item?.mediaFiles || []),
    ...(item?.videoContents || []).flatMap((content) => content?.mediaFiles || []),
    ...(item?.documentContents || []).flatMap((content) => content?.mediaFiles || []),
].filter(Boolean);

export const getLearningItemPreview = (item) => {
    const mediaFiles = getLearningItemMedia(item);
    const image = mediaFiles.find((media) => media?.type === "IMAGE" || media?.mimeType?.startsWith("image/"));
    return getUrl(image);
};

export const getLearningItemMeta = (type = "") => {
    const normalizedType = String(type).toUpperCase();

    if (normalizedType.includes("YOUTUBE")) {
        return { label: "YouTube", Icon: PlayCircle, className: "bg-red-50 text-red-700" };
    }
    if (normalizedType.includes("VIDEO")) {
        return { label: "Video", Icon: Video, className: "bg-blue-50 text-blue-800" };
    }
    if (normalizedType.includes("DOCUMENT")) {
        return { label: "Tài liệu", Icon: FileText, className: "bg-yellow-50 text-yellow-800" };
    }
    if (normalizedType.includes("HOMEWORK") || normalizedType.includes("EXERCISE")) {
        return { label: "Bài tập", Icon: ClipboardList, className: "bg-green-100 text-green-700" };
    }

    return { label: type || "Nội dung", Icon: Sparkles, className: "bg-blue-50 text-blue-800" };
};

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseEnrollmentService } from "../../../../core/services/modules/courseEnrollmentService";
import { lessonService } from "../../../../core/services/modules/lessonService";
import { ROUTES } from "../../../../core/constants";

const getPayload = (response) => response?.data?.data ?? response?.data ?? response ?? {};

const getCollection = (response) => {
    const payload = getPayload(response);
    return Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
};

const getNextLesson = (lessons) => lessons.find((lesson) => Number(lesson?.completionPercentage) < 100) || lessons[0];

export const useContinueLearningCourses = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openingCourseId, setOpeningCourseId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadEnrollments = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await courseEnrollmentService.getMyEnrollmentsByProgress();
                if (isMounted) setEnrollments(getCollection(response));
            } catch (requestError) {
                if (isMounted) setError(requestError?.message || "Không thể tải khóa học đang học.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadEnrollments();
        return () => { isMounted = false; };
    }, []);

    const openCourse = useCallback(async (enrollment) => {
        const courseId = enrollment?.course?.courseId ?? enrollment?.courseId;
        if (!courseId || openingCourseId) return;

        setOpeningCourseId(courseId);

        try {
            const response = await lessonService.getCourseLessons(courseId);
            const nextLesson = getNextLesson(getCollection(response));

            if (nextLesson?.lessonId) {
                navigate(ROUTES.COURSE_LESSON(courseId, nextLesson.lessonId));
                return;
            }
        } catch {
            // The course detail page remains a useful fallback when lessons cannot load.
        } finally {
            setOpeningCourseId(null);
        }

        navigate(ROUTES.COURSE_DETAIL(courseId));
    }, [navigate, openingCourseId]);

    return { enrollments, loading, error, openingCourseId, openCourse };
};

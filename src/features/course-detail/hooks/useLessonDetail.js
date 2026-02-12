import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchLessonDetail,
    selectLessonDetail,
    selectLessonDetailLoading,
    selectLessonDetailError,
    clearLessonDetail,
} from "../store/courseDetailSlice";

/**
 * Custom hook for Lesson Detail logic
 * Quản lý logic fetch lesson detail
 */
export const useLessonDetail = () => {
    const dispatch = useDispatch();
    const { lessonId } = useParams();

    // Selectors
    const lessonDetail = useSelector(selectLessonDetail);
    const loading = useSelector(selectLessonDetailLoading);
    const error = useSelector(selectLessonDetailError);

    // Fetch lesson detail khi lessonId thay đổi
    useEffect(() => {
        if (lessonId) {
            dispatch(fetchLessonDetail(lessonId));
        }

        // Cleanup khi unmount hoặc lessonId thay đổi
        return () => {
            dispatch(clearLessonDetail());
        };
    }, [dispatch, lessonId]);

    return {
        lessonId,
        lessonDetail,
        loading,
        error,
    };
};

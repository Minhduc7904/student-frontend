import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchStudentCourseDetail,
    fetchCourseLessons,
    selectCourseDetail,
    selectCourseDetailLoading,
    selectCourseDetailError,
    selectCourseLessons,
    selectCourseLessonsLoading,
    selectCourseLessonsError,
    clearCourseDetail,
    clearLessons,
    clearChapters,
} from "../store/courseDetailSlice";

/**
 * Custom hook for Course Detail logic
 * Quản lý logic fetch course detail và lessons
 */
export const useCourseDetail = () => {
    const dispatch = useDispatch();
    const { courseId } = useParams();

    // Selectors
    const courseDetail = useSelector(selectCourseDetail);
    const loading = useSelector(selectCourseDetailLoading);
    const error = useSelector(selectCourseDetailError);
    
    const lessons = useSelector(selectCourseLessons);
    const lessonsLoading = useSelector(selectCourseLessonsLoading);
    const lessonsError = useSelector(selectCourseLessonsError);

    // Fetch course detail và lessons khi courseId thay đổi
    useEffect(() => {
        if (courseId) {
            // Fetch course detail
            dispatch(fetchStudentCourseDetail(courseId));
            // Fetch lessons
            dispatch(fetchCourseLessons(courseId));
        }

        // Cleanup khi unmount hoặc courseId thay đổi
        return () => {
            dispatch(clearCourseDetail());
            dispatch(clearLessons());
            dispatch(clearChapters());
        };
    }, [dispatch, courseId]);

    return {
        courseId,
        courseDetail,
        loading,
        error,
        lessons,
        lessonsLoading,
        lessonsError,
    };
};

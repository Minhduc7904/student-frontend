import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();

    // Selectors
    const courseDetail = useSelector(selectCourseDetail);
    const loading = useSelector(selectCourseDetailLoading);
    const error = useSelector(selectCourseDetailError);
    
    const lessons = useSelector(selectCourseLessons);
    const lessonsLoading = useSelector(selectCourseLessonsLoading);
    const lessonsError = useSelector(selectCourseLessonsError);

    // Nếu được điều hướng về với resetAll=true, xoá toàn bộ data cũ và fetch lại
    useEffect(() => {
        if (location.state?.resetAll) {
            // Xoá state trước để tránh re-trigger
            navigate(location.pathname + location.search, {
                replace: true,
                state: { ...location.state, resetAll: false },
            });
            dispatch(clearCourseDetail());
            dispatch(clearLessons());
            dispatch(clearChapters());
            if (courseId) {
                dispatch(fetchStudentCourseDetail(courseId));
                dispatch(fetchCourseLessons(courseId));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch course detail và lessons khi courseId thay đổi
    useEffect(() => {
        if (courseId && (courseId != courseDetail?.courseId || !lessons.length)) {
            // Fetch course detail
            dispatch(fetchStudentCourseDetail(courseId));
            // Fetch lessons
            dispatch(fetchCourseLessons(courseId));
        }
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

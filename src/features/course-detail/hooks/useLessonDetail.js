import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();

    // Selectors
    const lessonDetail = useSelector(selectLessonDetail);
    const loading = useSelector(selectLessonDetailLoading);
    const error = useSelector(selectLessonDetailError);

    // Nếu được điều hướng về với resetAll=true, xoá data cũ và fetch lại
    useEffect(() => {
        if (location.state?.resetAll) {
            dispatch(clearLessonDetail());
            if (lessonId) {
                dispatch(fetchLessonDetail(lessonId));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch lesson detail khi lessonId thay đổi
    useEffect(() => {
        if (lessonId && lessonDetail?.lessonId != lessonId) {
            dispatch(fetchLessonDetail(lessonId));
        }
    }, [dispatch, lessonId]);

    return {
        lessonId,
        lessonDetail,
        loading,
        error,
    };
};

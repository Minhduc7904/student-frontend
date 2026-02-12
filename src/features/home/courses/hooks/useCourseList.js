import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMyEnrollments,
    selectEnrollments,
    selectLoadingMyEnrollments,
    selectCourseEnrollmentError,
    selectCourseEnrollmentFilters,
    selectCourseEnrollmentPagination,
} from "../../../course-enrollment/store/courseEnrollmentSlice";

/**
 * Custom hook for CourseList logic
 * Quản lý logic fetch, pagination và state của danh sách khóa học
 */
export const useCourseList = () => {
    const dispatch = useDispatch();

    // Selectors
    const enrollments = useSelector(selectEnrollments);
    const loading = useSelector(selectLoadingMyEnrollments);
    const error = useSelector(selectCourseEnrollmentError);
    const filters = useSelector(selectCourseEnrollmentFilters);
    const pagination = useSelector(selectCourseEnrollmentPagination);

    // Fetch enrollments khi filters hoặc pagination thay đổi
    useEffect(() => {
        dispatch(
            fetchMyEnrollments({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            })
        );
    }, [dispatch, filters, pagination.page, pagination.limit]);

    // Handlers
    const handlePrev = () => {
        if (pagination.page > 1) {
            dispatch(
                fetchMyEnrollments({
                    ...filters,
                    page: pagination.page - 1,
                    limit: pagination.limit,
                })
            );
        }
    };

    const handleNext = () => {
        dispatch(
            fetchMyEnrollments({
                ...filters,
                page: pagination.page + 1,
                limit: pagination.limit,
            })
        );
    };

    return {
        enrollments,
        loading,
        error,
        pagination,
        handlePrev,
        handleNext,
    };
};

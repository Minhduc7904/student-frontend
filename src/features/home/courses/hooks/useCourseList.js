import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjects } from "../../../../core/services/modules/examService";
import {
    fetchMyEnrollments,
    selectEnrollments,
    selectLoadingMyEnrollments,
    selectCourseEnrollmentError,
    selectCourseEnrollmentFilters,
    selectCourseEnrollmentPagination,
    setFilters,
    setPagination,
} from "../../../course-enrollment/store/courseEnrollmentSlice";

/**
 * Custom hook for CourseList logic
 * Quản lý logic fetch, pagination và state của danh sách khóa học
 */
export const useCourseList = () => {
    const dispatch = useDispatch();
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);

    // Selectors
    const enrollments = useSelector(selectEnrollments);
    const loading = useSelector(selectLoadingMyEnrollments);
    const error = useSelector(selectCourseEnrollmentError);
    const filters = useSelector(selectCourseEnrollmentFilters);
    const pagination = useSelector(selectCourseEnrollmentPagination);

    useEffect(() => {
        let isMounted = true;

        const loadSubjects = async () => {
            try {
                const response = await getSubjects({ page: 1, limit: 1000, sortBy: "name", sortOrder: "asc" });
                const payload = response?.data?.data ? response.data : (response?.data || response || {});
                const subjectItems = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);

                if (isMounted) setSubjects(subjectItems);
            } catch {
                if (isMounted) setSubjects([]);
            } finally {
                if (isMounted) setLoadingSubjects(false);
            }
        };

        loadSubjects();
        return () => { isMounted = false; };
    }, []);

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
    const handlePrev = useCallback(() => {
        if (pagination.page > 1) {
            dispatch(setPagination({ page: pagination.page - 1 }));
        }
    }, [dispatch, pagination.page]);

    const handleNext = useCallback(() => {
        if (pagination.hasNext ?? pagination.page < pagination.totalPages) {
            dispatch(setPagination({ page: pagination.page + 1 }));
        }
    }, [dispatch, pagination.hasNext, pagination.page, pagination.totalPages]);

    const updateFilters = useCallback((nextFilters) => {
        dispatch(setFilters(nextFilters));
        dispatch(setPagination({ page: 1 }));
    }, [dispatch]);

    return {
        enrollments,
        loading,
        error,
        filters,
        pagination,
        subjects,
        loadingSubjects,
        handlePrev,
        handleNext,
        updateFilters,
    };
};

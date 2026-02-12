import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMyHomeworks,
    selectMyHomeworks,
    selectLoadingMyHomeworks,
    selectLearningItemError,
    selectLearningItemFilters,
    selectLearningItemPagination,
    setFilters,
    resetPagination,
} from "../../../learning-item/store/learningItemSlice";

/**
 * Custom hook for HomeworkList with infinite scroll
 * Quản lý logic fetch, filters, infinite scroll của danh sách bài tập
 */
export const useHomeworkList = () => {
    const dispatch = useDispatch();
    const observerTarget = useRef(null);

    // Selectors
    const homeworks = useSelector(selectMyHomeworks);
    const loading = useSelector(selectLoadingMyHomeworks);
    const error = useSelector(selectLearningItemError);
    const filters = useSelector(selectLearningItemFilters);
    const pagination = useSelector(selectLearningItemPagination);

    // Fetch homeworks khi filters hoặc pagination thay đổi
    useEffect(() => {
        dispatch(
            fetchMyHomeworks({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            })
        );
    }, [dispatch, filters, pagination.page, pagination.limit]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && pagination.hasNext) {
                    dispatch(
                        fetchMyHomeworks({
                            ...filters,
                            page: pagination.page + 1,
                            limit: pagination.limit,
                        })
                    );
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [dispatch, loading, filters, pagination]);

    // Handler để thay đổi filter status
    const handleFilterChange = useCallback(
        (status) => {
            dispatch(setFilters({ status }));
            dispatch(resetPagination()); // Reset về page 1 khi filter thay đổi
        },
        [dispatch]
    );

    return {
        homeworks,
        loading,
        error,
        filters,
        pagination,
        observerTarget,
        handleFilterChange,
    };
};

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCompetitionHistory,
    selectCompetitionHistory,
    selectCompetitionHistoryLoading,
    selectCompetitionHistoryError,
    clearCompetitionHistory,
} from "../store/courseDetailSlice";

/**
 * Custom hook for Competition History with pagination
 * Quản lý logic fetch lịch sử làm bài theo competitionId
 *
 * @param {string|number} competitionId - ID của cuộc thi
 * @param {Object} options - Tuỳ chọn
 * @param {number} options.limit - Kích thước trang (mặc định 10)
 * @param {string} options.sortBy - Trường sắp xếp (mặc định submittedAt)
 * @param {string} options.sortOrder - Chiều sắp xếp: asc | desc (mặc định desc)
 */
export const useCompetitionHistory = (competitionId, options = {}) => {
    const dispatch = useDispatch();

    const { limit = 10, sortBy = "submittedAt", sortOrder = "desc" } = options;

    // Selectors
    const historyData = useSelector(selectCompetitionHistory);
    const loading = useSelector(selectCompetitionHistoryLoading);
    const error = useSelector(selectCompetitionHistoryError);

    // Derived data
    const history = historyData?.history ?? [];
    const pagination = historyData?.pagination ?? {
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
    };

    /**
     * Fetch a specific page
     */
    const fetchPage = useCallback(
        (page = 1) => {
            if (!competitionId) return;
            dispatch(
                fetchCompetitionHistory({
                    competitionId,
                    params: { page, limit, sortBy, sortOrder },
                })
            );
        },
        [dispatch, competitionId, limit, sortBy, sortOrder]
    );

    // Fetch initial page when competitionId changes
    useEffect(() => {
        if (competitionId) {
            fetchPage(1);
        }

        return () => {
            dispatch(clearCompetitionHistory());
        };
    }, [competitionId]);

    /**
     * Refresh current page
     */
    const refresh = useCallback(() => {
        fetchPage(pagination.page);
    }, [fetchPage, pagination.page]);

    return {
        history,
        pagination,
        loading,
        error,
        fetchPage,
        refresh,
    };
};

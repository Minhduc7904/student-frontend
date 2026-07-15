import { useCallback, useEffect, useRef, useState } from "react";
import { learningItemService } from "../../../../core/services/modules/learningItemService";

export const HOMEWORK_TABS = [
    { value: "ALL", label: "Tất cả" },
    { value: "INCOMPLETE", label: "Chưa hoàn thành" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "OVERDUE", label: "Quá hạn" },
];

const getHomeworkResponse = (response) => {
    const body = response?.data ?? response ?? {};
    const payload = body?.data ?? body;

    if (Array.isArray(payload)) {
        return { items: payload, meta: body?.meta || {} };
    }

    return {
        items: Array.isArray(payload?.data) ? payload.data : [],
        meta: payload?.meta || body?.meta || {},
    };
};

export const useDashboardHomeworks = () => {
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);
    const [homeworks, setHomeworks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 0, total: 0, hasPrevious: false, hasNext: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const requestIdRef = useRef(0);

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const loadHomeworks = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await learningItemService.getMyHomeworks({ status, page, limit: 6 });
                const result = getHomeworkResponse(response);

                if (requestId !== requestIdRef.current) return;
                setHomeworks(result.items);
                setPagination({
                    page: result.meta?.page || page,
                    totalPages: result.meta?.totalPages || 0,
                    total: result.meta?.total || 0,
                    hasPrevious: Boolean(result.meta?.hasPrevious),
                    hasNext: Boolean(result.meta?.hasNext),
                });
            } catch (requestError) {
                if (requestId !== requestIdRef.current) return;
                setHomeworks([]);
                setError(requestError?.message || "Không thể tải bài tập.");
            } finally {
                if (requestId === requestIdRef.current) setLoading(false);
            }
        };

        loadHomeworks();
    }, [page, status]);

    const changeStatus = useCallback((nextStatus) => {
        setStatus(nextStatus);
        setPage(1);
    }, []);

    const previousPage = useCallback(() => {
        setPage((current) => Math.max(1, current - 1));
    }, []);

    const nextPage = useCallback(() => {
        setPage((current) => current + 1);
    }, []);

    return { status, homeworks, pagination, loading, error, changeStatus, previousPage, nextPage };
};

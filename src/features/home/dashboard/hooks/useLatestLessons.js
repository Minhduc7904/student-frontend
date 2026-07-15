import { useCallback, useEffect, useRef, useState } from "react";
import { lessonService } from "../../../../core/services/modules/lessonService";

const getLessonResponse = (response) => {
    const body = response?.data ?? response ?? {};
    const payload = body?.data ?? body;

    if (Array.isArray(payload)) return { items: payload, meta: body?.meta || {} };

    return {
        items: Array.isArray(payload?.data) ? payload.data : [],
        meta: payload?.meta || body?.meta || {},
    };
};

export const useLatestLessons = () => {
    const [page, setPage] = useState(1);
    const [lessons, setLessons] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 0, total: 0, hasPrevious: false, hasNext: false });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const requestIdRef = useRef(0);

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const loadLessons = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await lessonService.getLatestStudentLessons({ page, limit: 6 });
                const result = getLessonResponse(response);

                if (requestId !== requestIdRef.current) return;
                setLessons(result.items);
                setPagination({
                    page: result.meta?.page || page,
                    totalPages: result.meta?.totalPages || 0,
                    total: result.meta?.total || 0,
                    hasPrevious: Boolean(result.meta?.hasPrevious),
                    hasNext: Boolean(result.meta?.hasNext),
                });
            } catch (requestError) {
                if (requestId !== requestIdRef.current) return;
                setLessons([]);
                setError(requestError?.message || "Không thể tải bài học mới.");
            } finally {
                if (requestId === requestIdRef.current) setLoading(false);
            }
        };

        loadLessons();
    }, [page]);

    const previousPage = useCallback(() => setPage((current) => Math.max(1, current - 1)), []);
    const nextPage = useCallback(() => setPage((current) => current + 1), []);

    return { lessons, pagination, loading, error, previousPage, nextPage };
};

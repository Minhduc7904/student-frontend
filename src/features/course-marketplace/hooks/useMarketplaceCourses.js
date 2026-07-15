import { useCallback, useEffect, useRef, useState } from "react";
import { courseService } from "../../../core/services/modules/courseService";
import { getSubjects } from "../../../core/services/modules/examService";

const DEFAULT_FILTERS = {
    page: 1,
    limit: 12,
    search: "",
    grade: "",
    subjectId: "",
    academicYear: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

const getResponsePayload = (response) => response?.data?.data ? response.data : (response?.data || response || {});

const buildQuery = (filters) => Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined && value !== null)
);

export const useMarketplaceCourses = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [pagination, setPagination] = useState(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [error, setError] = useState("");
    const requestIdRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const loadSubjects = async () => {
            try {
                const response = await getSubjects({ page: 1, limit: 1000, sortBy: "name", sortOrder: "asc" });
                const payload = getResponsePayload(response);
                const subjectItems = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);

                if (mounted) setSubjects(subjectItems);
            } catch {
                if (mounted) setSubjects([]);
            } finally {
                if (mounted) setLoadingSubjects(false);
            }
        };

        loadSubjects();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const loadCourses = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await courseService.getStudentOnlineCoursesNotEnrolled(buildQuery(filters));
                const payload = getResponsePayload(response);

                if (requestId !== requestIdRef.current) return;

                setCourses(Array.isArray(payload?.data) ? payload.data : []);
                setPagination(payload?.meta || DEFAULT_FILTERS);
            } catch (requestError) {
                if (requestId !== requestIdRef.current) return;

                setCourses([]);
                setError(requestError?.message || "Không thể tải danh sách khóa học.");
            } finally {
                if (requestId === requestIdRef.current) setLoading(false);
            }
        };

        loadCourses();
    }, [filters]);

    const updateFilter = useCallback((field, value) => {
        setFilters((current) => ({ ...current, [field]: value, page: 1 }));
    }, []);

    const changePage = useCallback((page) => {
        setFilters((current) => ({ ...current, page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return {
        courses,
        subjects,
        loading,
        loadingSubjects,
        error,
        filters,
        pagination,
        updateFilter,
        changePage,
        resetFilters,
    };
};

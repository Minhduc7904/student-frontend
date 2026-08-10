import { useCallback, useEffect, useRef, useState } from 'react';
import { bookService } from '../../../core/services/modules/bookService';

const DEFAULT_FILTERS = {
    page: 1,
    limit: 12,
    search: '',
    categorySlugs: [],
    isFeatured: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
};

const getResponsePayload = (response) => response?.data?.data ? response.data : (response?.data || response || {});

const buildQuery = (filters) => Object.fromEntries(
    Object.entries(filters).filter(([, value]) => (
        value !== '' && value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0)
    ))
);

export const useBookMarketplace = () => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState('');
    const requestIdRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        const loadCategories = async () => {
            try {
                const response = await bookService.getStudentBookCategories();
                const payload = getResponsePayload(response);
                const items = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                if (mounted) setCategories(items);
            } catch {
                if (mounted) setCategories([]);
            } finally {
                if (mounted) setLoadingCategories(false);
            }
        };

        loadCategories();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        const loadBooks = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await bookService.getStudentBooks(buildQuery(filters));
                const payload = getResponsePayload(response);
                if (requestId !== requestIdRef.current) return;

                setBooks(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
                setPagination(payload?.meta || DEFAULT_FILTERS);
            } catch (requestError) {
                if (requestId !== requestIdRef.current) return;
                setBooks([]);
                setError(requestError?.message || 'Không thể tải danh sách sách.');
            } finally {
                if (requestId === requestIdRef.current) setLoading(false);
            }
        };

        loadBooks();
    }, [filters]);

    const updateFilter = useCallback((field, value) => {
        setFilters((current) => ({ ...current, [field]: value, page: 1 }));
    }, []);

    const toggleCategory = useCallback((slug) => {
        setFilters((current) => {
            const selectedSlugs = current.categorySlugs || [];
            const categorySlugs = selectedSlugs.includes(slug)
                ? selectedSlugs.filter((item) => item !== slug)
                : [...selectedSlugs, slug];

            return { ...current, categorySlugs, page: 1 };
        });
    }, []);

    const changePage = useCallback((page) => {
        setFilters((current) => ({ ...current, page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return {
        books,
        categories,
        loading,
        loadingCategories,
        error,
        filters,
        pagination,
        updateFilter,
        toggleCategory,
        changePage,
        resetFilters,
    };
};

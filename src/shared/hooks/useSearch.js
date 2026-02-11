import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Hook for search functionality with debounce
 * @param {string} initialValue - Initial search value (default: '')
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @returns {Object} { search, debouncedSearch, setSearch, handleSearchChange, clearSearch }
 */
export const useSearch = (initialValue = '', delay = 500) => {
    const [search, setSearch] = useState(initialValue);
    const debouncedSearch = useDebounce(search, delay);

    const handleSearchChange = useCallback((value) => {
        setSearch(value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearch('');
    }, []);

    return {
        search,
        debouncedSearch,
        setSearch,
        handleSearchChange,
        clearSearch,
    };
};

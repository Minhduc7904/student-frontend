import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "../../../../shared/hooks";

const EnrollmentCourseFilters = ({ filters, subjects, loadingSubjects, onFiltersChange }) => {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchValue, 400);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) onFiltersChange({ search: debouncedSearch });
    }, [debouncedSearch, filters.search, onFiltersChange]);

    useEffect(() => {
        setSearchValue(filters.search || "");
    }, [filters.search]);

    return (
        <section className="mb-6 flex flex-col gap-3 border-y border-blue-100 py-4 sm:flex-row sm:items-center" aria-label="Tìm kiếm và lọc khóa học của tôi">
            <label className="relative block min-w-0 flex-1">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} className="h-11 w-full rounded-lg border border-blue-100 bg-white pl-10 pr-3 text-sm text-blue-950 outline-none transition placeholder:text-gray-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-100" placeholder="Tìm khóa học của tôi" aria-label="Tìm khóa học của tôi" />
            </label>
            <select aria-label="Lọc theo khối lớp" value={filters.grade || ""} onChange={(event) => onFiltersChange({ grade: event.target.value })} className="h-11 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-950 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100 sm:w-44">
                <option value="">Tất cả khối</option>
                {Array.from({ length: 12 }, (_, index) => index + 1).map((grade) => <option key={grade} value={grade}>Khối {grade}</option>)}
            </select>
            <select aria-label="Lọc theo môn học" value={filters.subjectId || ""} onChange={(event) => onFiltersChange({ subjectId: event.target.value })} className="h-11 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-950 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100 sm:w-48" disabled={loadingSubjects}>
                <option value="">{loadingSubjects ? "Đang tải môn học..." : "Tất cả môn học"}</option>
                {subjects.map((subject) => <option key={subject.subjectId} value={subject.subjectId}>{subject.name}</option>)}
            </select>
        </section>
    );
};

export default EnrollmentCourseFilters;

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDebounce } from "../../../shared/hooks";

const SORT_OPTIONS = [
    { value: "createdAt", label: "Mới cập nhật" },
    { value: "title", label: "Tên khóa học" },
    { value: "grade", label: "Khối lớp" },
    { value: "priceVND", label: "Học phí" },
    { value: "courseId", label: "Mã khóa học" },
    { value: "visibility", label: "Trạng thái hiển thị" },
    { value: "isEnded", label: "Trạng thái kết thúc" },
    { value: "courseType", label: "Loại khóa học" },
    { value: "updatedAt", label: "Ngày chỉnh sửa" },
];

const MarketplaceSortControls = ({ filters, onChange }) => {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const debouncedSearch = useDebounce(searchValue, 400);

    useEffect(() => {
        if (debouncedSearch !== filters.search) onChange("search", debouncedSearch);
    }, [debouncedSearch, filters.search, onChange]);

    useEffect(() => {
        setSearchValue(filters.search || "");
    }, [filters.search]);

    return (
    <section className="border-y border-blue-100 py-5 sm:py-6" aria-label="Tìm kiếm và sắp xếp khóa học">
        <div className="flex flex-col gap-4">
            <label className="relative block min-w-0">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} className="h-11 w-full rounded-lg border border-blue-100 bg-white pl-10 pr-3 text-sm text-blue-950 outline-none transition placeholder:text-gray-400 focus:border-blue-800 focus:ring-2 focus:ring-blue-100" placeholder="Tìm tên hoặc nội dung khóa học" aria-label="Tìm khóa học" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <span className="inline-flex h-10 items-center gap-2 text-sm font-bold text-blue-950"><SlidersHorizontal size={17} className="text-blue-800" /> Sắp xếp</span>
                <label className="block text-xs font-bold text-gray-600 sm:w-52">
                    Theo
                    <select value={filters.sortBy} onChange={(event) => onChange("sortBy", event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-950 outline-none focus:border-blue-800">
                        {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>
                <label className="block text-xs font-bold text-gray-600 sm:w-40">
                    Thứ tự
                    <select value={filters.sortOrder} onChange={(event) => onChange("sortOrder", event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-950 outline-none focus:border-blue-800">
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </select>
                </label>
                <label className="block text-xs font-bold text-gray-600 sm:w-32">
                    Mỗi trang
                    <select value={filters.limit} onChange={(event) => onChange("limit", Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm font-semibold text-blue-950 outline-none focus:border-blue-800">
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                    </select>
                </label>
            </div>
        </div>
    </section>
    );
};

export default MarketplaceSortControls;

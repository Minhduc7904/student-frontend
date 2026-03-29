import { memo } from "react";
import { SvgIcon } from "..";
import { DebouncedSearchInput } from "..";
import UserClass from "../../../assets/icons/UserClass.svg";

/**
 * Search Header Component
 * Search bar và nút thêm khóa học
 */
const SearchHeader = memo(({ onAddCourse }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            {/* Search Input */}
            <DebouncedSearchInput
                placeholder="Tìm kiếm khóa học..."
                debounceMs={400}
            />

            {/* Add Course Button */}
            <button
                onClick={onAddCourse}
                className="bg-yellow-100 cursor-pointer active:scale-[0.98] hover:bg-yellow-500 
                    rounded-full 
                    px-4 py-1.5
                    flex flex-row gap-1.5 sm:gap-2 
                    items-center justify-center 
                    transition
                    "
            >
                <SvgIcon src={UserClass} className="w-5 h-5" />
                <div className="text-sm text-semibold text-blue-800 whitespace-nowrap">
                    Thêm khóa học
                </div>
            </button>
        </div>
    );
});

SearchHeader.displayName = "SearchHeader";

export default SearchHeader;

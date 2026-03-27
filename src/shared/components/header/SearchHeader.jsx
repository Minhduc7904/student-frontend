import { memo } from "react";
import { Search } from "lucide-react";
import { SvgIcon } from "..";
import UserClass from "../../../assets/icons/UserClass.svg";

/**
 * Search Header Component
 * Search bar và nút thêm khóa học
 */
const SearchHeader = memo(({ onAddCourse }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
            {/* Search Input */}
            <div className="w-50 flex justify-center items-center">
                <div className="relative w-full">
                    <Search
                        className="absolute left-2 sm:left-[10px] top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        className="
                            w-full
                            px-9 py-1.5
                            rounded-full
                            bg-[#F5F5F5]
                            text-xs text-gray-700
                            focus:outline-none
                            focus:ring-2 focus:ring-yellow-400
                            focus:border-yellow-400
                            transition
                        "
                    />
                </div>
            </div>

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

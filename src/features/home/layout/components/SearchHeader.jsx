import { memo } from "react";
import { Search } from "lucide-react";
import { SvgIcon } from "../../../../shared/components";
import UserClass from "../../../../assets/icons/UserClass.svg";

/**
 * Search Header Component
 * Search bar và nút thêm khóa học
 */
const SearchHeader = memo(({ onAddCourse }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
            {/* Search Input */}
            <div className="flex-1 flex justify-center items-center">
                <div className="relative w-full h-10 sm:h-11 lg:h-[48px]">
                    <Search
                        size={20}
                        className="absolute left-2 sm:left-[10px] top-1/2 -translate-y-1/2 text-gray-500 lg:w-6 lg:h-6"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        className="
                            w-full h-full
                            pl-9 sm:pl-10 lg:pl-12 
                            pr-3 sm:pr-4 
                            py-2
                            rounded-lg
                            border border-gray-700
                            text-sm sm:text-text-4 text-gray-700
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
                    rounded-lg 
                    px-3 sm:px-4 lg:px-[14px] 
                    py-2 
                    flex flex-row gap-1.5 sm:gap-2 
                    items-center justify-center 
                    transition
                    w-full sm:w-auto"
            >
                <SvgIcon src={UserClass} className="w-5 h-5 sm:w-6 sm:h-5 lg:w-7 lg:h-6" />
                <div className="px-1 sm:p-2 text-sm sm:text-h4 text-blue-800 whitespace-nowrap">
                    Thêm khóa học
                </div>
            </button>
        </div>
    );
});

SearchHeader.displayName = "SearchHeader";

export default SearchHeader;

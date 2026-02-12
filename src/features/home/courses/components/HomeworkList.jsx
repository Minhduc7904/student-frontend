import { memo } from "react";
import { ContentLoading } from "../../../../shared/components";
import { useHomeworkList } from "../hooks";
import HomeworkCard from "./HomeworkCard";

// Homework Status Constants
const HOMEWORK_STATUS = {
    ALL: "ALL",
    INCOMPLETE: "INCOMPLETE",
    COMPLETED: "COMPLETED",
    OVERDUE: "OVERDUE",
};

const FILTER_TABS = [
    { label: "Tất cả", value: HOMEWORK_STATUS.ALL },
    { label: "Chưa làm", value: HOMEWORK_STATUS.INCOMPLETE },
    { label: "Đã hoàn thành", value: HOMEWORK_STATUS.COMPLETED },
    { label: "Quá hạn", value: HOMEWORK_STATUS.OVERDUE },
];

/**
 * Homework List Component
 * Hiển thị danh sách bài tập với filter và infinite scroll
 */
export const HomeworkList = memo(() => {
    const {
        homeworks,
        loading,
        error,
        filters,
        pagination,
        observerTarget,
        handleFilterChange,
    } = useHomeworkList();

    return (
        <div className="flex flex-col w-full gap-3 sm:gap-4">
            {/* Filter Tabs - Luôn hiển thị */}
            <div className="lg:px-4 sm:px-6 gap-2 sm:gap-3 md:gap-4 flex flex-row justify-start items-center w-full overflow-x-auto">
                {FILTER_TABS.map((tab) => (
                    <button
                        type="button"
                        key={tab.value}
                        onClick={() => handleFilterChange(tab.value)}
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 cursor-pointer rounded-lg transition-all duration-200 whitespace-nowrap ${
                            filters.status === tab.value
                                ? "bg-blue-cyan text-white font-semibold"
                                : "text-blue-cyan hover:bg-blue-50"
                        }`}
                    >
                        <span className="text-text-5 sm:text-subhead-5 md:text-subhead-4">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Loading state (chỉ hiển thị khi load lần đầu) */}
            {loading && homeworks.length === 0 ? (
                <ContentLoading message="Đang tải bài tập..." height="py-20" />
            ) : error ? (
                // Error state
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-red-500 text-lg font-medium mb-2">
                        Có lỗi xảy ra
                    </div>
                    <p className="text-gray-600">{error}</p>
                </div>
            ) : homeworks.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Chưa có bài tập nào
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Bạn chưa có bài tập nào trong danh mục này.
                    </p>
                </div>
            ) : (
                // Content - Stats + Homework List
                <>
                    {/* Stats */}
                    <div className="flex w-full justify-end items-center lg:px-4">
                        <div className="text-gray-700 text-text-5 sm:text-subhead-5">
                            Hiển thị {homeworks.length} trên {pagination.total} bài tập
                        </div>
                    </div>

                    {/* Homework Cards List */}
                    <div className="flex flex-col gap-2 sm:gap-3 lg:px-4  pb-4 sm:pb-6">{homeworks.map((homework) => (
                            <HomeworkCard
                                key={homework.learningItemId}
                                homework={homework}
                            />
                        ))}

                        {/* Infinite Scroll Observer Target */}
                        <div ref={observerTarget} className="h-4" />

                        {/* Loading More Indicator */}
                        {loading && (
                            <div className="flex justify-center py-4">
                                <ContentLoading
                                    message="Đang tải thêm..."
                                    height="h-auto"
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

HomeworkList.displayName = "HomeworkList";

export default HomeworkList;
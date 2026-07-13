import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    LayoutList,
} from "lucide-react";
import {
    getItemTitle,
    shellMotion,
} from "./learningPageUtils";

export const LessonLearningFooter = ({
    showLearningItem,
    learningItemLoading,
    learningItemDetail,
    currentNavItem,
    previousRow,
    nextRow,
    markLearnedLoading,
    markLearnedError,
    isCurrentItemLearned,
    onPrevious,
    onNext,
    onMarkLearned,
}) => (
    <footer className="shrink-0 border-t border-blue-100 bg-white px-3 py-2 sm:px-4">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-gray-600">
                <div className="flex min-w-0 items-center gap-2">
                    <LayoutList size={16} className="shrink-0 text-blue-700" />
                    <span className="truncate">
                        {showLearningItem
                            ? getItemTitle(learningItemDetail || currentNavItem)
                            : "Chọn một mục học tập để bắt đầu"}
                    </span>
                </div>
                {markLearnedError ? (
                    <span className="truncate text-[11px] font-semibold text-red-600" role="status">
                        {markLearnedError}
                    </span>
                ) : null}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={!previousRow}
                    className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 text-xs font-bold text-blue-800 disabled:cursor-not-allowed disabled:opacity-40 ${shellMotion} active:scale-[0.98]`}
                >
                    <ArrowLeft size={15} />
                    Trước
                </button>
                <button
                    type="button"
                    onClick={onMarkLearned}
                    disabled={!showLearningItem || learningItemLoading || markLearnedLoading || isCurrentItemLearned}
                    className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold ${shellMotion} active:scale-[0.98] ${
                        isCurrentItemLearned
                            ? "border border-green-100 bg-green-100 text-green-700"
                            : "border border-blue-800 bg-blue-800 text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-400"
                    }`}
                >
                    {isCurrentItemLearned ? <CheckCircle2 size={15} /> : <Check size={15} />}
                    {markLearnedLoading ? "Đang lưu" : isCurrentItemLearned ? "Đã học" : "Đánh dấu"}
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!nextRow}
                    className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-yellow-500 px-3 text-xs font-bold text-blue-950 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 ${shellMotion} active:scale-[0.98]`}
                >
                    Tiếp
                    <ArrowRight size={15} />
                </button>
            </div>
        </div>
    </footer>
);

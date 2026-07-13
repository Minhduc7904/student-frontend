import { Link } from "react-router-dom";
import {
    Home,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { ROUTES } from "../../../../core/constants";
import {
    getItemTitle,
    shellMotion,
} from "./learningPageUtils";

export const LessonLearningHeader = ({
    showLearningItem,
    activePositionInLesson,
    totalItemsInLesson,
    learningItemDetail,
    currentNavItem,
    activeLesson,
    currentTypeMeta,
    isRailCollapsed,
    onToggleSidebar,
    onToggleRail,
}) => {
    const CurrentTypeIcon = currentTypeMeta.icon;

    return (
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-blue-100 bg-white/95 px-3 shadow-sm backdrop-blur sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-800 md:hidden"
                    aria-label="Mở danh sách bài học"
                >
                    <Menu size={18} />
                </button>
                <button
                    type="button"
                    onClick={onToggleRail}
                    className={`hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 md:flex ${shellMotion}`}
                    aria-label={isRailCollapsed ? "Mở cột bài học" : "Thu gọn cột bài học"}
                >
                    {isRailCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {showLearningItem ? `Mục ${activePositionInLesson || "-"}/${totalItemsInLesson || "-"}` : "Tổng quan bài học"}
                    </p>
                    <h1 className="truncate text-sm font-bold text-blue-950 sm:text-base">
                        {showLearningItem ? getItemTitle(learningItemDetail || currentNavItem) : activeLesson?.title || "Bài học"}
                    </h1>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {showLearningItem ? (
                    <span className={`hidden items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold sm:inline-flex ${currentTypeMeta.className}`}>
                        <CurrentTypeIcon size={14} />
                        {currentTypeMeta.label}
                    </span>
                ) : null}
                <Link
                    to={ROUTES.DASHBOARD}
                    className="hidden h-10 items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-50 hover:text-blue-950 sm:inline-flex"
                >
                    <Home size={15} />
                    Trang chủ
                </Link>
            </div>
        </header>
    );
};

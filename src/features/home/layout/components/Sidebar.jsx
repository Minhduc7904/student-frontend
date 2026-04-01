import { useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../shared/components";
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Trophy,
    Settings,
    LogOut,
} from "lucide-react";
import { ROUTES } from "../../../../core/constants";

/* ─── MenuItem ─── */
const MenuItem = memo(({ item, isActive }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const danger = item.danger;

    return (
        <div className="relative w-full">
            <Link
                to={item.path}
                className={`
                    group relative flex items-center gap-3 w-full rounded-xl transition-all duration-200 cursor-pointer px-3 py-2.5
                    ${active
                        ? "bg-linear-to-r from-blue-500 via-blue-700 to-blue-900 text-white shadow-md shadow-blue-900/20"
                        : danger
                            ? " text-gray-700 hover:bg-red-100/60 hover:text-red-500"
                            : " text-gray-700 hover:bg-blue-100/60 hover:text-blue-800"
                    }
                `}
            >

                <Icon
                    size={22}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors duration-200 ${active
                        ? "text-blue-50"
                        : danger
                            ? "text-gray-700 group-hover:text-red-500"
                            : "text-gray-700 group-hover:text-blue-800"
                        }`}
                />
                <span className={`text-text-4 truncate transition-colors duration-200 ${active ? "font-bold text-blue-50" : "font-semibold"
                    }`}>
                    {item.label}
                </span>
            </Link>
        </div>
    );
});
MenuItem.displayName = "MenuItem";

/* ─── Menu config ─── */
const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Tổng quan", path: ROUTES.DASHBOARD },
    { icon: BookOpen, label: "Khóa học", path: ROUTES.COURSE_ENROLLMENTS },
    { icon: FileText, label: "Đề mẫu", path: ROUTES.EXAMS },
    { icon: Trophy, label: "Cuộc thi", path: ROUTES.COMPETITION },
    // { icon: Library, label: "Thư viện", path: ROUTES.LIBRARY },
    // { icon: TrendingUp, label: "Tiến độ học tập", path: ROUTES.PROGRESS },
    // { icon: CalendarDays, label: "Lịch học", path: ROUTES.CALENDAR },
    // { icon: CreditCard, label: "Thanh toán", path: ROUTES.PAYMENT },
];

const BOTTOM_MENU_ITEMS = [
    { icon: Settings, label: "Cài đặt", path: ROUTES.PROFILE_SETTING },
    { icon: LogOut, label: "Đăng xuất", path: ROUTES.LOGOUT, danger: true },
];

/* ─── Sidebar ─── */
export const Sidebar = memo(({ isCollapsed, onToggleCollapse }) => {
    const location = useLocation();

    const isActive = useCallback(
        (path) => location.pathname === path || location.pathname.startsWith(path + "/"),
        [location.pathname]
    );

    const renderMenuItems = useMemo(
        () =>
            MENU_ITEMS.map((item, i) => (
                <MenuItem
                    key={item.path}
                    item={item}
                    isActive={isActive}
                />
            )),
        [isActive]
    );

    const renderBottomItems = useMemo(
        () =>
            BOTTOM_MENU_ITEMS.map((item) => (
                <MenuItem
                    key={item.path}
                    item={item}
                    isActive={isActive}
                />
            )),
        [isActive]
    );

    return (
        <aside className="h-dvh w-65 bg-white flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center px-3 pt-4 pb-2">
                <Logo mode="default" className="h-9 w-auto object-contain" containerClassName="flex items-center" />
            </div>

            {/* Divider */}
            <div className="mx-3 border-t border-gray-100" />

            {/* Main menu - scrollable */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-3 flex flex-col gap-1">
                {renderMenuItems}
            </nav>

            {/* Bottom section */}
            <div className="shrink-0 px-3 pb-4">
                <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                    {renderBottomItems}
                </div>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

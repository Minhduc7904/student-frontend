import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../shared/components";
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Trophy,
    Library,
    TrendingUp,
    CalendarDays,
    CreditCard,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { ROUTES } from "../../../../core/constants";

/* ─── Tooltip (collapsed hover) ─── */
const Tooltip = memo(({ label }) => (
    <div className="px-3 py-2 rounded-lg bg-gray-900 text-white text-text-5 font-medium whitespace-nowrap shadow-lg">
        {label}
    </div>
));
Tooltip.displayName = "Tooltip";

const TooltipPortal = memo(({ children, position }) => {
    if (!position) return null;
    return createPortal(
        <div
            style={{
                position: "fixed",
                left: `${position.left + 12}px`,
                top: `${position.top}px`,
                transform: "translateY(-50%)",
                zIndex: 9999,
                pointerEvents: "none",
            }}
            className="animate-[fadeIn_0.15s_ease-in-out]"
        >
            {children}
        </div>,
        document.body
    );
});
TooltipPortal.displayName = "TooltipPortal";

/* ─── MenuItem ─── */
const MenuItem = memo(({ item, index, isActive, isCollapsed, hoveredIndex, onMouseEnter, onMouseLeave }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const danger = item.danger;
    const itemRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState(null);

    useEffect(() => {
        if (isCollapsed && hoveredIndex === index && itemRef.current) {
            const rect = itemRef.current.getBoundingClientRect();
            setTooltipPos({ left: rect.right, top: rect.top + rect.height / 2 });
        } else {
            setTooltipPos(null);
        }
    }, [isCollapsed, hoveredIndex, index]);

    return (
        <>
            <div
                ref={itemRef}
                className="relative w-full"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Link
                    to={item.path}
                    className={`
                        group flex items-center gap-3 w-full rounded-xl transition-all duration-200 cursor-pointer
                        ${isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"}
                        ${active
                            ? "bg-blue-800 text-white shadow-sm"
                            : danger
                                ? "text-gray-500 hover:bg-red-100/60 hover:text-red-500"
                                : "text-gray-500 hover:bg-blue-100/60 hover:text-blue-800"
                        }
                    `}
                    title={isCollapsed ? item.label : undefined}
                >
                    <Icon
                        size={22}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={`shrink-0 transition-colors duration-200 ${active
                                ? "text-white"
                                : danger
                                    ? "text-gray-400 group-hover:text-red-500"
                                    : "text-gray-400 group-hover:text-blue-800"
                            }`}
                    />
                    {!isCollapsed && (
                        <span className={`text-text-4 font-semibold truncate transition-colors duration-200 ${active ? "text-white" : ""
                            }`}>
                            {item.label}
                        </span>
                    )}
                </Link>
            </div>

            {tooltipPos && (
                <TooltipPortal position={tooltipPos}>
                    <Tooltip label={item.label} />
                </TooltipPortal>
            )}
        </>
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
    { icon: Settings, label: "Cài đặt", path: ROUTES.SETTINGS },
    { icon: LogOut, label: "Đăng xuất", path: ROUTES.LOGOUT, danger: true },
];

/* ─── Sidebar ─── */
export const Sidebar = memo(({ isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Delay content switch so it syncs with width transition
    // Collapsing: width shrinks first → content switches after transition
    // Expanding: content switches immediately → width expands
    const [contentCollapsed, setContentCollapsed] = useState(isCollapsed);

    useEffect(() => {
        if (!isCollapsed) {
            setContentCollapsed(false);
        }
    }, [isCollapsed]);

    const handleTransitionEnd = useCallback((e) => {
        if (e.propertyName === "width" && isCollapsed) {
            setContentCollapsed(true);
        }
    }, [isCollapsed]);

    const isActive = useCallback(
        (path) => location.pathname === path || location.pathname.startsWith(path + "/"),
        [location.pathname]
    );

    const handleMouseEnter = useCallback((i) => setHoveredIndex(i), []);
    const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

    const renderMenuItems = useMemo(
        () =>
            MENU_ITEMS.map((item, i) => (
                <MenuItem
                    key={item.path}
                    item={item}
                    index={i}
                    isActive={isActive}
                    isCollapsed={contentCollapsed}
                    hoveredIndex={hoveredIndex}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                />
            )),
        [isActive, contentCollapsed, hoveredIndex, handleMouseEnter, handleMouseLeave]
    );

    const renderBottomItems = useMemo(
        () =>
            BOTTOM_MENU_ITEMS.map((item, i) => {
                const idx = MENU_ITEMS.length + i;
                return (
                    <MenuItem
                        key={item.path}
                        item={item}
                        index={idx}
                        isActive={isActive}
                        isCollapsed={contentCollapsed}
                        hoveredIndex={hoveredIndex}
                        onMouseEnter={() => handleMouseEnter(idx)}
                        onMouseLeave={handleMouseLeave}
                    />
                );
            }),
        [isActive, contentCollapsed, hoveredIndex, handleMouseEnter, handleMouseLeave]
    );

    return (
        <aside
            onTransitionEnd={handleTransitionEnd}
            className={`h-dvh bg-background flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-65"
                }`}
        >
            {/* Logo + Toggle */}
            <div className={`shrink-0 flex items-center px-3 pt-4 pb-2 ${contentCollapsed ? "justify-center" : "justify-between"}`}>
                {contentCollapsed ? (
                    <Logo mode="collapsed" className="w-10 h-10 object-contain" containerClassName="flex items-center justify-center" />
                ) : (
                    <Logo mode="default" className="h-9 w-auto object-contain" containerClassName="flex items-center" />
                )}

                {!contentCollapsed && (
                    <button
                        onClick={onToggleCollapse}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                        aria-label="Thu gọn sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
            </div>

            {/* Collapsed toggle */}
            {contentCollapsed && (
                <div className="shrink-0 flex justify-center px-3 pb-1">
                    <button
                        onClick={onToggleCollapse}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                        aria-label="Mở rộng sidebar"
                    >
                        <PanelLeftOpen size={18} />
                    </button>
                </div>
            )}

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

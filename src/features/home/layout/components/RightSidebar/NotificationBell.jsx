import { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, X, Check, CheckCheck, Trash2 } from "lucide-react";
import { useSocketEvent } from "../../../../../shared/hooks/socket";
import { SOCKET_EVENTS } from "../../../../../core/constants/socketEvents";
import {
    NOTIFICATION_TYPE_UI,
    NOTIFICATION_LEVEL_UI,
} from "../../../../../core/constants/notificationConstants";
import { formatRelativeTime } from "../../../../../shared/utils/dateUtils";
import {
    getMyNotificationsAsync,
    getMyStatsAsync,
    markNotificationReadAsync,
    markAllReadAsync,
    deleteNotificationAsync,
    addRealtimeNotification,
    selectMyNotifications,
    selectNotificationStats,
    selectLoadingMyNotifications,
} from "../../../../notification/store/notificationSlice";

/* ===================== Small Components ===================== */

/**
 * BellButton - Nút chuông thông báo với badge
 */
const BellButton = memo(({ unread, onClick, compact = false }) => (
    <button
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer active:scale-90 hover:bg-gray-100 ${compact ? 'p-1.5' : 'p-2'}`}
        aria-label="Thông báo"
    >
        <Bell size={compact ? 18 : 22} className="text-gray-800" />
        {unread > 0 && (
            <span className={`absolute -top-0.5 -right-0.5 rounded-full bg-red-500 px-1 text-white flex items-center justify-center ${compact ? 'min-w-4 h-4 text-[10px]' : 'min-w-4.5 h-4.5 text-h5'}`}>
                {unread > 99 ? "99+" : unread}
            </span>
        )}
    </button>
));
BellButton.displayName = "BellButton";

/**
 * DropdownHeader - Header của dropdown thông báo
 */
const DropdownHeader = memo(({ unread, onMarkAllRead, onClose }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
            <h3 className="text-h4 text-gray-900">Thông báo</h3>
            <p className="text-text-5 text-gray-500">{unread} chưa đọc</p>
        </div>
        <div className="flex items-center gap-2">
            {unread > 0 && (
                <button
                    onClick={onMarkAllRead}
                    title="Đánh dấu tất cả đã đọc"
                    className="p-1 text-blue-800 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                >
                    <CheckCheck size={16} />
                </button>
            )}
            <button
                onClick={onClose}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
                <X size={16} />
            </button>
        </div>
    </div>
));
DropdownHeader.displayName = "DropdownHeader";

/**
 * NotificationDropdownItem - Mỗi thông báo trong dropdown
 */
const NotificationDropdownItem = memo(({ data, onRead, onDelete }) => {
    const typeUI = NOTIFICATION_TYPE_UI[data.type] || NOTIFICATION_TYPE_UI.OTHER;
    const levelUI = NOTIFICATION_LEVEL_UI[data.level] || NOTIFICATION_LEVEL_UI.DEFAULT;

    const TypeIcon = typeUI.icon;
    const LevelIcon = levelUI.icon;

    return (
        <div
            className={`
                px-4 py-3 cursor-pointer transition-colors
                hover:bg-background
                ${!data.isRead ? "bg-blue-100/40" : ""}
                border-l-2 ${levelUI.color}
            `}
        >
            <div className="flex gap-3">
                {/* Type icon */}
                <div className="shrink-0 mt-0.5 text-gray-700">
                    <TypeIcon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h4 className="text-subhead-5 text-gray-900 truncate">
                                {data.title}
                            </h4>
                            <span className="text-[10px] text-gray-500">
                                {typeUI.label}
                            </span>
                        </div>
                        {/* Level icon */}
                        <LevelIcon size={14} className="shrink-0 text-gray-500 opacity-60" />
                    </div>

                    <p className="text-text-5 text-gray-700 mt-1 line-clamp-2">
                        {data.message}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-500">
                            {formatRelativeTime(data.createdAt)}
                        </span>

                        <div className="flex gap-1">
                            {!data.isRead && (
                                <button
                                    onClick={(e) => onRead(data.notificationId, e)}
                                    className="p-1 text-blue-800 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                                    title="Đánh dấu đã đọc"
                                >
                                    <Check size={14} />
                                </button>
                            )}
                            <button
                                onClick={(e) => onDelete(data.notificationId, e)}
                                className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors cursor-pointer"
                                title="Xóa"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
NotificationDropdownItem.displayName = "NotificationDropdownItem";

/**
 * EmptyState - Khi không có thông báo
 */
const EmptyState = memo(() => (
    <div className="py-8 text-center">
        <Bell size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-text-5 text-gray-500">Không có thông báo nào</p>
    </div>
));
EmptyState.displayName = "EmptyState";

/**
 * DropdownFooter - Footer với nút xem tất cả
 */
const DropdownFooter = memo(({ onViewAll }) => (
    <div className="px-4 py-2.5 border-t border-gray-100 text-center">
        <button
            onClick={onViewAll}
            className="text-text-5 text-blue-800 hover:underline font-semibold cursor-pointer"
        >
            Xem tất cả thông báo
        </button>
    </div>
));
DropdownFooter.displayName = "DropdownFooter";

/* ===================== Main Component ===================== */

/**
 * NotificationBell Component
 * Hiển thị icon chuông thông báo với dropdown danh sách thông báo.
 * Tự động load notifications & stats, lắng nghe socket real-time.
 */
const NotificationBell = memo(({ compact = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const notifications = useSelector(selectMyNotifications);
    const stats = useSelector(selectNotificationStats);
    const loading = useSelector(selectLoadingMyNotifications);

    // Load notifications & stats on mount
    useEffect(() => {
        dispatch(getMyStatsAsync());
        dispatch(getMyNotificationsAsync({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Listen to real-time new notifications via socket
    useSocketEvent(SOCKET_EVENTS.NOTIFICATION.NEW, (data) => {
        if (data?.notification) {
            dispatch(addRealtimeNotification(data.notification));
        }
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    const handleRead = (id, e) => {
        e.stopPropagation();
        dispatch(markNotificationReadAsync(id));
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        dispatch(deleteNotificationAsync(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllReadAsync());
    };

    const handleViewAll = () => {
        setIsOpen(false);
        // TODO: Navigate to notification page nếu cần
    };

    return (
        <div ref={dropdownRef} className="relative inline-flex">
            <BellButton
                unread={stats.unread}
                onClick={() => setIsOpen(!isOpen)}
                compact={compact}
            />

            {isOpen && (
                <div className={compact
                    ? "fixed left-1/2 top-[100px] z-60 w-[min(92vw,24rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
                    : "absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg sm:w-96"
                }>
                    <DropdownHeader
                        unread={stats.unread}
                        onMarkAllRead={handleMarkAllRead}
                        onClose={() => setIsOpen(false)}
                    />

                    <div className="max-h-100 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 && !loading ? (
                            <EmptyState />
                        ) : (
                            notifications.map((n) => (
                                <NotificationDropdownItem
                                    key={n.notificationId}
                                    data={n}
                                    onRead={handleRead}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}

                        {loading && (
                            <div className="py-4 text-center">
                                <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin inline-block" />
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <DropdownFooter onViewAll={handleViewAll} />
                    )}
                </div>
            )}

            {isOpen && compact && (
                <button
                    type="button"
                    className="fixed inset-0 z-50 bg-black/20"
                    onClick={() => setIsOpen(false)}
                    aria-label="Đóng thông báo"
                />
            )}
        </div>
    );
});

NotificationBell.displayName = "NotificationBell";

export default NotificationBell;

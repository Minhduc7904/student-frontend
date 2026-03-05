/**
 * Notification UI Constants
 * 
 * Defines icons, colors, and labels for notification types and levels.
 * Used in NotificationBell dropdown to render notification items.
 */
import {
    Bell,
    BookOpen,
    GraduationCap,
    ClipboardCheck,
    Settings,
    MessageSquare,
    Wallet,
    Info,
    AlertTriangle,
    CheckCircle,
    XCircle,
} from 'lucide-react';

/**
 * Notification Type UI config
 * Maps backend notification types to icons & labels
 */
export const NOTIFICATION_TYPE_UI = {
    SYSTEM: {
        icon: Settings,
        label: 'Hệ thống',
    },
    COURSE: {
        icon: BookOpen,
        label: 'Khoá học',
    },
    LESSON: {
        icon: GraduationCap,
        label: 'Bài học',
    },
    ATTENDANCE: {
        icon: ClipboardCheck,
        label: 'Điểm danh',
    },
    TUITION: {
        icon: Wallet,
        label: 'Học phí',
    },
    GENERAL: {
        icon: MessageSquare,
        label: 'Chung',
    },
    OTHER: {
        icon: Bell,
        label: 'Khác',
    },
};

/**
 * Notification Level UI config
 * Maps backend notification levels to icons & border colors
 */
export const NOTIFICATION_LEVEL_UI = {
    INFO: {
        icon: Info,
        color: 'border-l-blue-800',
        bg: 'bg-blue-100',
    },
    WARNING: {
        icon: AlertTriangle,
        color: 'border-l-yellow-500',
        bg: 'bg-yellow-50',
    },
    SUCCESS: {
        icon: CheckCircle,
        color: 'border-l-green-500',
        bg: 'bg-green-100',
    },
    ERROR: {
        icon: XCircle,
        color: 'border-l-red-500',
        bg: 'bg-red-100',
    },
    DEFAULT: {
        icon: Info,
        color: 'border-l-gray-300',
        bg: 'bg-gray-100',
    },
};

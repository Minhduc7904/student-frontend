/**
 * Date utility functions (Vietnam timezone - Asia/Ho_Chi_Minh)
 */

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

/**
 * Convert to Date safely
 */
function toDate(date) {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Format date to Vietnamese format (DD/MM/YYYY)
 */
export function formatDate(date) {
    const d = toDate(date);
    if (!d) return '';

    return d.toLocaleDateString('vi-VN', {
        timeZone: VN_TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Format date to relative time (e.g., "2 giờ trước")
 */
export function formatRelativeTime(date) {
    const d = toDate(date);
    if (!d) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return formatDate(d);
}

/**
 * Format date to datetime string (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(date) {
    const d = toDate(date);
    if (!d) return '';

    const dateStr = formatDate(d);

    const timeStr = d.toLocaleTimeString('vi-VN', {
        timeZone: VN_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `${dateStr} ${timeStr}`;
}

/**
 * Get time only from date (HH:mm)
 */
export const formatTime = (time) => {
    if (!time) return '';

    const d = new Date(time);
    if (isNaN(d.getTime())) return '';

    // Lấy giờ UTC
    const hoursUTC = d.getUTCHours();
    const minutes = d.getUTCMinutes();

    // Việt Nam = UTC +7
    const hoursVN = (hoursUTC + 7) % 24;

    return `${String(hoursVN).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Get day of month in Vietnam timezone (DD)
 * @param {string|Date} date - Date to extract day
 * @returns {string} Day string (01 - 31)
 */
export function getDay(date) {
    const d = toDate(date);
    if (!d) return '';

    return d.toLocaleDateString('vi-VN', {
        timeZone: VN_TIMEZONE,
        day: '2-digit',
    });
}
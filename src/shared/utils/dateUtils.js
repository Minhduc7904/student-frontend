/**
 * Date utility functions
 */

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
 * @example
 * formatDate(new Date()) // "11/02/2026"
 */
export function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Format date to relative time (e.g., "2 giờ trước")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string in Vietnamese
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 giờ trước"
 */
export function formatRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return formatDate(date);
}

/**
 * Format date to datetime string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime string (DD/MM/YYYY HH:mm)
 * @example
 * formatDateTime(new Date()) // "11/02/2026 14:30"
 */
export function formatDateTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const dateStr = formatDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Get time only from date
 * @param {string|Date} date - Date to format
 * @returns {string} Time string (HH:mm)
 * @example
 * formatTime(new Date()) // "14:30"
 */
export function formatTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
}

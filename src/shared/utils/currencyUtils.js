/**
 * Currency utility functions
 */

/**
 * Format number to Vietnamese currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 * @example
 * formatCurrency(100000) // "100.000 ₫"
 */
export function formatCurrency(amount) {
    if (typeof amount !== 'number') return '0 ₫';
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 * @example
 * formatNumber(1234567) // "1.234.567"
 */
export function formatNumber(number) {
    if (typeof number !== 'number') return '0';
    
    return new Intl.NumberFormat('vi-VN').format(number);
}

/**
 * Parse currency string to number
 * @param {string} currencyStr - Currency string to parse
 * @returns {number} Parsed number
 * @example
 * parseCurrency("100.000 ₫") // 100000
 */
export function parseCurrency(currencyStr) {
    if (!currencyStr) return 0;
    
    const cleaned = currencyStr.replace(/[^\d]/g, '');
    return parseInt(cleaned) || 0;
}

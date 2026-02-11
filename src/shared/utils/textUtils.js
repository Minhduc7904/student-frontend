/**
 * Text utility functions
 */

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 * @example
 * truncateText("Hello World!", 5) // "Hello..."
 */
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Capitalize first letter of string
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 * @example
 * capitalize("hello") // "Hello"
 */
export function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert string to slug
 * @param {string} text - Text to convert
 * @returns {string} Slug string
 * @example
 * slugify("Hello World!") // "hello-world"
 */
export function slugify(text) {
    if (!text) return '';
    
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Remove HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 * @example
 * stripHtml("<p>Hello</p>") // "Hello"
 */
export function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Count words in text
 * @param {string} text - Text to count
 * @returns {number} Word count
 * @example
 * countWords("Hello World") // 2
 */
export function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
}

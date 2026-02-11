/**
 * Common utility functions
 */

/**
 * Generate random ID
 * @returns {string} Random ID
 * @example
 * generateId() // "x7k3p9m"
 */
export function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Generate UUID v4
 * @returns {string} UUID string
 * @example
 * generateUUID() // "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 * @example
 * const cloned = deepClone({ a: 1, b: { c: 2 } })
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * @example
 * const debouncedSearch = debounce(searchFunction, 300)
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 * @example
 * const throttledScroll = throttle(handleScroll, 100)
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 * @example
 * await sleep(1000) // Wait 1 second
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get nested object value safely
 * @param {Object} obj - Object to get value from
 * @param {string} path - Path to property (e.g., "user.profile.name")
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Value at path or default value
 * @example
 * getNestedValue({ user: { name: "John" } }, "user.name") // "John"
 * getNestedValue({ user: {} }, "user.name", "Unknown") // "Unknown"
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }
    
    return result;
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array to remove duplicates from
 * @param {string} key - Optional key for object arrays
 * @returns {Array} Array without duplicates
 * @example
 * removeDuplicates([1, 2, 2, 3]) // [1, 2, 3]
 * removeDuplicates([{id: 1}, {id: 1}, {id: 2}], 'id') // [{id: 1}, {id: 2}]
 */
export function removeDuplicates(array, key = null) {
    if (!Array.isArray(array)) return [];
    
    if (key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
    
    return [...new Set(array)];
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'a', val: 2}, {type: 'b', val: 3}], 'type')
 * // { a: [{type: 'a', val: 1}, {type: 'a', val: 2}], b: [{type: 'b', val: 3}] }
 */
export function groupBy(array, key) {
    if (!Array.isArray(array)) return {};
    
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 * @example
 * sortBy([{age: 30}, {age: 20}], 'age', 'asc') // [{age: 20}, {age: 30}]
 */
export function sortBy(array, key, order = 'asc') {
    if (!Array.isArray(array)) return [];
    
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

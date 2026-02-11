/**
 * Storage Utilities
 * Centralized localStorage/sessionStorage management with error handling
 */

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @param {'local'|'session'} storage - Storage type
 * @returns {any} Parsed value or null
 */
export function getItem(key, storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        const item = storageEngine.getItem(key);
        
        if (!item) {
            return null;
        }

        // Try to parse as JSON, if fails return as string
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    } catch (error) {
        console.error(`Error getting item "${key}" from ${storage}Storage:`, error);
        return null;
    }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified if object)
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean} Success status
 */
export function setItem(key, value, storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        storageEngine.setItem(key, valueToStore);
        return true;
    } catch (error) {
        console.error(`Error setting item "${key}" in ${storage}Storage:`, error);
        return false;
    }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean} Success status
 */
export function removeItem(key, storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        storageEngine.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing item "${key}" from ${storage}Storage:`, error);
        return false;
    }
}

/**
 * Clear all items from storage
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean} Success status
 */
export function clear(storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        storageEngine.clear();
        return true;
    } catch (error) {
        console.error(`Error clearing ${storage}Storage:`, error);
        return false;
    }
}

/**
 * Check if key exists in storage
 * @param {string} key - Storage key
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean}
 */
export function hasItem(key, storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        return storageEngine.getItem(key) !== null;
    } catch (error) {
        console.error(`Error checking item "${key}" in ${storage}Storage:`, error);
        return false;
    }
}

/**
 * Get all keys from storage
 * @param {'local'|'session'} storage - Storage type
 * @returns {string[]} Array of keys
 */
export function getAllKeys(storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        return Object.keys(storageEngine);
    } catch (error) {
        console.error(`Error getting keys from ${storage}Storage:`, error);
        return [];
    }
}

/**
 * Get storage size in bytes
 * @param {'local'|'session'} storage - Storage type
 * @returns {number} Size in bytes
 */
export function getStorageSize(storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        let size = 0;
        for (let key in storageEngine) {
            if (storageEngine.hasOwnProperty(key)) {
                size += storageEngine[key].length + key.length;
            }
        }
        return size;
    } catch (error) {
        console.error(`Error calculating ${storage}Storage size:`, error);
        return 0;
    }
}

/**
 * Set item with expiration time
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expirationMinutes - Expiration time in minutes
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean} Success status
 */
export function setItemWithExpiry(key, value, expirationMinutes, storage = 'local') {
    try {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + (expirationMinutes * 60 * 1000),
        };
        return setItem(key, item, storage);
    } catch (error) {
        console.error(`Error setting item "${key}" with expiry:`, error);
        return false;
    }
}

/**
 * Get item with expiration check
 * @param {string} key - Storage key
 * @param {'local'|'session'} storage - Storage type
 * @returns {any} Value if not expired, null otherwise
 */
export function getItemWithExpiry(key, storage = 'local') {
    try {
        const item = getItem(key, storage);
        
        if (!item) {
            return null;
        }

        // Check if item has expiry property
        if (!item.expiry) {
            return item;
        }

        const now = new Date();
        
        // Check if expired
        if (now.getTime() > item.expiry) {
            removeItem(key, storage);
            return null;
        }

        return item.value;
    } catch (error) {
        console.error(`Error getting item "${key}" with expiry:`, error);
        return null;
    }
}

/**
 * Check if storage is available
 * @param {'local'|'session'} storage - Storage type
 * @returns {boolean}
 */
export function isStorageAvailable(storage = 'local') {
    try {
        const storageEngine = storage === 'session' ? sessionStorage : localStorage;
        const testKey = '__storage_test__';
        storageEngine.setItem(testKey, 'test');
        storageEngine.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove all items matching a prefix
 * @param {string} prefix - Key prefix to match
 * @param {'local'|'session'} storage - Storage type
 * @returns {number} Number of items removed
 */
export function removeItemsByPrefix(prefix, storage = 'local') {
    try {
        const keys = getAllKeys(storage);
        const keysToRemove = keys.filter(key => key.startsWith(prefix));
        
        keysToRemove.forEach(key => removeItem(key, storage));
        
        return keysToRemove.length;
    } catch (error) {
        console.error(`Error removing items with prefix "${prefix}":`, error);
        return 0;
    }
}

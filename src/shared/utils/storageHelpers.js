/**
 * Application-specific Storage Helpers
 * High-level storage functions for auth, user, and app data
 */

import { STORAGE_KEYS } from '../../core/constants';
import { getItem, setItem, removeItem, removeItemsByPrefix } from './storage';

// ============================================
// Authentication Storage
// ============================================

/**
 * Get access token
 * @returns {string|null}
 */
export function getAccessToken() {
    return getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Set access token
 * @param {string} token
 * @returns {boolean}
 */
export function setAccessToken(token) {
    return setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

/**
 * Remove access token
 * @returns {boolean}
 */
export function removeAccessToken() {
    return removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Get refresh token
 * @returns {string|null}
 */
export function getRefreshToken() {
    return getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Set refresh token
 * @param {string} token
 * @returns {boolean}
 */
export function setRefreshToken(token) {
    return setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

/**
 * Remove refresh token
 * @returns {boolean}
 */
export function removeRefreshToken() {
    return removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Set both access and refresh tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {boolean}
 */
export function setAuthTokens(accessToken, refreshToken) {
    const accessSet = setAccessToken(accessToken);
    const refreshSet = setRefreshToken(refreshToken);
    return accessSet && refreshSet;
}

/**
 * Clear all authentication tokens
 * @returns {boolean}
 */
export function clearAuthTokens() {
    const accessRemoved = removeAccessToken();
    const refreshRemoved = removeRefreshToken();
    return accessRemoved && refreshRemoved;
}

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getAccessToken();
}

// ============================================
// User Data Storage
// ============================================

/**
 * Get user info
 * @returns {Object|null}
 */
export function getUserInfo() {
    return getItem(STORAGE_KEYS.USER_INFO);
}

/**
 * Set user info
 * @param {Object} userInfo
 * @returns {boolean}
 */
export function setUserInfo(userInfo) {
    return setItem(STORAGE_KEYS.USER_INFO, userInfo);
}

/**
 * Remove user info
 * @returns {boolean}
 */
export function removeUserInfo() {
    return removeItem(STORAGE_KEYS.USER_INFO);
}

/**
 * Update specific user info fields
 * @param {Object} updates - Fields to update
 * @returns {boolean}
 */
export function updateUserInfo(updates) {
    const currentUser = getUserInfo();
    if (!currentUser) {
        return false;
    }
    const updatedUser = { ...currentUser, ...updates };
    return setUserInfo(updatedUser);
}

/**
 * Get user ID from stored user info
 * @returns {string|number|null}
 */
export function getUserId() {
    const user = getUserInfo();
    return user?.id || null;
}

/**
 * Get user role from stored user info
 * @returns {string|null}
 */
export function getUserRole() {
    const user = getUserInfo();
    return user?.role || null;
}

// ============================================
// Complete Auth Clear
// ============================================

/**
 * Clear all authentication data (tokens + user info)
 * @returns {boolean}
 */
export function clearAuthData() {
    const tokensCleared = clearAuthTokens();
    const userCleared = removeUserInfo();
    return tokensCleared && userCleared;
}

// ============================================
// Theme & Preferences
// ============================================

/**
 * Get theme preference
 * @returns {string} 'light' | 'dark' | 'system'
 */
export function getTheme() {
    return getItem(STORAGE_KEYS.THEME) || 'system';
}

/**
 * Set theme preference
 * @param {'light'|'dark'|'system'} theme
 * @returns {boolean}
 */
export function setTheme(theme) {
    return setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Get language preference
 * @returns {string} Language code
 */
export function getLanguage() {
    return getItem(STORAGE_KEYS.LANGUAGE) || 'vi';
}

/**
 * Set language preference
 * @param {string} language - Language code
 * @returns {boolean}
 */
export function setLanguage(language) {
    return setItem(STORAGE_KEYS.LANGUAGE, language);
}

// ============================================
// App Settings
// ============================================

/**
 * Get app settings
 * @returns {Object}
 */
export function getAppSettings() {
    return getItem(STORAGE_KEYS.APP_SETTINGS) || {};
}

/**
 * Set app settings
 * @param {Object} settings
 * @returns {boolean}
 */
export function setAppSettings(settings) {
    return setItem(STORAGE_KEYS.APP_SETTINGS, settings);
}

/**
 * Update specific app settings
 * @param {Object} updates - Settings to update
 * @returns {boolean}
 */
export function updateAppSettings(updates) {
    const currentSettings = getAppSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    return setAppSettings(updatedSettings);
}

// ============================================
// Recently Viewed
// ============================================

/**
 * Get recently viewed items
 * @param {string} type - Item type (e.g., 'courses', 'exams')
 * @param {number} limit - Maximum items to return
 * @returns {Array}
 */
export function getRecentlyViewed(type, limit = 10) {
    const key = `${STORAGE_KEYS.RECENT_VIEWED}_${type}`;
    const items = getItem(key) || [];
    return items.slice(0, limit);
}

/**
 * Add item to recently viewed
 * @param {string} type - Item type
 * @param {Object} item - Item to add
 * @param {number} maxItems - Maximum items to keep
 * @returns {boolean}
 */
export function addToRecentlyViewed(type, item, maxItems = 10) {
    const key = `${STORAGE_KEYS.RECENT_VIEWED}_${type}`;
    let items = getItem(key) || [];

    // Remove if already exists
    items = items.filter(i => i.id !== item.id);

    // Add to beginning
    items.unshift(item);

    // Limit array size
    items = items.slice(0, maxItems);

    return setItem(key, items);
}

/**
 * Clear recently viewed items
 * @param {string} type - Item type
 * @returns {boolean}
 */
export function clearRecentlyViewed(type) {
    const key = `${STORAGE_KEYS.RECENT_VIEWED}_${type}`;
    return removeItem(key);
}

// ============================================
// Form Draft Storage
// ============================================

/**
 * Save form draft
 * @param {string} formName - Form identifier
 * @param {Object} formData - Form data to save
 * @returns {boolean}
 */
export function saveFormDraft(formName, formData) {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    return setItem(key, formData);
}

/**
 * Get form draft
 * @param {string} formName - Form identifier
 * @returns {Object|null}
 */
export function getFormDraft(formName) {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    return getItem(key);
}

/**
 * Clear form draft
 * @param {string} formName - Form identifier
 * @returns {boolean}
 */
export function clearFormDraft(formName) {
    const key = `${STORAGE_KEYS.FORM_DRAFT}_${formName}`;
    return removeItem(key);
}

/**
 * Clear all form drafts
 * @returns {number} Number of drafts cleared
 */
export function clearAllFormDrafts() {
    return removeItemsByPrefix(STORAGE_KEYS.FORM_DRAFT);
}

// ============================================
// Search History
// ============================================

/**
 * Get search history
 * @param {number} limit - Maximum items to return
 * @returns {Array<string>}
 */
export function getSearchHistory(limit = 10) {
    const history = getItem(STORAGE_KEYS.SEARCH_HISTORY) || [];
    return history.slice(0, limit);
}

/**
 * Add search term to history
 * @param {string} searchTerm
 * @param {number} maxItems - Maximum items to keep
 * @returns {boolean}
 */
export function addToSearchHistory(searchTerm, maxItems = 10) {
    let history = getSearchHistory();

    // Remove if already exists
    history = history.filter(term => term !== searchTerm);

    // Add to beginning
    history.unshift(searchTerm);

    // Limit array size
    history = history.slice(0, maxItems);

    return setItem(STORAGE_KEYS.SEARCH_HISTORY, history);
}

/**
 * Clear search history
 * @returns {boolean}
 */
export function clearSearchHistory() {
    return removeItem(STORAGE_KEYS.SEARCH_HISTORY);
}

// ============================================
// Cache Management
// ============================================

/**
 * Set cached data with timestamp
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttlMinutes - Time to live in minutes
 * @returns {boolean}
 */
export function setCachedData(key, data, ttlMinutes = 30) {
    const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}_${key}`;
    const cacheData = {
        data: data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000,
    };
    return setItem(cacheKey, cacheData);
}

/**
 * Get cached data if not expired
 * @param {string} key - Cache key
 * @returns {any|null}
 */
export function getCachedData(key) {
    const cacheKey = `${STORAGE_KEYS.CACHE_PREFIX}_${key}`;
    const cacheData = getItem(cacheKey);

    if (!cacheData) {
        return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - cacheData.timestamp > cacheData.ttl) {
        removeItem(cacheKey);
        return null;
    }

    return cacheData.data;
}

/**
 * Clear all cached data
 * @returns {number} Number of cache items cleared
 */
export function clearAllCache() {
    return removeItemsByPrefix(STORAGE_KEYS.CACHE_PREFIX);
}

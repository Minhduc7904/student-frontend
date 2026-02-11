/**
 * Local Storage Keys
 */

export const STORAGE_KEYS = {
    // Authentication
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info',
    REMEMBER_ME: 'remember_me',
    
    // User Preferences
    THEME: 'theme',
    LANGUAGE: 'language',
    FONT_SIZE: 'font_size',
    
    // App State
    LAST_ROUTE: 'last_route',
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
    APP_SETTINGS: 'app_settings',
    
    // Cache
    COURSES_CACHE: 'courses_cache',
    EXAMS_CACHE: 'exams_cache',
    CACHE_TIMESTAMP: 'cache_timestamp',
    CACHE_PREFIX: 'cache',
    
    // Recently Viewed
    RECENT_VIEWED: 'recent_viewed',
    
    // Form Drafts
    FORM_DRAFT: 'form_draft',
    
    // Search
    SEARCH_HISTORY: 'search_history',
    
    // Notifications
    NOTIFICATION_SETTINGS: 'notification_settings',
    LAST_NOTIFICATION_CHECK: 'last_notification_check',
};

/**
 * Session Storage Keys
 */
export const SESSION_KEYS = {
    EXAM_SESSION: 'exam_session',
    LESSON_PROGRESS: 'lesson_progress',
    FORM_DATA: 'form_data',
    SCROLL_POSITION: 'scroll_position',
};

/**
 * Cookie Keys
 */
export const COOKIE_KEYS = {
    CONSENT: 'cookie_consent',
    SESSION_ID: 'session_id',
};

/**
 * Socket.IO Event Constants
 * 
 * Defines all socket event names used in the application.
 * Keep in sync with backend socket events.
 */

export const SOCKET_EVENTS = {
    // System events
    SYSTEM: {
        USER_STATUS_CHANGED: 'system:user-status-changed',
        ONLINE_STATS_UPDATED: 'system:online-stats-updated',
    },

    // Notification events
    NOTIFICATION: {
        NEW: 'notification:new',
        READ: 'notification:read',
        DELETED: 'notification:deleted',
        STATS_UPDATED: 'notification:stats-updated',
    },

    // Course events (optional - for future use)
    COURSE: {
        UPDATED: 'course:updated',
        ENROLLMENT_CHANGED: 'course:enrollment-changed',
    },

    // Lesson events (optional - for future use)
    LESSON: {
        COMPLETED: 'lesson:completed',
        PROGRESS_UPDATED: 'lesson:progress-updated',
    },

    // Class session events (optional - for future use)
    CLASS_SESSION: {
        STARTED: 'class-session:started',
        ENDED: 'class-session:ended',
        UPDATED: 'class-session:updated',
    },
};

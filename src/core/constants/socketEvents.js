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

    COMPETITION: {
        ATTEMPT_START: 'competition:attempt:start',
        ATTEMPT_STARTED: 'competition:attempt:started',
        ATTEMPT_SUBSCRIBE: 'competition:attempt:subscribe',
        ATTEMPT_SUBSCRIBED: 'competition:attempt:subscribed',
        ANSWER_SAVE: 'competition:attempt:answer:save',
        ANSWER_SAVED: 'competition:attempt:answer:saved',
        ATTEMPT_FINISH: 'competition:attempt:finish',
        ATTEMPT_FINISHED: 'competition:attempt:finished',
        EXAM_GET: 'competition:exam:get',
        EXAM_LOADED: 'competition:exam:loaded',
        TIME_GET: 'competition:attempt:time:get',
        TIME_SYNC: 'competition:attempt:time:sync',
    },

    TUITION_PAYMENT_INTENT: {
        SUBSCRIBE: 'tuition-payment:intent:subscribe',
        SUBSCRIBED: 'tuition-payment:intent:subscribed',
        STATUS: 'tuition-payment:intent:status',
        UNSUBSCRIBE: 'tuition-payment:intent:unsubscribe',
        UNSUBSCRIBED: 'tuition-payment:intent:unsubscribed',
        PAID: 'tuition-payment:intent:paid',
    },

    // Class session events (optional - for future use)
    CLASS_SESSION: {
        STARTED: 'class-session:started',
        ENDED: 'class-session:ended',
        UPDATED: 'class-session:updated',
    },
};

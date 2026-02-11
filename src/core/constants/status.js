/**
 * Application Status
 */

export const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending',
};

/**
 * Course Status
 */
export const COURSE_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

/**
 * Exam Status
 */
export const EXAM_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    UPCOMING: 'upcoming',
    AVAILABLE: 'available',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    EXPIRED: 'expired',
    GRADED: 'graded',
};

/**
 * User Status
 */
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended',
    PENDING: 'pending',
    BANNED: 'banned',
};

/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
};

/**
 * Notification Status
 */
export const NOTIFICATION_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    ARCHIVED: 'archived',
};

/**
 * Enrollment Status
 */
export const ENROLLMENT_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DROPPED: 'dropped',
    EXPIRED: 'expired',
};

/**
 * Lesson Status
 */
export const LESSON_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    LOCKED: 'locked',
};

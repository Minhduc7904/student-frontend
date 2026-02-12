/**
 * API Endpoints
 */

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/student/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/student/register',
        REFRESH: '/auth/refresh',
    },

    PROFILE: {
        GET: '/student/profile',
        UPDATE: '/student/profile',
    },

    // User/Profile
    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        UPLOAD_AVATAR: '/user/avatar',
        DELETE_AVATAR: '/user/avatar',
        SETTINGS: '/user/settings',
        UPDATE_SETTINGS: '/user/settings',
    },

    // Courses
    COURSES: {
        LIST: '/courses',
        DETAIL: (id) => `/courses/${id}`,
        LESSONS: (id) => `/courses/${id}/lessons`,
        LESSON_DETAIL: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
        ENROLL: (id) => `/courses/${id}/enroll`,
        UNENROLL: (id) => `/courses/${id}/unenroll`,
        PROGRESS: (id) => `/courses/${id}/progress`,
        UPDATE_PROGRESS: (id) => `/courses/${id}/progress`,
        MATERIALS: (id) => `/courses/${id}/materials`,
        DOWNLOAD_MATERIAL: (courseId, materialId) => `/courses/${courseId}/materials/${materialId}/download`,
        REVIEWS: (id) => `/courses/${id}/reviews`,
        ADD_REVIEW: (id) => `/courses/${id}/reviews`,
    },

    // Course Enrollments
    COURSE_ENROLLMENTS: {
        MY: '/course-enrollments/student/my',
    },

    // Exams
    EXAMS: {
        LIST: '/exams',
        DETAIL: (id) => `/exams/${id}`,
        START: (id) => `/exams/${id}/start`,
        SUBMIT: (id) => `/exams/${id}/submit`,
        RESULT: (id) => `/exams/${id}/result`,
        RESULTS: '/exams/results',
        UPCOMING: '/exams/upcoming',
        AVAILABLE: '/exams/available',
        COMPLETED: '/exams/completed',
    },

    // Notifications
    NOTIFICATIONS: {
        MY: "/notifications/my",
        MY_STATS: "/notifications/my/stats",
        MARK_ALL_READ: "/notifications/my/mark-all-read",
        MARK_READ: (id) => `/notifications/${id}/mark-read`,
        DELETE: (id) => `/notifications/${id}`,
    },

    // Statistics
    STATS: {
        DASHBOARD: '/stats/dashboard',
        COURSES: '/stats/courses',
        EXAMS: '/stats/exams',
        PROGRESS: '/stats/progress',
        ACHIEVEMENTS: '/stats/achievements',
    },

    // Search
    SEARCH: {
        GLOBAL: '/search',
        COURSES: '/search/courses',
        LESSONS: '/search/lessons',
        EXAMS: '/search/exams',
    },

    // Admin (nếu có)
    ADMIN: {
        USERS: '/admin/users',
        USER_DETAIL: (id) => `/admin/users/${id}`,
        COURSES: '/admin/courses',
        COURSE_DETAIL: (id) => `/admin/courses/${id}`,
        EXAMS: '/admin/exams',
        EXAM_DETAIL: (id) => `/admin/exams/${id}`,
    },
};

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
        UPLOAD_AVATAR: '/student/profile/avatar',
        CHANGE_PASSWORD: '/student/profile/change-password',
        STATS_DIFFICULTY: '/student/profile/stats/difficulty',
        STATS_ACTIVITY_YEAR: '/student/profile/stats/activity-year',
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
        STUDENT_DETAIL: (id) => `/courses/student/${id}`,
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

    // Lessons
    LESSONS: {
        COURSE_LESSONS: (courseId) => `/lessons/student/course/${courseId}`,
        LESSON_DETAIL: (lessonId) => `/lessons/${lessonId}/student`,
        COMPLETE_LESSON: (courseId, lessonId) => `/lessons/student/${courseId}/lessons/${lessonId}/complete`,
    },

    // Course Enrollments
    COURSE_ENROLLMENTS: {
        MY: '/course-enrollments/student/my',
    },

    // Class Sessions
    CLASS_SESSIONS: {
        MY_SESSIONS: '/class-sessions/student/my-sessions',
    },

    // Learning Items
    LEARNING_ITEMS: {
        MY_HOMEWORKS: '/learning-items/student/my-homeworks',
        SUBMIT_HOMEWORK: (id) => `/learning-items/${id}/submit-homework`,
        HOMEWORK_DETAIL: (id) => `/learning-items/${id}`,
        STUDENT_DETAIL: (id) => `/learning-items/${id}/student`,
        STREAM_VIDEO: (learningItemId, mediaId) => `/learning-items/${learningItemId}/student/video/stream/${mediaId}`,
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

    // Competitions
    COMPETITIONS: {
        STUDENT_RANKING: (id) => `/competitions/${id}/student/ranking`,
        STUDENT_EXAM: (id) => `/competitions/${id}/student/exam`,
        STUDENT_HISTORY: (id) => `/competitions/${id}/student/history`,
        RANKING: (id) => `/competitions/${id}/ranking`,
        PUBLIC_STUDENT: '/competitions/public/student',
        PUBLIC_STUDENT_SUBMITS: '/competitions/public/student-submits',
        PUBLIC_STUDENT_DETAIL: (id) => `/competitions/public/student/${id}`,
    },

    // Tuition Payments
    TUITION_PAYMENTS: {
        MY: '/tuition-payments/my',
        MY_STATS_STATUS: '/tuition-payments/my/stats/status',
        MY_STATS_MONEY: '/tuition-payments/my/stats/money',
    },

    // Do Competition
    DO_COMPETITION: {
        HISTORY: (competitionId) => `/do-competition/${competitionId}/history`,
        START_ATTEMPT: (competitionId) => `/do-competition/${competitionId}/start`,
        GET_REMAINING_TIME: (submitId) => `/do-competition/submit/${submitId}/remaining-time`,
        GET_EXAM: (competitionId) => `/do-competition/${competitionId}/exam`,
        GET_ANSWERS: (submitId) => `/do-competition/submit/${submitId}/answers`,
        SUBMIT_ANSWER: (submitId, answerId) => `/do-competition/submit/${submitId}/answer/${answerId}`,
        FINISH_SUBMIT: (submitId) => `/do-competition/submit/${submitId}/finish`,
        GET_SUBMIT_RESULT: (submitId) => `/do-competition/submit/${submitId}/result`,
    },

    // Question Answers
    QUESTION_ANSWERS: {
        PUBLIC_STUDENT: '/question-answers/public/student',
    },

    // Exam Attempts
    EXAM_ATTEMPTS: {
        PUBLIC_STUDENT: '/exam-attempts/public/student',
    },

    // Media
    MEDIA: {
        UPLOAD: '/media/upload',
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

/**
 * Application Routes
 */

export const ROUTES = {
    // Public Routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    LOADING_REDIRECT: '/loading-redirect',

    // Dashboard
    DASHBOARD: '/dashboard',
    PRACTICE: '/practice',
    PRACTICE_BY_CHAPTER: '/practice/by-chapter',
    PRACTICE_REDO_WRONG: '/practice/redo-wrong',
    COMPETITION: '/competition',
    COMPETITION_DETAIL: (competitionId) => `/competition/${competitionId}`,

    // Course Routes
    COURSE_ENROLLMENTS: '/courses/enrollments',
    COURSE_DETAIL: (id) => `/courses/${id}`,
    COURSE_LESSON: (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`,
    COURSE_LEARNING_ITEM: (courseId, lessonId, learningItemId) => `/courses/${courseId}/lessons/${lessonId}/learning-items/${learningItemId}`,
    COURSE_LEARNING_ITEM_RESULT: (courseId, lessonId, learningItemId, competitionSubmitId) =>
        `/courses/${courseId}/lessons/${lessonId}/learning-items/${learningItemId}/result/${competitionSubmitId}`,

    // Exam Routes
    EXAMS: '/exams',
    EXAM_DETAIL: (id) => `/exams/${id}`,
    EXAM_TYPE_DETAIL: (typeexam, id) => `/exams/${typeexam}/${id}`,
    EXAM_TYPE_ATTEMPT_PRACTICE: (typeExam, id, attemptId) => `/exams/${typeExam}/${id}/attempt/${attemptId}/practice`,
    EXAM_TYPE_ATTEMPT_RESULT: (typeExam, id, attemptId) => `/exams/${typeExam}/${id}/attempt/${attemptId}/result`,
    EXAM_START: (id) => `/exams/${id}/start`,
    EXAM_RESULT: (id) => `/exams/${id}/result`,

    // Competition Routes
    DO_COMPETITION_START: (competitionId) => `/do-competition/${competitionId}/start`,
    DO_HOMEWORK_COMPETITION_START: (courseId, lessonId, learningItemId, homeworkContentId, competitionId) => `/do-competition/courses/${courseId}/lessons/${lessonId}/learning-items/${learningItemId}/homework-contents/${homeworkContentId}/${competitionId}/start`,
    DO_COMPETITION_SUBMIT: (competitionId, submitId) => `/do-competition/${competitionId}/submit/${submitId}`,
    DO_HOMEWORK_COMPETITION_SUBMIT: (courseId, lessonId, learningItemId, homeworkContentId, competitionId, submitId) => `/do-competition/courses/${courseId}/lessons/${lessonId}/learning-items/${learningItemId}/homework-contents/${homeworkContentId}/${competitionId}/submit/${submitId}`,
    COMPETITION_RESULT: (competitionId, submitId) => `/competition/${competitionId}/result/${submitId}`,
    // User Routes
    PROFILE: '/profile',
    STUDENT_PROFILE: '/profile/:id',
    STUDENT_PROFILE_DETAIL: (id) => `/profile/${id}`,
    HISTORY: '/history',
    HISTORY_COMPETITION: '/history/competition',
    HISTORY_QUESTION: '/history/question',
    HISTORY_EXAM: '/history/exam',
    PROFILE_EDIT: '/profile/edit',
    PROFILE_EDIT_INFO: '/profile/edit/infor',
    PROFILE_SETTING: '/profile/setting',
    SETTINGS: '/settings',
    CHANGE_PASSWORD: '/settings/password',

    // Learning Routes
    LIBRARY: '/library',
    PROGRESS: '/progress',
    CALENDAR: '/calendar',
    PAYMENT: '/payment',
    USER_BOOK: '/user-book',

    // Auth Actions
    LOGOUT: '/logout',

    // Notification Routes
    NOTIFICATIONS: '/notifications',

    // Search
    SEARCH: '/search',

    // Error Routes
    NOT_FOUND: '/404',
    FORBIDDEN: '/403',
    SERVER_ERROR: '/500',

    // Admin Routes (nếu có)
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_COURSES: '/admin/courses',
    ADMIN_EXAMS: '/admin/exams',
};

/**
 * Route Metadata
 */
export const ROUTE_META = {
    PUBLIC_ROUTES: [
        ROUTES.HOME,
        ROUTES.LOGIN,
        ROUTES.REGISTER,
        ROUTES.FORGOT_PASSWORD,
        ROUTES.RESET_PASSWORD,
        ROUTES.VERIFY_EMAIL,
        ROUTES.LOGOUT,
        ROUTES.NOT_FOUND,
        ROUTES.FORBIDDEN,
        ROUTES.SERVER_ERROR,
    ],

    AUTH_REQUIRED_ROUTES: [
        ROUTES.COURSES,
        ROUTES.EXAMS,
        ROUTES.PROFILE,
        ROUTES.HISTORY,
        ROUTES.HISTORY_COMPETITION,
        ROUTES.HISTORY_QUESTION,
        ROUTES.HISTORY_EXAM,
        ROUTES.SETTINGS,
        ROUTES.NOTIFICATIONS,
    ],

    ADMIN_ROUTES: [
        ROUTES.ADMIN,
        ROUTES.ADMIN_DASHBOARD,
        ROUTES.ADMIN_USERS,
        ROUTES.ADMIN_COURSES,
        ROUTES.ADMIN_EXAMS,
    ],
};

/**
 * Route Patterns for matching
 */
export const ROUTE_PATTERNS = {
    COURSE_DETAIL: /^\/courses\/(\d+)$/,
    COURSE_LESSON: /^\/courses\/(\d+)\/lessons\/(\d+)$/,
    EXAM_DETAIL: /^\/exams\/(\d+)$/,
    EXAM_TYPE_ATTEMPT_PRACTICE: /^\/exams\/([^/]+)\/(\d+)\/attempt\/(\d+)\/practice$/,
    EXAM_TYPE_ATTEMPT_RESULT: /^\/exams\/([^/]+)\/(\d+)\/attempt\/(\d+)\/result$/,
    EXAM_START: /^\/exams\/(\d+)\/start$/,
    EXAM_RESULT: /^\/exams\/(\d+)\/result$/,
};

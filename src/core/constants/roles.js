/**
 * User Roles
 */
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    GUEST: 'guest',
};

/**
 * Permissions
 */
export const PERMISSIONS = {
    // User Management
    VIEW_USERS: 'view_users',
    CREATE_USER: 'create_user',
    EDIT_USER: 'edit_user',
    DELETE_USER: 'delete_user',
    
    // Course Management
    VIEW_COURSES: 'view_courses',
    CREATE_COURSE: 'create_course',
    EDIT_COURSE: 'edit_course',
    DELETE_COURSE: 'delete_course',
    PUBLISH_COURSE: 'publish_course',
    
    // Exam Management
    VIEW_EXAMS: 'view_exams',
    CREATE_EXAM: 'create_exam',
    EDIT_EXAM: 'edit_exam',
    DELETE_EXAM: 'delete_exam',
    GRADE_EXAM: 'grade_exam',
    
    // Content Management
    VIEW_CONTENT: 'view_content',
    CREATE_CONTENT: 'create_content',
    EDIT_CONTENT: 'edit_content',
    DELETE_CONTENT: 'delete_content',
    
    // Reports
    VIEW_REPORTS: 'view_reports',
    EXPORT_REPORTS: 'export_reports',
};

/**
 * Role-Permission Mapping
 */
export const ROLE_PERMISSIONS = {
    [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
    
    [USER_ROLES.ADMIN]: [
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.CREATE_COURSE,
        PERMISSIONS.EDIT_COURSE,
        PERMISSIONS.PUBLISH_COURSE,
        PERMISSIONS.VIEW_EXAMS,
        PERMISSIONS.CREATE_EXAM,
        PERMISSIONS.EDIT_EXAM,
        PERMISSIONS.GRADE_EXAM,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.EXPORT_REPORTS,
    ],
    
    [USER_ROLES.TEACHER]: [
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.CREATE_COURSE,
        PERMISSIONS.EDIT_COURSE,
        PERMISSIONS.VIEW_EXAMS,
        PERMISSIONS.CREATE_EXAM,
        PERMISSIONS.EDIT_EXAM,
        PERMISSIONS.GRADE_EXAM,
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_CONTENT,
        PERMISSIONS.EDIT_CONTENT,
        PERMISSIONS.VIEW_REPORTS,
    ],
    
    [USER_ROLES.STUDENT]: [
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.VIEW_EXAMS,
        PERMISSIONS.VIEW_CONTENT,
    ],
    
    [USER_ROLES.GUEST]: [
        PERMISSIONS.VIEW_COURSES,
    ],
};

/**
 * Check if role has permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
}

/**
 * Check if user has any of the permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Array of permissions
 * @returns {boolean}
 */
export function hasAnyPermission(role, permissions) {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if user has all permissions
 * @param {string} role - User role
 * @param {Array<string>} permissions - Array of permissions
 * @returns {boolean}
 */
export function hasAllPermissions(role, permissions) {
    return permissions.every(permission => hasPermission(role, permission));
}

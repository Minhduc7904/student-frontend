/**
 * Image Path Constants
 * Centralized image path management
 */

// Base paths
export const IMAGE_PATHS = {
    // Public images (static, no processing)
    PUBLIC: {
        LOGO: '/student/images/logo',
        ICONS: '/student/images/icons',
    },

    // Assets images (processed by Vite)
    ASSETS: {
        COURSES: '@/assets/student/images/courses',
        USERS: '@/assets/student/images/users',
        BACKGROUNDS: '@/assets/student/images/backgrounds',
    }
};

// Default/Placeholder images
export const DEFAULT_IMAGES = {
    USER_AVATAR: '/student/images/users/DefaultAvatar.jpg',
    COURSE_THUMBNAIL: '/student/images/courses/default-course.svg',
    NO_IMAGE: '/student/images/no-image.svg',
};

// Logo variations
export const LOGO = {
    DEFAULT: '/student/images/logo/logo.svg',
    VARIANT1: '/student/images/logo/logo1.svg',
};

// App icons
export const ICONS = {
    FAVICON: '/student/images/icons/favicon.ico',
    APPLE_TOUCH: '/student/images/icons/apple-touch-icon.png',
    ANDROID_192: '/student/images/icons/android-chrome-192x192.png',
    ANDROID_512: '/student/images/icons/android-chrome-512x512.png',
};

/**
 * Get full public image URL
 * @param {string} path - Relative path from /student/images/
 * @returns {string} Full public URL
 */
export function getPublicImageUrl(path) {
    return `/student/images/${path}`;
}

/**
 * Get background image URL from public folder
 * @param {string} name - Image filename
 * @returns {string} Public image URL
 */
export function getBannerImageUrl(name) {
    return `/student/images/backgrounds/${name}`;
}


export function getLogoUrl(variant = 'DEFAULT') {
    return LOGO[variant] || LOGO.DEFAULT;
}

/**
 * Get user avatar URL (with fallback)
 * @param {string|null} avatarUrl - User avatar URL
 * @returns {string} Avatar URL or default
 */
export function getUserAvatarUrl(avatarUrl) {
    return avatarUrl || DEFAULT_IMAGES.USER_AVATAR;
}

/**
 * Get course thumbnail URL (with fallback)
 * @param {string|null} thumbnailUrl - Course thumbnail URL
 * @returns {string} Thumbnail URL or default
 */
export function getCourseThumbnailUrl(thumbnailUrl) {
    return thumbnailUrl || DEFAULT_IMAGES.COURSE_THUMBNAIL;
}

/**
 * Build image srcset for responsive images
 * @param {string} basePath - Base image path without extension
 * @param {string} ext - Image extension (jpg, png, etc.)
 * @param {Array<number>} sizes - Array of image widths [300, 600, 1200]
 * @returns {string} srcset string
 */
export function buildImageSrcSet(basePath, ext, sizes = [300, 600, 1200]) {
    return sizes
        .map(size => `${basePath}-${size}w.${ext} ${size}w`)
        .join(', ');
}

/**
 * Get optimized image URL based on screen size
 * @param {string} basePath - Base image path
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(basePath, size = 'md') {
    const sizeMap = {
        sm: '300',
        md: '600',
        lg: '1200',
    };

    const width = sizeMap[size] || sizeMap.md;
    return `${basePath}-${width}w.jpg`;
}

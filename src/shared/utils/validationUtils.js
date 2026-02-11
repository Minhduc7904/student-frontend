/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 * @example
 * isValidEmail("test@example.com") // true
 * isValidEmail("invalid.email") // false
 */
export function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 * @example
 * isValidPhone("0123456789") // true
 * isValidPhone("+84123456789") // true
 * isValidPhone("123") // false
 */
export function isValidPhone(phone) {
    if (!phone) return false;
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 * @example
 * validatePassword("Pass123!") // { isValid: true, message: "Mật khẩu hợp lệ" }
 */
export function validatePassword(password, options = {}) {
    const {
        minLength = 6,
        requireUppercase = false,
        requireLowercase = false,
        requireNumbers = false,
        requireSpecialChars = false
    } = options;

    if (!password) {
        return { isValid: false, message: 'Mật khẩu không được để trống' };
    }

    if (password.length < minLength) {
        return { isValid: false, message: `Mật khẩu phải có ít nhất ${minLength} ký tự` };
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất một chữ hoa' };
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất một chữ thường' };
    }

    if (requireNumbers && !/[0-9]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất một chữ số' };
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: 'Mật khẩu phải có ít nhất một ký tự đặc biệt' };
    }

    return { isValid: true, message: 'Mật khẩu hợp lệ' };
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 * @example
 * isValidUrl("https://example.com") // true
 * isValidUrl("not a url") // false
 */
export function isValidUrl(url) {
    if (!url) return false;
    
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} Is empty
 * @example
 * isEmpty("   ") // true
 * isEmpty("text") // false
 */
export function isEmpty(str) {
    return !str || str.trim().length === 0;
}

/**
 * Validate student ID format
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} Is valid student ID
 * @example
 * isValidStudentId("HS2026001") // true
 */
export function isValidStudentId(studentId) {
    if (!studentId) return false;
    // Format: HS + year + sequential number (e.g., HS2026001)
    const studentIdRegex = /^HS\d{4}\d{3,}$/;
    return studentIdRegex.test(studentId);
}

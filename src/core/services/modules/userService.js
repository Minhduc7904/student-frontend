/**
 * User Service
 * Handles user profile and settings API calls
 */

import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';
import { setUserInfo, removeUserInfo, getUserInfo, updateUserInfo as updateStoredUser } from '../../../shared/utils';

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile() {
    const response = await axiosClient.get(API_ENDPOINTS.USER.PROFILE);
    
    // Update local storage with latest user info
    if (response.data) {
        setUserInfo(response.data);
    }
    
    return response.data;
}

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export async function updateUserProfile(profileData) {
    const response = await axiosClient.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        profileData
    );
    
    // Update local storage
    if (response.data) {
        setUserInfo(response.data);
    }
    
    return response.data;
}

/**
 * Change user password
 * @param {Object} passwordData - Password change data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @param {string} passwordData.confirmPassword - Confirm new password
 * @returns {Promise<Object>} Success message
 */
export async function changePassword(passwordData) {
    const response = await axiosClient.post(
        API_ENDPOINTS.USER.CHANGE_PASSWORD,
        passwordData
    );
    return response.data;
}

/**
 * Upload user avatar
 * @param {File} file - Avatar image file
 * @returns {Promise<Object>} Updated user data with new avatar URL
 */
export async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosClient.post(
        API_ENDPOINTS.USER.UPLOAD_AVATAR,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    
    // Update local storage
    if (response.data) {
        updateStoredUser(response.data);
    }
    
    return response.data;
}

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats() {
    const response = await axiosClient.get(API_ENDPOINTS.STATS.DASHBOARD);
    return response.data;
}

// Default export
export default {
    getUserProfile,
    updateUserProfile,
    changePassword,
    uploadAvatar,
    getUserStats,
};

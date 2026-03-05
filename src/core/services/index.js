/**
 * Services Index
 * Main export point for all API services
 */

// Export HTTP client
export { axiosClient } from './client';
export * from './client';

// Export error handling utilities
export * from './errors';

// Export service modules
export * from './modules';

// Export socket service
export { socketService } from './socket/socket.service';

// Export constants for backward compatibility
export * from '../constants';

// Default export with all services
import * as authService from './modules/authService';
import * as courseService from './modules/courseService';
import * as examService from './modules/examService';
import * as userService from './modules/userService';
import * as notificationService from './modules/notificationService';

export default {
    auth: authService,
    course: courseService,
    exam: examService,
    user: userService,
    notification: notificationService,
};

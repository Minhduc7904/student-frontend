# Services Directory Structure

This directory contains the organized service layer of the application, handling all API communications and error management.

## Directory Structure

```
services/
├── client/          # HTTP client configuration
│   ├── axiosClient.js      # Axios instance setup
│   ├── interceptors.js     # Request/Response interceptors
│   └── index.js            # Client exports
├── errors/          # Error handling utilities
│   ├── ApiError.js         # Custom error class
│   ├── errorHandler.js     # Error handling functions
│   └── index.js            # Error exports
├── modules/         # API service modules
│   ├── authService.js      # Authentication API
│   ├── courseService.js    # Course management API
│   ├── examService.js      # Exam management API
│   ├── userService.js      # User profile API
│   ├── notificationService.js  # Notifications API
│   └── index.js            # Module exports
└── index.js         # Main service export
```

## Usage

### Import HTTP Client

```javascript
import { axiosClient } from '@/core/services';
// or
import { axiosClient } from '@/core/services/client';
```

### Import Error Handling

```javascript
import { ApiError, handleApiError } from '@/core/services';
// or
import { ApiError, handleApiError } from '@/core/services/errors';
```

### Import Service Modules

```javascript
// Individual imports
import { login, logout } from '@/core/services';
import { getCourses, getCourseDetail } from '@/core/services';

// Namespace imports
import * as authService from '@/core/services/modules/authService';
import * as courseService from '@/core/services/modules/courseService';

// Default import (all services)
import services from '@/core/services';
// Usage: services.auth.login(), services.course.getCourses()
```

## Client Configuration

### Axios Client

The `axiosClient` is pre-configured with:
- Base URL from environment
- Request timeout
- JSON content-type headers
- Authentication token injection
- Automatic token refresh on 401
- Error handling and logging

### Interceptors

**Request Interceptor:**
- Adds Bearer token to Authorization header
- Logs requests in development mode

**Response Interceptor:**
- Logs responses in development mode
- Handles 401 errors with token refresh
- Formats errors using error handler
- Redirects to login on auth failure

## Error Handling

### ApiError Class

Custom error class with status code and data:

```javascript
try {
    await someApiCall();
} catch (error) {
    if (error instanceof ApiError) {
        console.log(error.status);  // HTTP status code
        console.log(error.message); // User-friendly message
        console.log(error.data);    // Raw error data
    }
}
```

### Error Handler Functions

- `handleApiError(error)` - Converts axios errors to ApiError
- `logError(context, error)` - Logs errors in development
- `isUnauthorizedError(error)` - Checks for 401 status
- `isValidationError(error)` - Checks for 422 status
- `isNetworkError(error)` - Checks for network failures

## Service Modules

All service modules follow consistent patterns:

### Authentication Service

```javascript
import { login, logout, register, refreshToken, getCurrentUser } from '@/core/services';

// Login
const { user, accessToken } = await login({ email, password });

// Logout
await logout();

// Register
const { user } = await register({ name, email, password });
```

### Course Service

```javascript
import { getCourses, getCourseDetail, enrollCourse } from '@/core/services';

// Get courses with pagination
const { courses, total } = await getCourses({ page: 1, limit: 10 });

// Get course detail
const course = await getCourseDetail(courseId);

// Enroll in course
await enrollCourse(courseId);
```

### Exam Service

```javascript
import { getExams, startExam, submitExam, getExamResult } from '@/core/services';

// Start exam
const exam = await startExam(examId);

// Submit answers
const result = await submitExam(examId, { answers });
```

### User Service

```javascript
import { getProfile, updateProfile, changePassword } from '@/core/services';

// Get profile
const profile = await getProfile();

// Update profile
await updateProfile({ name, bio });

// Change password
await changePassword({ oldPassword, newPassword });
```

### Notification Service

```javascript
import { getNotifications, markAsRead, getUnreadCount } from '@/core/services';

// Get notifications
const notifications = await getNotifications();

// Mark as read
await markAsRead(notificationId);

// Get unread count
const { count } = await getUnreadCount();
```

## Benefits of This Structure

1. **Separation of Concerns**: HTTP client, error handling, and API modules are separated
2. **Maintainability**: Each module has a single responsibility
3. **Scalability**: Easy to add new service modules
4. **Testability**: Each component can be tested independently
5. **Reusability**: Client and error handling can be reused across modules
6. **Type Safety**: Clear interfaces for each service method
7. **Documentation**: JSDoc comments provide inline documentation

## Adding New Services

To add a new service module:

1. Create new file in `modules/` directory:

```javascript
// modules/newService.js
import { axiosClient } from '../client';
import { API_ENDPOINTS } from '../../constants';

export async function newOperation(params) {
    const response = await axiosClient.get(API_ENDPOINTS.NEW.OPERATION, { params });
    return response.data;
}
```

2. Export from `modules/index.js`:

```javascript
export * from './newService';
```

3. Service is automatically available through main index.js

## Best Practices

1. **Always use axiosClient** - Never create new axios instances
2. **Handle errors properly** - Use try-catch blocks
3. **Log in development** - Use logError utility
4. **Type your responses** - Add JSDoc types for better IDE support
5. **Keep services focused** - One domain per service file
6. **Use constants** - Never hardcode endpoints or keys
7. **Document methods** - Add JSDoc comments for all exported functions

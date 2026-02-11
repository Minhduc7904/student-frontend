# Core Constants

Thư mục này chứa tất cả các constants được sử dụng trong toàn bộ ứng dụng.

## 📁 Cấu trúc

```
constants/
├── index.js           # Main export file
├── apiConfig.js       # API configuration
├── apiEndpoints.js    # API endpoints
├── storageKeys.js     # LocalStorage/SessionStorage keys
├── routes.js          # Application routes
├── httpStatus.js      # HTTP status codes
├── messages.js        # UI messages (error, success, info)
├── status.js          # Application status constants
├── roles.js           # User roles & permissions
└── README.md         # This file
```

## 🚀 Sử dụng

### Import constants

```javascript
// Import từ index chính
import { 
    API_ENDPOINTS, 
    STORAGE_KEYS, 
    ROUTES,
    HTTP_STATUS,
    ERROR_MESSAGES 
} from '@/core/constants';

// Hoặc import từng file riêng
import { API_ENDPOINTS } from '@/core/constants/apiEndpoints';
import { STORAGE_KEYS } from '@/core/constants/storageKeys';
```

## 📚 Chi tiết các Constants

### 1. API Configuration (apiConfig.js)

```javascript
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/core/constants';

console.log(API_BASE_URL); // "http://localhost:3000/api"
console.log(REQUEST_TIMEOUT); // 30000
```

### 2. API Endpoints (apiEndpoints.js)

```javascript
import { API_ENDPOINTS } from '@/core/constants';

// Static endpoints
API_ENDPOINTS.AUTH.LOGIN // "/auth/login"
API_ENDPOINTS.COURSES.LIST // "/courses"

// Dynamic endpoints
API_ENDPOINTS.COURSES.DETAIL(123) // "/courses/123"
API_ENDPOINTS.EXAMS.SUBMIT(456) // "/exams/456/submit"
```

### 3. Storage Keys (storageKeys.js)

```javascript
import { STORAGE_KEYS, SESSION_KEYS } from '@/core/constants';

// LocalStorage
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
localStorage.getItem(STORAGE_KEYS.USER_INFO);

// SessionStorage
sessionStorage.setItem(SESSION_KEYS.EXAM_SESSION, data);
```

### 4. Routes (routes.js)

```javascript
import { ROUTES, ROUTE_META } from '@/core/constants';

// Static routes
navigate(ROUTES.HOME);
navigate(ROUTES.LOGIN);

// Dynamic routes
navigate(ROUTES.COURSE_DETAIL(123));
navigate(ROUTES.EXAM_RESULT(456));

// Check if route is public
const isPublic = ROUTE_META.PUBLIC_ROUTES.includes(currentRoute);
```

### 5. HTTP Status (httpStatus.js)

```javascript
import { 
    HTTP_STATUS, 
    isSuccessStatus, 
    isClientError 
} from '@/core/constants';

if (response.status === HTTP_STATUS.OK) {
    // Success
}

if (isClientError(response.status)) {
    // Handle client error
}
```

### 6. Messages (messages.js)

```javascript
import { 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES,
    INFO_MESSAGES 
} from '@/core/constants';

// Show error
toast.error(ERROR_MESSAGES.NETWORK_ERROR);

// Show success
toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);

// Show loading
toast.info(INFO_MESSAGES.LOADING);
```

### 7. Status (status.js)

```javascript
import { 
    STATUS, 
    COURSE_STATUS, 
    EXAM_STATUS 
} from '@/core/constants';

// Application status
if (state.status === STATUS.LOADING) {
    // Show loading
}

// Course status
if (course.status === COURSE_STATUS.COMPLETED) {
    // Show completion badge
}

// Exam status
if (exam.status === EXAM_STATUS.AVAILABLE) {
    // Show start button
}
```

### 8. Roles & Permissions (roles.js)

```javascript
import { 
    USER_ROLES, 
    PERMISSIONS,
    hasPermission 
} from '@/core/constants';

// Check role
if (user.role === USER_ROLES.ADMIN) {
    // Show admin panel
}

// Check permission
if (hasPermission(user.role, PERMISSIONS.CREATE_COURSE)) {
    // Show create course button
}
```

## 🎯 Best Practices

### 1. Không hard-code giá trị

❌ **Sai:**
```javascript
if (response.status === 401) {
    // ...
}

if (course.status === 'completed') {
    // ...
}
```

✅ **Đúng:**
```javascript
import { HTTP_STATUS, COURSE_STATUS } from '@/core/constants';

if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    // ...
}

if (course.status === COURSE_STATUS.COMPLETED) {
    // ...
}
```

### 2. Sử dụng dynamic endpoints

❌ **Sai:**
```javascript
const url = `/courses/${courseId}`;
```

✅ **Đúng:**
```javascript
import { API_ENDPOINTS } from '@/core/constants';

const url = API_ENDPOINTS.COURSES.DETAIL(courseId);
```

### 3. Sử dụng message constants

❌ **Sai:**
```javascript
toast.error('Lỗi kết nối mạng');
```

✅ **Đúng:**
```javascript
import { ERROR_MESSAGES } from '@/core/constants';

toast.error(ERROR_MESSAGES.NETWORK_ERROR);
```

### 4. Type-safe với TypeScript

```typescript
import { USER_ROLES, COURSE_STATUS } from '@/core/constants';

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
type CourseStatus = typeof COURSE_STATUS[keyof typeof COURSE_STATUS];

interface User {
    role: UserRole;
}

interface Course {
    status: CourseStatus;
}
```

## 🆕 Thêm Constants Mới

### 1. Thêm vào file hiện có

```javascript
// status.js

export const ASSIGNMENT_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    SUBMITTED: 'submitted',
    GRADED: 'graded',
};
```

### 2. Tạo file mới (nếu cần category mới)

```javascript
// theme.js

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
};

export const COLORS = {
    PRIMARY: '#3B82F6',
    SECONDARY: '#8B5CF6',
    SUCCESS: '#10B981',
    ERROR: '#EF4444',
    WARNING: '#F59E0B',
};
```

### 3. Export trong index.js

```javascript
// index.js

export * from './theme';
```

## 🔄 Migration từ constants cũ

Nếu có code cũ import từ `services/constants`, vẫn sẽ hoạt động nhờ backward compatibility:

```javascript
// Old (vẫn hoạt động)
import { API_ENDPOINTS } from '@/core/services/constants';

// New (recommended)
import { API_ENDPOINTS } from '@/core/constants';
```

## 🌍 Environment Variables

Constants có thể sử dụng environment variables:

```javascript
// .env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=production

// apiConfig.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

## 📝 Naming Conventions

- **Constants objects**: UPPER_SNAKE_CASE (`API_ENDPOINTS`, `USER_ROLES`)
- **Individual constants**: UPPER_SNAKE_CASE (`ACCESS_TOKEN`, `LOGIN_SUCCESS`)
- **Function helpers**: camelCase (`hasPermission`, `isSuccessStatus`)

## 🔗 Liên quan

- [Services Documentation](../services/README.md)
- [Environment Variables](.env.example)

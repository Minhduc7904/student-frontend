# Storage Utilities Documentation

Centralized storage management utilities for localStorage, sessionStorage, and cookies with automatic JSON handling, expiration support, and comprehensive error handling.

## File Structure

```
shared/utils/
├── storage.js          # Core storage functions (low-level)
├── storageHelpers.js   # Application-specific helpers (high-level)
└── index.js           # Export all utilities
```

## Core Storage Functions (storage.js)

### Basic Operations

#### `getItem(key, storage = 'local')`
Get item from storage with automatic JSON parsing.

```javascript
import { getItem } from '@/shared/utils';

// Get from localStorage
const userData = getItem('user_info');

// Get from sessionStorage
const tempData = getItem('temp_data', 'session');
```

#### `setItem(key, value, storage = 'local')`
Set item in storage with automatic JSON stringification.

```javascript
import { setItem } from '@/shared/utils';

// Store object (auto stringify)
setItem('user_info', { name: 'John', age: 25 });

// Store string
setItem('theme', 'dark');

// Store in sessionStorage
setItem('form_data', formValues, 'session');
```

#### `removeItem(key, storage = 'local')`
Remove item from storage.

```javascript
import { removeItem } from '@/shared/utils';

removeItem('user_info');
removeItem('temp_data', 'session');
```

#### `clear(storage = 'local')`
Clear all items from storage.

```javascript
import { clear } from '@/shared/utils';

clear(); // Clear localStorage
clear('session'); // Clear sessionStorage
```

### Utility Functions

#### `hasItem(key, storage = 'local')`
Check if key exists in storage.

```javascript
if (hasItem('user_info')) {
    console.log('User is logged in');
}
```

#### `getAllKeys(storage = 'local')`
Get all keys from storage.

```javascript
const keys = getAllKeys();
console.log('Storage keys:', keys);
```

#### `getStorageSize(storage = 'local')`
Get storage size in bytes.

```javascript
const size = getStorageSize();
console.log(`Storage size: ${size} bytes`);
```

### Expiration Support

#### `setItemWithExpiry(key, value, expirationMinutes, storage = 'local')`
Store item with expiration time.

```javascript
// Store for 30 minutes
setItemWithExpiry('temp_token', 'abc123', 30);

// Store for 24 hours
setItemWithExpiry('cache_data', data, 24 * 60);
```

#### `getItemWithExpiry(key, storage = 'local')`
Get item and check expiration.

```javascript
const token = getItemWithExpiry('temp_token');
if (token) {
    console.log('Token is still valid:', token);
} else {
    console.log('Token expired or not found');
}
```

### Advanced Operations

#### `removeItemsByPrefix(prefix, storage = 'local')`
Remove all items matching a prefix.

```javascript
// Remove all cache items
removeItemsByPrefix('cache_');

// Remove all form drafts
removeItemsByPrefix('form_draft_');
```

#### `isStorageAvailable(storage = 'local')`
Check if storage is available.

```javascript
if (isStorageAvailable()) {
    console.log('LocalStorage is available');
} else {
    console.log('LocalStorage is disabled');
}
```

## Application-Specific Helpers (storageHelpers.js)

High-level functions for common app operations.

### Authentication Storage

#### Token Management

```javascript
import { 
    getAccessToken, 
    setAccessToken, 
    removeAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
    setAuthTokens,
    clearAuthTokens,
    isAuthenticated
} from '@/shared/utils';

// Get tokens
const accessToken = getAccessToken();
const refreshToken = getRefreshToken();

// Set tokens
setAccessToken('eyJhbGc...');
setRefreshToken('eyJhbGc...');

// Or set both at once
setAuthTokens('access_token_here', 'refresh_token_here');

// Remove tokens
clearAuthTokens();

// Check authentication
if (isAuthenticated()) {
    console.log('User is logged in');
}
```

#### User Data Management

```javascript
import { 
    getUserInfo, 
    setUserInfo, 
    removeUserInfo,
    updateUserInfo,
    getUserId,
    getUserRole
} from '@/shared/utils';

// Get user info
const user = getUserInfo();

// Set user info
setUserInfo({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student'
});

// Update specific fields
updateUserInfo({ name: 'Jane Doe' });

// Get specific fields
const userId = getUserId();
const role = getUserRole();

// Remove user info
removeUserInfo();
```

#### Complete Auth Clear

```javascript
import { clearAuthData } from '@/shared/utils';

// Clear all auth data (tokens + user info)
clearAuthData();
```

### Theme & Preferences

```javascript
import { 
    getTheme, 
    setTheme, 
    getLanguage, 
    setLanguage 
} from '@/shared/utils';

// Theme
const theme = getTheme(); // 'light' | 'dark' | 'system'
setTheme('dark');

// Language
const lang = getLanguage(); // 'vi' | 'en'
setLanguage('en');
```

### App Settings

```javascript
import { 
    getAppSettings, 
    setAppSettings, 
    updateAppSettings 
} from '@/shared/utils';

// Get all settings
const settings = getAppSettings();

// Set all settings
setAppSettings({
    notifications: true,
    autoSave: true,
    displayMode: 'grid'
});

// Update specific settings
updateAppSettings({
    notifications: false
});
```

### Recently Viewed

```javascript
import { 
    getRecentlyViewed, 
    addToRecentlyViewed, 
    clearRecentlyViewed 
} from '@/shared/utils';

// Get recently viewed items
const recentCourses = getRecentlyViewed('courses', 5);

// Add item to recently viewed
addToRecentlyViewed('courses', {
    id: 123,
    name: 'React Fundamentals',
    thumbnail: '/images/course.jpg'
}, 10); // Keep max 10 items

// Clear recently viewed
clearRecentlyViewed('courses');
```

### Form Draft Storage

```javascript
import { 
    saveFormDraft, 
    getFormDraft, 
    clearFormDraft,
    clearAllFormDrafts 
} from '@/shared/utils';

// Save form draft
saveFormDraft('contact_form', {
    name: 'John',
    email: 'john@example.com',
    message: 'Hello...'
});

// Get form draft
const draft = getFormDraft('contact_form');

// Clear specific draft
clearFormDraft('contact_form');

// Clear all drafts
clearAllFormDrafts();
```

### Search History

```javascript
import { 
    getSearchHistory, 
    addToSearchHistory, 
    clearSearchHistory 
} from '@/shared/utils';

// Get search history
const history = getSearchHistory(10);

// Add search term
addToSearchHistory('React hooks');

// Clear history
clearSearchHistory();
```

### Cache Management

```javascript
import { 
    setCachedData, 
    getCachedData, 
    clearAllCache 
} from '@/shared/utils';

// Cache data for 30 minutes
setCachedData('courses_list', coursesData, 30);

// Get cached data (returns null if expired)
const cachedCourses = getCachedData('courses_list');

// Clear all cache
clearAllCache();
```

## Usage in Services

### Authentication Service Example

```javascript
// services/modules/authService.js
import { setAuthTokens, setUserInfo, clearAuthData } from '@/shared/utils';

export async function login(credentials) {
    const response = await axiosClient.post('/auth/login', credentials);
    
    // Store tokens and user info
    setAuthTokens(response.data.accessToken, response.data.refreshToken);
    setUserInfo(response.data.user);
    
    return response.data;
}

export async function logout() {
    await axiosClient.post('/auth/logout');
    clearAuthData();
}
```

### Interceptor Example

```javascript
// services/client/interceptors.js
import { getAccessToken, setAccessToken, clearAuthData } from '@/shared/utils';

export function requestInterceptor(config) {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}

export async function responseErrorInterceptor(error) {
    if (error.response?.status === 401) {
        const newToken = await refreshToken();
        setAccessToken(newToken);
        return retryRequest(error.config);
    }
    
    if (error.response?.status === 403) {
        clearAuthData();
        redirectToLogin();
    }
    
    return Promise.reject(error);
}
```

### User Service Example

```javascript
// services/modules/userService.js
import { setUserInfo, updateUserInfo } from '@/shared/utils';

export async function getUserProfile() {
    const response = await axiosClient.get('/user/profile');
    setUserInfo(response.data);
    return response.data;
}

export async function updateProfile(data) {
    const response = await axiosClient.put('/user/profile', data);
    updateUserInfo(response.data);
    return response.data;
}
```

## Usage in Components

### Authentication Check

```javascript
// components/ProtectedRoute.jsx
import { isAuthenticated, getUserRole } from '@/shared/utils';

function ProtectedRoute({ children, requiredRole }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    
    if (requiredRole && getUserRole() !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
}
```

### Form with Auto-Save

```javascript
// components/ContactForm.jsx
import { saveFormDraft, getFormDraft, clearFormDraft } from '@/shared/utils';
import { useEffect } from 'react';

function ContactForm() {
    const [formData, setFormData] = useState({});
    
    // Load draft on mount
    useEffect(() => {
        const draft = getFormDraft('contact_form');
        if (draft) {
            setFormData(draft);
        }
    }, []);
    
    // Auto-save on change
    const handleChange = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        saveFormDraft('contact_form', updated);
    };
    
    // Clear draft on submit
    const handleSubmit = async () => {
        await submitForm(formData);
        clearFormDraft('contact_form');
    };
    
    return (/* form JSX */);
}
```

### Theme Switcher

```javascript
// components/ThemeSwitcher.jsx
import { getTheme, setTheme } from '@/shared/utils';
import { useState, useEffect } from 'react';

function ThemeSwitcher() {
    const [theme, setThemeState] = useState(getTheme());
    
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setThemeState(newTheme);
        applyTheme(newTheme);
    };
    
    return (
        <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
        </select>
    );
}
```

## Error Handling

All storage functions include error handling and will:
- Log errors in development mode
- Return `null` or `false` on error (never throw)
- Continue execution even if storage is unavailable

```javascript
// Safe to use without try-catch
const user = getUserInfo(); // Returns null if error
const success = setUserInfo(data); // Returns false if error
```

## Browser Compatibility

Check storage availability before critical operations:

```javascript
import { isStorageAvailable } from '@/shared/utils';

if (!isStorageAvailable()) {
    console.warn('LocalStorage is not available');
    // Use alternative storage or inform user
}
```

## Best Practices

1. **Use High-Level Helpers**: Prefer `storageHelpers.js` functions for app-specific operations
2. **Type Safety**: Add JSDoc types for better IDE support
3. **Expiration**: Use expiration for temporary data
4. **Prefixes**: Use consistent prefixes for related items
5. **Clear on Logout**: Always clear auth data on logout
6. **Error Handling**: Functions handle errors gracefully
7. **Bundle Size**: Only import what you need

## Storage Keys

All storage keys are defined in `core/constants/storageKeys.js`:

```javascript
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info',
    THEME: 'theme',
    LANGUAGE: 'language',
    // ... more keys
};
```

Always use constants instead of hardcoded strings!

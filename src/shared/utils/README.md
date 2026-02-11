# Shared Utils

Thư mục này chứa các utility functions được sử dụng chung trong toàn bộ ứng dụng.

## 📁 Cấu trúc

```
utils/
├── index.js              # Main export file
├── dateUtils.js          # Date & time utilities
├── currencyUtils.js      # Currency & number formatting
├── textUtils.js          # Text manipulation utilities
├── validationUtils.js    # Validation functions
├── commonUtils.js        # Common utilities
└── README.md            # This file
```

## 📚 Danh sách Utilities

### 🗓️ dateUtils.js

**Functions:**
- `formatDate(date)` - Format date to DD/MM/YYYY
- `formatRelativeTime(date)` - Format to relative time (e.g., "2 giờ trước")
- `formatDateTime(date)` - Format to DD/MM/YYYY HH:mm
- `formatTime(date)` - Get time only (HH:mm)

**Ví dụ:**
```javascript
import { formatDate, formatRelativeTime } from '@/shared/utils';

formatDate(new Date()); // "11/02/2026"
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 giờ trước"
```

### 💰 currencyUtils.js

**Functions:**
- `formatCurrency(amount)` - Format to Vietnamese currency
- `formatNumber(number)` - Format number with thousands separator
- `parseCurrency(currencyStr)` - Parse currency string to number

**Ví dụ:**
```javascript
import { formatCurrency, formatNumber } from '@/shared/utils';

formatCurrency(100000); // "100.000 ₫"
formatNumber(1234567); // "1.234.567"
```

### ✏️ textUtils.js

**Functions:**
- `truncateText(text, maxLength)` - Truncate text with ellipsis
- `capitalize(text)` - Capitalize first letter
- `slugify(text)` - Convert to URL-friendly slug
- `stripHtml(html)` - Remove HTML tags
- `countWords(text)` - Count words in text

**Ví dụ:**
```javascript
import { truncateText, slugify, capitalize } from '@/shared/utils';

truncateText("Hello World!", 5); // "Hello..."
slugify("Toán học nâng cao"); // "toan-hoc-nang-cao"
capitalize("hello"); // "Hello"
```

### ✅ validationUtils.js

**Functions:**
- `isValidEmail(email)` - Validate email format
- `isValidPhone(phone)` - Validate Vietnamese phone number
- `validatePassword(password, options)` - Validate password strength
- `isValidUrl(url)` - Validate URL format
- `isEmpty(str)` - Check if string is empty
- `isValidStudentId(studentId)` - Validate student ID format

**Ví dụ:**
```javascript
import { isValidEmail, isValidPhone, validatePassword } from '@/shared/utils';

isValidEmail("test@example.com"); // true
isValidPhone("0123456789"); // true
validatePassword("Pass123!"); 
// { isValid: true, message: "Mật khẩu hợp lệ" }
```

### 🔧 commonUtils.js

**Functions:**
- `generateId()` - Generate random ID
- `generateUUID()` - Generate UUID v4
- `deepClone(obj)` - Deep clone object
- `debounce(func, wait)` - Debounce function
- `throttle(func, limit)` - Throttle function
- `sleep(ms)` - Async sleep/delay
- `getNestedValue(obj, path, defaultValue)` - Safely get nested property
- `removeDuplicates(array, key)` - Remove duplicates from array
- `groupBy(array, key)` - Group array by key
- `sortBy(array, key, order)` - Sort array by key

**Ví dụ:**
```javascript
import { 
    generateId, 
    debounce, 
    getNestedValue,
    groupBy 
} from '@/shared/utils';

// Generate ID
const id = generateId(); // "x7k3p9m"

// Debounce
const debouncedSearch = debounce((query) => {
    console.log('Searching:', query);
}, 300);

// Safe property access
const user = { profile: { name: "John" } };
getNestedValue(user, "profile.name"); // "John"
getNestedValue(user, "profile.age", 0); // 0

// Group array
const items = [
    { type: 'a', value: 1 },
    { type: 'a', value: 2 },
    { type: 'b', value: 3 }
];
groupBy(items, 'type');
// { a: [{ type: 'a', value: 1 }, { type: 'a', value: 2 }], b: [{ type: 'b', value: 3 }] }
```

## 🎯 Quy tắc sử dụng

### 1. Import từ index.js
Luôn import từ file index chính, không import trực tiếp từ các file con:

✅ **Đúng:**
```javascript
import { formatDate, isValidEmail } from '@/shared/utils';
```

❌ **Sai:**
```javascript
import { formatDate } from '@/shared/utils/dateUtils';
```

### 2. Thêm function mới

Khi thêm utility function mới:

1. **Xác định category**: Xem function thuộc nhóm nào (date, text, validation, etc.)

2. **Thêm vào file tương ứng**:
```javascript
// textUtils.js

/**
 * Your new function description
 * @param {type} param - Parameter description
 * @returns {type} Return description
 * @example
 * yourFunction("example") // result
 */
export function yourFunction(param) {
    // Implementation
}
```

3. **Cập nhật README** (file này) với function mới

4. **Viết test** (nếu có setup testing)

### 3. Naming conventions

- Function names: **camelCase** (`formatDate`, `isValidEmail`)
- Boolean functions: Prefix với `is`, `has`, `should` (`isValid`, `hasValue`)
- Format functions: Prefix với `format` (`formatDate`, `formatCurrency`)

### 4. Documentation

Mỗi function phải có JSDoc comment đầy đủ:
- Description
- `@param` - Parameters với type và description
- `@returns` - Return type và description
- `@example` - Usage example

## 💡 Best Practices

### 1. Pure Functions
Utility functions nên là pure functions (không có side effects):

✅ **Đúng:**
```javascript
export function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}
```

❌ **Sai:**
```javascript
let lastDate;
export function formatDate(date) {
    lastDate = date; // Side effect!
    return new Date(date).toLocaleDateString('vi-VN');
}
```

### 2. Input Validation
Luôn validate input và handle edge cases:

```javascript
export function formatDate(date) {
    if (!date) return ''; // Handle null/undefined
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Handle invalid date
    
    // Format logic
}
```

### 3. Performance
Cache kết quả nếu cần thiết:

```javascript
const cache = new Map();

export function expensiveOperation(input) {
    if (cache.has(input)) {
        return cache.get(input);
    }
    
    const result = /* expensive calculation */;
    cache.set(input, result);
    return result;
}
```

### 4. Reusability
Tách logic phức tạp thành các functions nhỏ hơn:

```javascript
// Helper function (không export nếu chỉ dùng internal)
function padZero(num) {
    return String(num).padStart(2, '0');
}

// Main function
export function formatTime(date) {
    const d = new Date(date);
    const hours = padZero(d.getHours());
    const minutes = padZero(d.getMinutes());
    return `${hours}:${minutes}`;
}
```

## 🔍 Testing

Khi có setup testing, mỗi utility function nên có unit tests:

```javascript
// textUtils.test.js
import { truncateText } from './textUtils';

describe('truncateText', () => {
    it('should truncate long text', () => {
        expect(truncateText('Hello World', 5)).toBe('Hello...');
    });
    
    it('should not truncate short text', () => {
        expect(truncateText('Hi', 5)).toBe('Hi');
    });
    
    it('should handle empty input', () => {
        expect(truncateText('', 5)).toBe('');
    });
});
```

## 📖 Tài liệu tham khảo

- [JavaScript Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

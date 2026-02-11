# Features Folder Structure

Thư mục này chứa tất cả các tính năng (features/pages) của ứng dụng. Mỗi feature được tổ chức trong một folder riêng với cấu trúc sau:

## Cấu trúc mỗi Feature

```
features/
  feature-name/
    index.jsx              # Component chính của feature
    components/            # Các component riêng cho feature này
      Component1.jsx
      Component2.jsx
    slice.js              # Redux slice (nếu feature cần state management)
    layout/               # Layout riêng (nếu có)
      CustomLayout.jsx
    hooks/                # Custom hooks riêng cho feature (nếu có)
      useFeature.js
    utils/                # Utility functions riêng (nếu có)
      helpers.js
```

## Quy tắc đặt tên

- **Folder name**: Sử dụng kebab-case (ví dụ: `user-profile`, `course-detail`)
- **Component files**: Sử dụng PascalCase (ví dụ: `UserProfile.jsx`, `CourseCard.jsx`)
- **Utility files**: Sử dụng camelCase (ví dụ: `slice.js`, `helpers.js`)

## Features hiện có

### 1. home
Trang chủ của ứng dụng
- `index.jsx`: Trang chủ chính với các card điều hướng

### 2. courses
Trang danh sách khóa học
- `index.jsx`: Component chính hiển thị danh sách khóa học
- `components/CourseCard.jsx`: Card hiển thị thông tin từng khóa học

### 3. course-detail
Trang chi tiết khóa học
- `index.jsx`: Component chính hiển thị chi tiết khóa học
- `components/LessonItem.jsx`: Component hiển thị từng bài học

### 4. exams
Trang danh sách bài kiểm tra
- `index.jsx`: Component chính hiển thị danh sách bài kiểm tra
- `components/ExamCard.jsx`: Card hiển thị thông tin từng bài kiểm tra

### 5. profile
Trang hồ sơ cá nhân
- `index.jsx`: Component chính trang hồ sơ
- `components/ProfileInfo.jsx`: Component hiển thị thông tin cá nhân
- `components/ProfileStats.jsx`: Component hiển thị thống kê

### 6. login
Trang đăng nhập
- `index.jsx`: Component chính trang đăng nhập
- `components/LoginForm.jsx`: Form đăng nhập

### 7. not-found
Trang 404
- `index.jsx`: Component trang không tìm thấy

## Khi nào nên tạo Redux Slice?

Tạo file `slice.js` trong feature khi:
- Feature cần quản lý state phức tạp
- State cần được chia sẻ với nhiều components
- Cần thực hiện API calls với async thunks
- Cần lưu trữ data từ server

### Ví dụ slice.js:

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk để fetch data
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async () => {
        const response = await fetch('/api/courses');
        return response.json();
    }
);

const coursesSlice = createSlice({
    name: 'courses',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        // Sync actions
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default coursesSlice.reducer;
```

Sau đó import vào `core/store/index.js`:

```javascript
import coursesReducer from '../../features/courses/slice';

export const store = configureStore({
    reducer: {
        courses: coursesReducer,
        // ... other reducers
    }
});
```

## Khi nào nên tạo Layout riêng?

Tạo folder `layout/` trong feature khi:
- Feature cần layout khác với MainLayout
- Cần sidebar hoặc header riêng
- Layout có logic phức tạp chỉ dùng cho feature đó

## Best Practices

1. **Giữ components nhỏ và tập trung**: Mỗi component nên làm một việc duy nhất
2. **Tái sử dụng**: Nếu component được dùng ở nhiều features, di chuyển nó sang `shared/components`
3. **Đặt tên rõ ràng**: Tên file và component nên mô tả rõ chức năng
4. **Tách biệt logic**: Tách business logic ra khỏi UI components
5. **Code splitting**: Sử dụng lazy loading cho các features lớn

## Thêm Feature mới

1. Tạo folder mới trong `features/`
2. Tạo `index.jsx` làm entry point
3. Tạo `components/` folder cho các components con
4. Tạo `slice.js` nếu cần state management
5. Import vào `routes/index.jsx`
6. Cập nhật README.md này

## Ví dụ thêm feature mới:

```bash
# Tạo cấu trúc thư mục
features/
  notifications/
    index.jsx
    components/
      NotificationItem.jsx
      NotificationList.jsx
    slice.js
```

```javascript
// features/notifications/index.jsx
import NotificationList from './components/NotificationList';

function NotificationsPage() {
    return (
        <div>
            <h1>Thông báo</h1>
            <NotificationList />
        </div>
    );
}

export default NotificationsPage;
```

```javascript
// routes/index.jsx
import NotificationsPage from '../features/notifications';

// Thêm route
{
    path: 'notifications',
    element: <NotificationsPage />
}
```

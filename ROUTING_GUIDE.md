# Student Frontend - Routing Setup

## Cấu trúc Routing

Dự án đã được cài đặt routing với React Router v6. Dưới đây là cấu trúc và hướng dẫn sử dụng.

### Cấu trúc thư mục

```
src/
├── pages/              # Các trang chính
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseDetailPage.jsx
│   ├── ExamsPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── components/
│   └── layout/
│       └── MainLayout.jsx    # Layout chính với navbar và footer
├── routes/
│   └── index.jsx            # Cấu hình routing
└── App.jsx                  # Root component với RouterProvider
```

### Danh sách Routes

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | HomePage | Trang chủ - Dashboard |
| `/login` | LoginPage | Trang đăng nhập |
| `/courses` | CoursesPage | Danh sách khóa học |
| `/courses/:id` | CourseDetailPage | Chi tiết khóa học |
| `/exams` | ExamsPage | Danh sách bài kiểm tra |
| `/profile` | ProfilePage | Hồ sơ cá nhân |
| `*` | NotFoundPage | Trang 404 |

### Tính năng đã implement

#### 1. **MainLayout**
- Navigation bar với active state
- Footer thông tin
- Sử dụng `<Outlet />` để render child routes

#### 2. **HomePage** 
- Dashboard chính với cards điều hướng
- Hiển thị thông báo mới
- Links đến các trang chính

#### 3. **CoursesPage**
- Danh sách khóa học đã đăng ký
- Progress bar cho từng khóa học
- Card layout với thông tin giáo viên

#### 4. **CourseDetailPage**
- Chi tiết khóa học với params `:id`
- Danh sách bài học
- Trạng thái hoàn thành của từng bài

#### 5. **ExamsPage**
- Danh sách bài kiểm tra
- Phân loại theo trạng thái (upcoming, available, completed)
- Hiển thị điểm số

#### 6. **ProfilePage**
- Thông tin cá nhân
- Thống kê học tập
- Thành tựu

#### 7. **LoginPage**
- Form đăng nhập
- Không có layout (fullscreen)

### Cách chạy dự án

```bash
cd student_frontend
npm install
npm run dev
```

### Cách sử dụng routing trong code

#### Navigation với Link
```jsx
import { Link } from 'react-router-dom';

<Link to="/courses">Đi đến khóa học</Link>
```

#### Navigation programmatic
```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/profile');
    };
    
    return <button onClick={handleClick}>Xem hồ sơ</button>;
}
```

#### Lấy params từ URL
```jsx
import { useParams } from 'react-router-dom';

function CourseDetailPage() {
    const { id } = useParams();
    // id sẽ là giá trị từ URL: /courses/123 -> id = "123"
}
```

#### Kiểm tra active route
```jsx
import { useLocation } from 'react-router-dom';

function NavItem() {
    const location = useLocation();
    const isActive = location.pathname === '/courses';
    
    return (
        <Link 
            to="/courses" 
            className={isActive ? 'active' : ''}
        >
            Khóa học
        </Link>
    );
}
```

### Mở rộng thêm routes

Để thêm route mới:

1. **Tạo component page mới**
```jsx
// src/pages/NewPage.jsx
function NewPage() {
    return <div>New Page Content</div>;
}
export default NewPage;
```

2. **Thêm vào router config**
```jsx
// src/routes/index.jsx
import NewPage from '../pages/NewPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // ... existing routes
            {
                path: 'new-page',
                element: <NewPage />
            }
        ]
    }
]);
```

### Protected Routes (TODO)

Để thêm authentication, có thể tạo ProtectedRoute component:

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = // kiểm tra auth từ Redux/Context
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}
```

Sau đó wrap routes cần protect:
```jsx
{
    path: 'profile',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
}
```

### Nested Routes

Router đã được cấu hình với nested routes. MainLayout là parent route và các trang khác là children, cho phép:
- Shared layout (navbar, footer)
- Outlet để render children
- Dễ dàng quản lý protected routes

### Next Steps

- [ ] Tích hợp authentication/authorization
- [ ] Thêm protected routes
- [ ] Connect với API backend
- [ ] Thêm loading states
- [ ] Error boundaries
- [ ] Lazy loading cho các routes

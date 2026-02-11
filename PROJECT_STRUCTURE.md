# Cấu trúc dự án Student Frontend

## 📁 Tổng quan cấu trúc

```
student_frontend/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   ├── style.css          # Global styles
│   │
│   ├── core/              # Core functionality
│   │   ├── services/      # API services, external integrations
│   │   │   └── api.js
│   │   └── store/         # Redux store configuration
│   │       ├── index.js
│   │       └── slices/    # Global slices (nếu cần)
│   │           └── exampleSlice.js
│   │
│   ├── features/          # Feature-based modules
│   │   ├── README.md      # Hướng dẫn về features
│   │   ├── home/
│   │   │   └── index.jsx
│   │   ├── courses/
│   │   │   ├── index.jsx
│   │   │   ├── slice.js
│   │   │   └── components/
│   │   │       └── CourseCard.jsx
│   │   ├── course-detail/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       └── LessonItem.jsx
│   │   ├── exams/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       └── ExamCard.jsx
│   │   ├── profile/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       ├── ProfileInfo.jsx
│   │   │       └── ProfileStats.jsx
│   │   ├── login/
│   │   │   ├── index.jsx
│   │   │   └── components/
│   │   │       └── LoginForm.jsx
│   │   └── not-found/
│   │       └── index.jsx
│   │
│   ├── shared/            # Shared/Common resources
│   │   └── components/    # Reusable components
│   │       └── layout/
│   │           └── MainLayout.jsx
│   │
│   └── routes/            # Routing configuration
│       └── index.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── ROUTING_GUIDE.md
├── SETUP_GUIDE.md
└── TYPOGRAPHY_GUIDE.md
```

## 🎯 Nguyên tắc tổ chức

### 1. **Features (features/)**
Mỗi trang/tính năng là một module độc lập với:
- Component chính (index.jsx)
- Components riêng (components/)
- State management riêng (slice.js)
- Layout riêng (layout/) - nếu cần
- Custom hooks (hooks/) - nếu cần

**Ưu điểm:**
- Dễ tìm kiếm và maintain
- Tách biệt rõ ràng giữa các tính năng
- Dễ mở rộng và thêm tính năng mới
- Code splitting tự nhiên

### 2. **Core (core/)**
Chứa các chức năng cốt lõi của ứng dụng:
- **services/**: API calls, integrations bên ngoài
- **store/**: Redux store configuration và global slices

### 3. **Shared (shared/)**
Chứa các resources được dùng chung:
- **components/**: Components tái sử dụng (buttons, modals, layout)
- **hooks/**: Custom hooks dùng chung (useAuth, useDebounce)
- **utils/**: Utility functions (formatters, validators)
- **constants/**: Constants, enums

### 4. **Routes (routes/)**
Cấu hình routing cho toàn ứng dụng

## 📝 Quy tắc

### Khi nào đặt code ở đâu?

#### Đặt trong **features/[feature-name]/**:
- Component chỉ dùng cho feature đó
- Business logic riêng của feature
- State management của feature (slice.js)

#### Đặt trong **shared/**:
- Component được dùng ở 2+ features
- Utility functions chung
- Custom hooks chung
- Layout components

#### Đặt trong **core/**:
- API service calls
- Global Redux slices
- Authentication logic
- Global configurations

## 🚀 Workflow thêm feature mới

1. **Tạo folder trong features/**
```bash
features/
  new-feature/
    index.jsx
    components/
    slice.js (optional)
```

2. **Tạo component chính (index.jsx)**
```jsx
function NewFeaturePage() {
    return (
        <div>
            {/* Your feature UI */}
        </div>
    );
}

export default NewFeaturePage;
```

3. **Thêm components phụ (nếu cần)**
```jsx
// features/new-feature/components/FeatureCard.jsx
function FeatureCard({ data }) {
    return <div>{/* Card UI */}</div>;
}

export default FeatureCard;
```

4. **Thêm Redux slice (nếu cần)**
```javascript
// features/new-feature/slice.js
import { createSlice } from '@reduxjs/toolkit';

const newFeatureSlice = createSlice({
    name: 'newFeature',
    initialState: {},
    reducers: {}
});

export default newFeatureSlice.reducer;
```

5. **Đăng ký slice vào store (nếu có)**
```javascript
// core/store/index.js
import newFeatureReducer from '../../features/new-feature/slice';

export const store = configureStore({
    reducer: {
        newFeature: newFeatureReducer
    }
});
```

6. **Thêm route**
```javascript
// routes/index.jsx
import NewFeaturePage from '../features/new-feature';

// Thêm vào router config
{
    path: 'new-feature',
    element: <NewFeaturePage />
}
```

## 💡 Best Practices

### 1. Component Organization
- Một component một file
- Component name = File name
- Export default cho main component

### 2. Import Order
```javascript
// 1. External libraries
import { useState } from 'react';
import { Link } from 'react-router-dom';

// 2. Internal modules
import { fetchData } from '../../core/services/api';

// 3. Components
import FeatureCard from './components/FeatureCard';

// 4. Styles
import './styles.css';
```

### 3. File Naming
- **Components**: PascalCase (`UserProfile.jsx`)
- **Utilities**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Folders**: kebab-case (`user-profile/`)

### 4. State Management
- Local state: `useState` for component-specific data
- Shared state: Redux slice for feature-wide data
- Global state: Core Redux slices for app-wide data

## 🔄 Migration từ cấu trúc cũ

Cấu trúc cũ:
```
src/
  pages/
    HomePage.jsx
    CoursesPage.jsx
```

Cấu trúc mới:
```
src/
  features/
    home/
      index.jsx
      components/
    courses/
      index.jsx
      components/
      slice.js
```

**Lợi ích:**
- ✅ Dễ scale khi dự án lớn
- ✅ Components được nhóm theo tính năng
- ✅ Dễ tìm kiếm file
- ✅ Tách biệt rõ ràng
- ✅ Code splitting tự nhiên

## 📚 Tài liệu tham khảo

- [ROUTING_GUIDE.md](../ROUTING_GUIDE.md) - Hướng dẫn về routing
- [SETUP_GUIDE.md](../SETUP_GUIDE.md) - Hướng dẫn setup dự án
- [TYPOGRAPHY_GUIDE.md](../TYPOGRAPHY_GUIDE.md) - Hướng dẫn về typography
- [features/README.md](./features/README.md) - Chi tiết về features structure

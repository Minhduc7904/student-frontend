# Hướng Dẫn Sử Dụng Project

## 🚀 Công nghệ đã được cài đặt

- ⚡ **Vite** - Build tool nhanh
- ⚛️ **React** - UI Library
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔄 **Redux Toolkit** - State management
- 🌐 **Axios** - HTTP client

## 📁 Cấu trúc thư mục

```
src/
├── store/
│   ├── index.js              # Redux store configuration
│   └── slices/
│       └── exampleSlice.js   # Example Redux slice
├── services/
│   └── api.js                # Axios instance với interceptors
├── App.jsx                   # Main App component
├── main.js                   # Entry point
└── style.css                 # Tailwind imports
```

## 🎯 Cách sử dụng

### 1. Import từ 'src/' hoặc '@/'

```javascript
// Cả hai cách đều hoạt động
import api from 'src/services/api'
import api from '@/services/api'

import { fetchData } from 'src/store/slices/exampleSlice'
import { fetchData } from '@/store/slices/exampleSlice'
```

### 2. Sử dụng Axios

```javascript
import api from 'src/services/api'

// GET request
const getData = async () => {
  try {
    const response = await api.get('/users')
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

// POST request
const postData = async () => {
  try {
    const response = await api.post('/users', { name: 'John' })
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
```

### 3. Sử dụng Redux

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { fetchData, setData } from 'src/store/slices/exampleSlice'

function MyComponent() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.example)

  const handleFetch = () => {
    dispatch(fetchData({ page: 1 }))
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleFetch}>Fetch Data</button>
    </div>
  )
}
```

### 4. Tạo Redux Slice mới

```javascript
// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.profile = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
```

Sau đó thêm vào store:

```javascript
// src/store/index.js
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    example: exampleReducer,
  },
})
```

### 5. Sử dụng Tailwind CSS

```jsx
function Button() {
  return (
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Click me
    </button>
  )
}
```

## 🔧 Cấu hình môi trường

Copy file `.env.example` thành `.env` và cập nhật biến:

```bash
VITE_API_URL=http://localhost:3000/api
```

## 🛠️ Scripts

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📝 Lưu ý

- API base URL được cấu hình trong `src/services/api.js`
- Axios interceptors tự động thêm token từ localStorage
- Tailwind config trong `tailwind.config.js`
- Vite config và path alias trong `vite.config.js`

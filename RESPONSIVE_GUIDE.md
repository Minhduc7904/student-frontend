# Hướng Dẫn Responsive Design

## 📱 Breakpoints

Project sử dụng breakpoints mặc định của Tailwind CSS:

| Breakpoint | Kích thước | Thiết bị | Prefix |
|------------|------------|----------|--------|
| Mobile | < 640px | Điện thoại | (default) |
| Small | ≥ 640px | Điện thoại ngang/Tablet nhỏ | `sm:` |
| Medium | ≥ 768px | Tablet | `md:` |
| Large | ≥ 1024px | Laptop | `lg:` |
| Extra Large | ≥ 1280px | Desktop | `xl:` |
| 2XL | ≥ 1536px | Desktop lớn | `2xl:` |

## 🎨 Typography Responsive

### Font Sizes Được Định Nghĩa

Trong `tailwind.config.js`, chúng ta đã định nghĩa các cỡ chữ sau:

```javascript
fontSize: {
  h1: ['32px', { lineHeight: '1.2', fontWeight: '680' }],
  'subhead-1': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
  h2: ['28px', { lineHeight: '1.2', fontWeight: '680' }],
  h3: ['20px', { lineHeight: '1.3', fontWeight: '640' }],
  h4: ['16px', { lineHeight: '1.4', fontWeight: '680' }],
  'subhead-4': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
  'text-4': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
  h5: ['12px', { lineHeight: '1.4', fontWeight: '680' }],
  'subhead-5': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
  'text-5': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
}
```

### Quy Tắc Sử Dụng Typography Responsive

#### 1. Headings (Tiêu đề)

```jsx
// ❌ Không nên: Font size cố định
<h1 className="text-h1">Tiêu đề</h1>

// ✅ Nên: Responsive font size
<h1 className="text-h3 sm:text-h2 lg:text-h1">
  Tiêu đề
</h1>
```

**Khuyến nghị:**
- Mobile: `text-h3` (20px)
- Tablet: `text-h2` (28px) 
- Desktop: `text-h1` (32px)

#### 2. Body Text (Văn bản thường)

```jsx
// ❌ Không nên
<p className="text-text-4">Nội dung</p>

// ✅ Nên
<p className="text-text-5 sm:text-text-4">
  Nội dung
</p>
```

**Khuyến nghị:**
- Mobile: `text-text-5` (12px)
- Tablet+: `text-text-4` (16px)

#### 3. Buttons & Interactive Elements

```jsx
// ✅ Button responsive
<button className="text-text-5 sm:text-h4">
  Đăng Nhập
</button>
```

## 📐 Spacing & Layout Responsive

### Padding & Margin

```jsx
// ❌ Không nên: Spacing cố định
<div className="px-[61px] py-[136px]">

// ✅ Nên: Responsive spacing
<div className="px-6 py-8 sm:px-10 sm:py-16 md:px-12 md:py-20 lg:px-[61px] lg:py-[136px]">
```

**Scale khuyến nghị:**

| Element | Mobile | Tablet (sm:) | Laptop (lg:) |
|---------|--------|--------------|--------------|
| Container padding | `px-6 py-8` | `px-10 py-16` | `px-[61px] py-[136px]` |
| Section gap | `gap-4` | `gap-5` | `gap-6` |
| Component padding | `p-4` | `p-6` | `p-8` |
| Border radius | `rounded-2xl` | `rounded-3xl` | `rounded-[40px]` |

### Width & Height

```jsx
// ❌ Không nên: Width cố định
<input className="w-[500px]" />

// ✅ Nên: Responsive width
<input className="w-full sm:w-[400px] md:w-[450px] lg:w-[500px]" />
```

**Pattern:**
- Mobile: `w-full` (100% width)
- Small screens: `sm:w-[400px]`
- Medium screens: `md:w-[450px]`
- Large screens: `lg:w-[500px]`

## 🎯 Ví Dụ Thực Tế: Login Form

### Input Field Responsive

```jsx
<input
  type="text"
  className="
    py-3 px-[10px] 
    w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
    text-text-5 sm:text-text-4
    text-gray-700 
    rounded-lg 
    outline-1 outline-offset-[-0.50px] outline-gray-700 
    focus:outline-blue-800
  "
  placeholder="Nhập tài khoản của bạn"
/>
```

**Phân tích:**
- Width: Full trên mobile, tăng dần theo breakpoint
- Font: text-5 (12px) mobile → text-4 (16px) tablet+
- Padding: Giữ nguyên để dễ touch trên mobile

### Container Responsive

```jsx
<div className="
  h-full 
  px-6 py-8 
  sm:px-10 sm:py-16 
  md:px-12 md:py-20 
  lg:px-[61px] lg:py-[136px]
  bg-white 
  flex items-center justify-center 
  rounded-2xl sm:rounded-3xl lg:rounded-[40px]
">
```

**Phân tích:**
- Padding tăng progressively
- Border radius tăng dần
- Layout giữ nguyên (flex center)

### Layout Position Responsive

```jsx
<main className="
  relative flex flex-1 min-h-dvh 
  justify-center sm:justify-end
  items-center 
  p-4 sm:p-6 md:p-8 lg:p-10
">
```

**Phân tích:**
- Mobile: `justify-center` (giữa màn hình)
- Tablet+: `sm:justify-end` (phía phải như desktop)
- Padding responsive tránh form sát mép

## 📋 Checklist Responsive Design

### Khi Thiết Kế Component Mới:

- [ ] **Typography**: Sử dụng font size từ tailwind.config.js
- [ ] **Font Size Responsive**: Nhỏ hơn trên mobile
- [ ] **Width**: `w-full` trên mobile, cụ thể trên desktop
- [ ] **Padding/Margin**: Giảm dần khi màn hình nhỏ
- [ ] **Gap**: Giảm gap giữa các elements trên mobile
- [ ] **Border Radius**: Nhỏ hơn trên mobile
- [ ] **Touch Target**: Tối thiểu 44x44px trên mobile
- [ ] **Layout**: Stack (column) trên mobile, row trên desktop
- [ ] **Hidden Elements**: Ẩn elements không cần thiết trên mobile

## 🎨 Best Practices

### 1. Mobile-First Approach

```jsx
// ✅ Tốt: Viết mobile trước, sau đó override cho màn hình lớn
<div className="text-h3 sm:text-h2 lg:text-h1">

// ❌ Tránh: Desktop-first
<div className="text-h1 lg:text-h3">
```

### 2. Consistent Breakpoints

```jsx
// ✅ Tốt: Sử dụng cùng breakpoints
<div className="px-6 sm:px-10 lg:px-[61px]">
  <h1 className="text-h3 sm:text-h2 lg:text-h1">
</div>

// ❌ Tránh: Breakpoints không nhất quán
<div className="px-6 md:px-10 xl:px-[61px]">
  <h1 className="text-h3 sm:text-h2 lg:text-h1">
</div>
```

### 3. Readable Class Names

```jsx
// ✅ Tốt: Organize theo property
<div className="
  flex flex-col items-center
  w-full sm:w-[400px] lg:w-[500px]
  px-6 sm:px-10 lg:px-[61px]
  py-8 sm:py-16 lg:py-[136px]
  bg-white
  rounded-2xl sm:rounded-3xl lg:rounded-[40px]
">

// ❌ Tránh: Classes lộn xộn
<div className="flex w-full rounded-2xl px-6 bg-white sm:w-[400px] py-8 flex-col sm:rounded-3xl items-center sm:px-10">
```

### 4. Test Trên Nhiều Thiết Bị

**Chrome DevTools:**
1. Mở DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test các breakpoints:
   - iPhone SE (375px)
   - iPad (768px)
   - Laptop (1024px)
   - Desktop (1920px)

## 🔧 Debug Responsive

### Hiển Thị Breakpoint Hiện Tại

Thêm component này để debug:

```jsx
function BreakpointIndicator() {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded text-text-5 z-50">
      <span className="sm:hidden">Mobile</span>
      <span className="hidden sm:inline md:hidden">SM (≥640px)</span>
      <span className="hidden md:inline lg:hidden">MD (≥768px)</span>
      <span className="hidden lg:inline xl:hidden">LG (≥1024px)</span>
      <span className="hidden xl:inline 2xl:hidden">XL (≥1280px)</span>
      <span className="hidden 2xl:inline">2XL (≥1536px)</span>
    </div>
  );
}
```

## 📚 Tài Liệu Tham Khảo

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Typography Guide](./TYPOGRAPHY_GUIDE.md)
- [Component Structure](./PROJECT_STRUCTURE.md)

---

**Cập nhật lần cuối:** February 2026

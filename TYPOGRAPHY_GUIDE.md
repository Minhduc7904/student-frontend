# Typography Guide - Student Frontend

## Font Family
**Open Sans** đã được cài đặt và setup làm font mặc định cho toàn bộ dự án.

### Weights đã import:
- 400 (Regular) - cho body text
- 600 (Semi-bold) - cho subheadings
- 700 (Bold) - gần với weight 680

## Typography Tokens

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 32px | 680 | 1.2 | Page titles, main headings |
| **Subhead 1** | 32px | 600 | 1.2 | Large subheadings |
| **H2** | 28px | 680 | 1.2 | Section titles |
| **H3** | 20px | 640 | 1.3 | Subsection titles |
| **H4** | 16px | 680 | 1.4 | Card titles, small headings |
| **Subhead 4** | 16px | 600 | 1.4 | Medium emphasis text |
| **Text 4** | 16px | 400 | 1.5 | Body text, paragraphs |
| **H5** | 12px | 680 | 1.4 | Labels, tags (uppercase) |
| **Subhead 5** | 12px | 600 | 1.4 | Small subheadings |
| **Text 5** | 12px | 400 | 1.5 | Captions, metadata |

## Cách sử dụng

### 1. Sử dụng utility classes (Recommended)

```jsx
// H1 - Page Title
<h1 className="text-h1 text-gray-900">
    Tiêu đề trang chính
</h1>

// H2 - Section Title
<h2 className="text-h2 text-gray-900">
    Tiêu đề phần
</h2>

// H3 - Subsection
<h3 className="text-h3 text-gray-900">
    Tiêu đề mục con
</h3>

// Body Text
<p className="text-text-4 text-gray-700">
    Nội dung chính của đoạn văn. Lorem ipsum dolor sit amet.
</p>

// Caption/Metadata
<span className="text-text-5 text-gray-500">
    2 giờ trước
</span>
```

### 2. Ví dụ thực tế

#### Card Component
```jsx
<div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-h3 text-gray-900 mb-2">
        Toán học nâng cao
    </h3>
    <p className="text-subhead-4 text-gray-700 mb-4">
        Giáo viên: Nguyễn Văn A
    </p>
    <p className="text-text-4 text-gray-700 mb-2">
        Khóa học toán học dành cho học sinh THPT, bao gồm các chủ đề nâng cao.
    </p>
    <span className="text-text-5 text-gray-500">
        Cập nhật 2 ngày trước
    </span>
</div>
```

#### Page Header
```jsx
<div className="mb-8">
    <h1 className="text-h1 text-gray-900 mb-2">
        Khóa học của tôi
    </h1>
    <p className="text-text-4 text-gray-600">
        Quản lý và học các khóa học được gán cho bạn
    </p>
</div>
```

#### List Item
```jsx
<div className="border-b pb-4">
    <h4 className="text-h4 text-gray-900 mb-1">
        Bài 1: Hàm số
    </h4>
    <p className="text-text-5 text-gray-500">
        45 phút • Đã hoàn thành
    </p>
</div>
```

#### Button với Label
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
    <span className="text-subhead-4">Bắt đầu học</span>
</button>
```

## Tailwind Config

Các typography tokens đã được thêm vào Tailwind config:

```js
fontSize: {
    'h1': ['32px', { lineHeight: '1.2', fontWeight: '680' }],
    'subhead-1': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
    'h2': ['28px', { lineHeight: '1.2', fontWeight: '680' }],
    'h3': ['20px', { lineHeight: '1.3', fontWeight: '640' }],
    'h4': ['16px', { lineHeight: '1.4', fontWeight: '680' }],
    'subhead-4': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
    'text-4': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
    'h5': ['12px', { lineHeight: '1.4', fontWeight: '680' }],
    'subhead-5': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
    'text-5': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
}
```

## Xem Demo

Truy cập `/typography-demo` để xem tất cả các typography styles trong action:

```
http://localhost:5173/typography-demo
```

## Best Practices

### 1. Chọn đúng token cho mục đích
- **Headings (H1-H5)**: Dùng cho tiêu đề, có weight cao (640-680)
- **Subheads**: Dùng cho phụ đề, có weight medium (600)
- **Text**: Dùng cho nội dung, có weight normal (400)

### 2. Kết hợp với màu sắc
```jsx
// Tiêu đề chính - màu tối nhất
<h1 className="text-h1 text-gray-900">Main Title</h1>

// Nội dung chính - màu trung bình
<p className="text-text-4 text-gray-700">Body content</p>

// Thông tin phụ - màu nhạt
<span className="text-text-5 text-gray-500">Metadata</span>
```

### 3. Hierarchy rõ ràng
```jsx
<article>
    <h1 className="text-h1 text-gray-900 mb-2">Article Title</h1>
    <p className="text-text-5 text-gray-500 mb-6">By Author • 5 min read</p>
    
    <h2 className="text-h2 text-gray-900 mb-4">Section 1</h2>
    <p className="text-text-4 text-gray-700 mb-4">Content...</p>
    
    <h3 className="text-h3 text-gray-900 mb-3">Subsection 1.1</h3>
    <p className="text-text-4 text-gray-700 mb-4">Content...</p>
</article>
```

### 4. Responsive Typography
Kết hợp với responsive classes của Tailwind:
```jsx
<h1 className="text-h3 md:text-h2 lg:text-h1 text-gray-900">
    Responsive Heading
</h1>
```

## Lưu ý

1. **Font Weight 640 và 680**: Do Open Sans không có chính xác weight 640/680, font sẽ fallback về weight gần nhất (600/700)
2. **Line Height**: Đã được thiết lập tối ưu cho từng size để đảm bảo readability
3. **Accessibility**: Luôn đảm bảo contrast ratio đủ giữa text và background (WCAG AA: 4.5:1 cho normal text)

## Import Font

Font đã được import trong `main.jsx`:
```jsx
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'
```

Và được set làm default font family trong Tailwind:
```js
fontFamily: {
    sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
}
```

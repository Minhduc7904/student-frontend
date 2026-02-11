# Loading Components

Tập hợp các component loading/spinner có thể tái sử dụng trong toàn bộ ứng dụng.

## Components

### 1. Spinner

Spinner cơ bản với nhiều kích thước và màu sắc.

```jsx
import { Spinner } from '@/shared/components';

// Basic usage
<Spinner />

// With size
<Spinner size="lg" />

// With color
<Spinner color="blue" />

// Custom className
<Spinner size="md" color="white" className="my-custom-class" />
```

**Props:**
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `color`: `'white' | 'blue' | 'gray' | 'yellow'` (default: `'white'`)
- `className`: Custom CSS classes

**Sizes:**
- `xs`: 12px (h-3 w-3)
- `sm`: 16px (h-4 w-4)
- `md`: 20px (h-5 w-5)
- `lg`: 24px (h-6 w-6)
- `xl`: 32px (h-8 w-8)

---

### 2. LoadingText

Spinner với text label.

```jsx
import { LoadingText } from '@/shared/components';

<LoadingText text="Đang tải..." />
<LoadingText text="Đang xử lý..." size="lg" color="blue" />
```

**Props:**
- `text`: Text hiển thị (default: `'Đang tải...'`)
- `size`: Kích thước spinner (default: `'md'`)
- `color`: Màu sắc (default: `'white'`)
- `textClassName`: Custom class cho text
- `spinnerClassName`: Custom class cho spinner

---

### 3. ButtonLoading

Loading state cho buttons (wrapper của LoadingText với font-weight bold).

```jsx
import { ButtonLoading } from '@/shared/components';

<button disabled={loading}>
  {loading ? (
    <ButtonLoading text="Đang đăng nhập..." />
  ) : (
    'Đăng Nhập'
  )}
</button>
```

**Props:**
- `text`: Text hiển thị (default: `'Đang xử lý...'`)
- `size`: Kích thước spinner (default: `'md'`)
- `color`: Màu sắc (default: `'white'`)

**Ví dụ thực tế:**

```jsx
const LoginButton = ({ loading }) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white rounded-lg p-3
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <ButtonLoading text="Đang đăng nhập..." />
            ) : (
                'Đăng Nhập'
            )}
        </button>
    );
};
```

---

### 4. LoadingOverlay

Full-screen hoặc container overlay với loading spinner.

```jsx
import { LoadingOverlay } from '@/shared/components';

// Container overlay (relative to parent)
<div className="relative">
  {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
  {/* Your content */}
</div>

// Full screen overlay
{loading && <LoadingOverlay text="Đang xử lý..." fullScreen />}

// Transparent background
<LoadingOverlay text="Đang lưu..." transparent />
```

**Props:**
- `text`: Text hiển thị (default: `'Đang tải...'`, set `null` để ẩn)
- `fullScreen`: `boolean` - Full screen overlay (default: `false`)
- `transparent`: `boolean` - Background trong suốt (default: `false`)

**Note:** 
- Non-fullscreen overlay yêu cầu parent có `position: relative`
- Fullscreen overlay có `z-index: 50`

---

### 5. LoadingDots

Loading animation dạng dots nhảy.

```jsx
import { LoadingDots } from '@/shared/components';

<LoadingDots />
<LoadingDots color="blue" />
```

**Props:**
- `color`: `'white' | 'blue' | 'gray' | 'yellow'` (default: `'gray'`)

**Use cases:**
- Inline loading trong text
- Loading trong compact spaces
- Subtle loading indicators

---

## Use Cases & Examples

### 1. Button Loading State

```jsx
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <ButtonLoading text="Đang gửi..." />
  ) : (
    'Gửi'
  )}
</button>
```

### 2. Form Loading

```jsx
function LoginForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form className="relative">
      {loading && <LoadingOverlay text="Đang đăng nhập..." />}
      {/* Form fields */}
    </form>
  );
}
```

### 3. Page Loading

```jsx
function DashboardPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingOverlay fullScreen text="Đang tải dashboard..." />;
  }

  return <div>{/* Dashboard content */}</div>;
}
```

### 4. Inline Loading

```jsx
<div className="flex items-center gap-2">
  <span>Đang đồng bộ</span>
  <LoadingDots color="blue" />
</div>
```

### 5. Card Loading

```jsx
<div className="relative min-h-[200px] rounded-lg border">
  {isLoading && (
    <LoadingOverlay 
      text="Đang tải nội dung..." 
      transparent 
    />
  )}
  {/* Card content */}
</div>
```

---

## Styling Guide

### Sizes Mapping

| Size | Pixels | Use Case |
|------|--------|----------|
| xs   | 12px   | Inline text, compact UI |
| sm   | 16px   | Small buttons, badges |
| md   | 20px   | Default buttons, forms |
| lg   | 24px   | Large buttons, headers |
| xl   | 32px   | Overlays, full page loading |

### Colors Mapping

| Color  | CSS Class | Use Case |
|--------|-----------|----------|
| white  | text-white | Dark backgrounds, primary buttons |
| blue   | text-blue-800 | Light backgrounds, secondary actions |
| gray   | text-gray-700 | Neutral contexts |
| yellow | text-yellow-500 | Warning states |

---

## Accessibility

All loading components support:
- Screen reader friendly (spinning animation described by SVG)
- Proper contrast ratios
- Semantic HTML structure

For better accessibility, pair with:
```jsx
<button disabled={loading} aria-busy={loading}>
  {loading ? <ButtonLoading /> : 'Submit'}
</button>
```

---

## Performance Notes

- Spinner uses CSS animations (hardware accelerated)
- No heavy JavaScript calculations
- Lightweight SVG implementation
- No external dependencies

---

## Customization

Extend with custom styles:

```jsx
// Custom size
<Spinner className="h-10 w-10" />

// Custom animation speed
<Spinner className="animate-[spin_0.5s_linear_infinite]" />

// Custom colors
<Spinner className="text-red-500" />
```

---

**Location:** `src/shared/components/loading/`

**Exports:** `Spinner`, `LoadingText`, `ButtonLoading`, `LoadingOverlay`, `LoadingDots`

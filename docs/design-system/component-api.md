# Đặc tả API Components (Component API Specifications) - Phase P10

- **Mã tài liệu:** `DS-API-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. UI Primitives

### `Button` (`@/components/ui/button`)
- **Props:**
  - `variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"`
  - `size?: "default" | "sm" | "lg" | "icon"`
  - `loading?: boolean`
  - `asChild?: boolean`
  - Kế thừa toàn bộ `React.ButtonHTMLAttributes<HTMLButtonElement>`.

### `Input` (`@/components/ui/input`)
- **Props:**
  - `error?: boolean`
  - `type?: string` (default `"text"`)
  - Kế thừa toàn bộ `React.InputHTMLAttributes<HTMLInputElement>`.

### `Select` (`@/components/ui/select`)
- **Props:**
  - `options?: { value: string; label: string; disabled?: boolean }[]`
  - `error?: boolean`
  - `placeholder?: string`
  - Kế thừa toàn bộ `React.SelectHTMLAttributes<HTMLSelectElement>`.

### `PartialDateInput` (`@/components/forms/partial-date-input`)
- **Props:**
  - `label: string`
  - `value: { precision: "unknown" | "year" | "month" | "exact"; year: number | null; month: number | null; day: number | null; isEstimated: boolean }`
  - `onChange: (value) => void`
  - `disabled?: boolean`
  - `error?: string`
  - `description?: string`

### `Dialog` (`@/components/ui/dialog`)
- **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `title: string`
  - `description?: string`
  - `children: React.ReactNode`

### `BottomSheet` (`@/components/ui/bottom-sheet`)
- **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `title: string`
  - `description?: string`
  - `children: React.ReactNode`

### `EmptyState` (`@/components/feedback/empty-state`)
- **Props:**
  - `title: string`
  - `description: string`
  - `icon?: React.ReactNode`
  - `primaryAction?: { label: string; onClick?: () => void; href?: string }`
  - `secondaryAction?: { label: string; onClick?: () => void; href?: string }`

### `ErrorState` (`@/components/feedback/error-state`)
- **Props:**
  - `title?: string`
  - `message: string`
  - `errorCode?: string`
  - `onRetry?: () => void`
  - `onBack?: () => void`

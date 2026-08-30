# Tài liệu Bàn giao Kỹ thuật: Phase P10 sang Phase P11, P12 & P15 (Handover - Cổng G7)

- **Phase Bàn giao:** `P10: Khung giao diện responsive` - Trạng thái: `IMPLEMENTATION_COMPLETE`
- **Phase Tiếp nhận 1:** `P11: Quản trị Cây Gia phả (Family Tree Management)`
- **Phase Tiếp nhận 2:** `P12: Quản trị Nhân vật (Person Management)`
- **Phase Tiếp nhận 3:** `P15: Trực quan hóa Cây gia phả (Family Tree Visualization)`
- **Ngày bàn giao:** 2026-08-30
- **Người bàn giao:** Principal UI Engineer (P10)

---

## 1. Gói Bàn giao cho Phase P11 (Family Tree Management)

1. **Sử dụng Khung Giao diện `AppShell`:**
   - Các trang quản trị cây gia phả (`/trees`, `/trees/create`, `/trees/[id]`) sẽ tự động được bọc trong `AppShell` qua `src/app/(dashboard)/layout.tsx`.
2. **Sử dụng `EmptyState` & `ErrorState`:**
   - Dùng `EmptyState` khi người dùng chưa có cây gia phả nào, kèm primary CTA trỏ tới luồng tạo cây.
3. **Sử dụng `Dialog` / `BottomSheet`:**
   - Dùng `Dialog` (trên Desktop) và `BottomSheet` (trên Mobile) cho Modal xác nhận xóa hoặc tạo mới cây gia phả.
4. **Sử dụng `toast`:**
   - `toast.success("Tạo cây gia phả thành công!")` hoặc `toast.error("Không thể lưu cây gia phả.")`.

---

## 2. Gói Bàn giao cho Phase P12 (Person Management)

1. **Sử dụng `PartialDateInput`:**
   - Bắt buộc dùng `PartialDateInput` (`@/components/forms/partial-date-input`) cho các trường `birth_date` và `death_date`.
   - Giữ nguyên contract: `{ precision, year, month, day, isEstimated }`.
   - **Tuyệt đối không chèn ngày giả 01/01**.
2. **Sử dụng `Button`, `Input`, `Select`:**
   - Sử dụng các primitive chuẩn từ `@/components/ui/` để đảm bảo tính đồng nhất về visual và khả năng tiếp cận WCAG 2.2 AA.

---

## 3. Gói Bàn giao cho Phase P15 (Tree Visualization & Canvas)

1. **Main Content Container:**
   - Main container có `min-w-0` và responsive padding sẵn sàng cho canvas đồ thị React Flow.
2. **Tương thích Mobile:**
   - Khi xem cây trên mobile, thanh điều hướng đáy `MobileNavigation` có chiều cao `64px` (`pb-24` spacer), không che mất các nút điều khiển canvas nổi (Pan/Zoom/Fit view).

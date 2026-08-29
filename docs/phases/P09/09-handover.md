# Tài liệu Bàn giao Kỹ thuật: Phase P09 sang Phase P10 & P11 (Handover - Cổng G7)

- **Phase Bàn giao:** `P09: Xác thực người dùng` - Trạng thái: `IMPLEMENTATION_COMPLETE`
- **Phase Tiếp nhận Trực tiếp:** `P10: Thiết kế Hệ thống UI/UX & Design Tokens`
- **Phase Tiếp nhận Nghiệp vụ:** `P11: Quản trị Cây Gia phả (Family Tree Management)`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Authentication Engineer (P09)

---

## 1. Hướng dẫn Kỹ thuật Dành riêng cho Phase P10 (Design System & UI Components)

1. **Các Màn hình Auth Đã Triển khai:**
   - Các trang `login`, `sign-up`, `forgot-password`, `update-password`, `verify-email`, `auth-error`, `account`, `dashboard` đã có cấu trúc form, state management và validation Zod hoàn chỉnh.
   - Phase P10 có thể nâng cấp style, iconography, animation và design tokens mà **không cần sửa đổi logic Server Actions hay Route Handlers**.
2. **Button Primitives & Accessibility:**
   - Component `src/components/ui/button.tsx` đã hỗ trợ đầy đủ `buttonVariants` và thuộc tính `asChild` để bọc Next.js `<Link>`.

---

## 2. Hướng dẫn Kỹ thuật Dành riêng cho Phase P11 (Family Tree Management)

1. **Sử dụng `requireUser()`:**
   - Mọi Server Component hoặc Server Action trong dashboard phải gọi `await requireUser()` để lấy `{ user, profile }` và bảo đảm phiên đăng nhập hợp lệ.
2. **Quyền Tạo Cây Gia phả Mới (P11):**
   - Khi tạo cây mới: `INSERT INTO public.family_trees (..., created_by) VALUES (..., (select auth.uid()))`.
   - Ngay sau đó tạo bản ghi trong `public.tree_memberships` với `role = 'owner'`.
3. **Quy tắc Chống Open-Redirect:**
   - Sử dụng helper `getSafeRedirectUrl(target, fallback)` tại `src/lib/auth/redirects.ts` cho bất kỳ hành vi chuyển hướng động nào.

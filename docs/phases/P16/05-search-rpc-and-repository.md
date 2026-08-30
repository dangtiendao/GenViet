# Phase P16: Đặc Tả Search RPC & Repository Layer

## 1. Hàm RPC `public.search_persons_in_tree`
- **Quyền hạn:** `SECURITY DEFINER`, thiết lập `SET search_path = public, extensions, _system, pg_temp`.
- **Kiểm soát truy cập:** Xác thực `auth.uid()` và kiểm tra tư cách thành viên `tree_memberships` (hoặc cây `public`).
- **Phân tầng độ khớp:**
  - Tier 1: Trùng khớp tuyệt đối.
  - Tier 2: Trùng khớp tiền tố (`LIKE query%`).
  - Tier 3: Trùng khớp một phần (`LIKE %query%`).
  - Tier 4: Độ tương đồng Trigram ($\ge 0.25$).
  - Tier 5: Danh sách duyệt khi không có query.

---

## 2. Lớp Repository (`PersonSearchRepository`)
- Gọi RPC trực tiếp qua Supabase client scoped với session của user hiện tại.
- Xử lý mã lỗi PostgreSQL sang `PersonSearchDomainError`.
- Tuyệt đối không dùng Service Role Token.

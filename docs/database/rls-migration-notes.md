# Ghi chú Triển khai Migration RLS: Phase P08 (RLS Migration Notes)

- **Mã tài liệu:** `DB-MIG-P08-01`
- **Phiên bản:** `v0.1-baseline`
- **Migration:** `20260829160221_p08_add_rls_authorization_policies.sql`

---

## 1. Trình tự Áp dụng trong Migration
1. Khởi tạo 3 helper functions trong schema `_system` (`is_active_tree_member`, `is_tree_owner`, `can_write_tree`).
2. Thiết lập quyền EXECUTE cho helper functions (Grant `authenticated`, Revoke `PUBLIC`/`anon`).
3. Khởi tạo hàm trigger `_system.prevent_immutable_columns_mutation()` và gán vào 7 bảng.
4. Điều chỉnh Grants: Revoke toàn bộ từ `anon`, cấp quyền least-privilege cho `authenticated`, thu hồi hard `DELETE`.
5. Thiết lập các RLS Policies chi tiết cho 7 bảng cốt lõi.
6. Thiết lập 2 composite partial indexes hỗ trợ tra cứu membership tức thời.

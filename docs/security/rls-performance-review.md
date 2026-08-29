# Đánh giá Hiệu năng RLS Policies (RLS Performance Review)

- **Mã tài liệu:** `SEC-PERF-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Kết quả Đánh giá Thiết kế Policy & Indexing

1. **Bọc `(select auth.uid())`:** Mọi chính sách RLS đều sử dụng cú pháp chuẩn `(select auth.uid())` thay vì `auth.uid()`, cho phép PostgreSQL query optimizer xử lý giá trị này như một hằng số subquery (InitPlan) thay vì phải gọi lại hàm context trên từng bản ghi được quét.
2. **Chỉ định Role Rõ ràng:** Tất cả policies đều gán tường minh `TO authenticated`, giúp giảm thiểu overhead kiểm tra quyền đối với các vai trò không liên quan.
3. **Chỉ mục Phân quyền Chuyên dụng (Supporting Indexes):**
   - Đã tạo `idx_tree_memberships_auth_lookup` trên `(user_id, tree_id, role) WHERE deleted_at IS NULL AND status = 'active'`.
   - Đã tạo `idx_tree_memberships_tree_owner_lookup` trên `(tree_id, user_id) WHERE deleted_at IS NULL AND status = 'active' AND role = 'owner'`.
4. **Hàm Helper `STABLE` & Security Definer:** Các hàm `_system.is_active_tree_member`, `_system.is_tree_owner`, `_system.can_write_tree` được định nghĩa `STABLE`, giúp PostgreSQL cache kết quả kiểm tra quyền trong cùng một query execution plan mà không quét lại bảng `tree_memberships`.

# Mô hình Giao dịch Nguyên tử (Transaction Model) - Phase P11

- **Mã tài liệu:** `FT-TX-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Giao dịch Tạo Cây Gia phả (`public.create_family_tree`)

### Mục tiêu:
Loại bỏ triệt để nguy cơ phát sinh **Cây mồ côi (Orphan Tree)** hoặc **Membership không có Tree**.

### Quy trình Thực thi Nguyên tử (ACID Transaction):
1. **Xác thực actor:** Kiểm tra `auth.uid() IS NOT NULL`.
2. **Validate input:** Cắt tỉa khoảng trắng, kiểm tra độ dài tên (1..100) và mô tả (0..1000).
3. **Thêm bản ghi Cây gia phả (`family_trees`):** Gán `created_by` và `updated_by` bằng `auth.uid()`, sinh UUID `v_tree_id`.
4. **Thêm bản ghi Thành viên Chủ sở hữu (`tree_memberships`):** Gán `tree_id = v_tree_id`, `user_id = auth.uid()`, `role = 'owner'`, `status = 'active'`.
5. **Commit hoặc Rollback toàn bộ:** Nếu bất kỳ câu lệnh nào thất bại, toàn bộ giao dịch sẽ tự động rollback 100%.

### Cấu hình Bảo mật:
- `SECURITY DEFINER`
- `SET search_path = public, _system, pg_temp;`
- `REVOKE ALL FROM PUBLIC, anon;`
- `GRANT EXECUTE TO authenticated, service_role;`

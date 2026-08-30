# Thực Thi Giao Dịch & Cơ Chế Phục Hồi (Transaction & Rollback)

## 1. Giao Dịch Nguyên Tử (Atomic Database Transaction)
- Thao tác nhập dữ liệu được thực thi thông qua hàm RPC `public.import_family_tree_backup(p_backup_data JSONB)` với thuộc tính `VOLATILE SECURITY DEFINER`.
- Các bước thực thi bên trong transaction:
  1. Tạo bản ghi `family_trees` mới (`privacy_level = 'private'`).
  2. Tạo bản ghi `tree_memberships` (`role = 'owner'`, `user_id = auth.uid()`).
  3. Thêm danh sách `persons` với họ tên đã chuẩn hóa.
  4. Thêm danh sách `parent_child_relationships`.
  5. Thêm danh sách `unions` và `union_members`.
  6. Cập nhật mốc thế hệ và nhân vật mặc định.
  7. Ghi nhật ký biến động (`_system.write_audit_log`).
- **Rollback 100%:** Nếu có bất kỳ lỗi nào xảy ra ở bất kỳ bản ghi nào, toàn bộ giao dịch sẽ tự động Rollback, không để lại bất kỳ dữ liệu rác hay cây gia phả mồ côi nào.

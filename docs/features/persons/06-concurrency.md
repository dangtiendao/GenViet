# Optimistic Concurrency Control (Kiểm Soát Ghi Đè Đồng Thời)

## 1. Cơ Chế Hoạt Động
Để ngăn ngừa tình trạng mất dữ liệu khi hai người dùng cùng mở và chỉnh sửa cùng một hồ sơ nhân vật:
1. Khi nạp form chỉnh sửa, client nhận `expectedVersion = person.version`.
2. Khi submit update, Server Action truyền `expectedVersion` vào câu lệnh UPDATE:
   ```sql
   UPDATE public.persons
   SET full_name = $1, version = expectedVersion + 1, updated_at = now(), updated_by = $2
   WHERE id = $3 AND version = expectedVersion AND deleted_at IS NULL;
   ```
3. Nếu `ROW_COUNT = 0`, hệ thống phát hiện có xung đột ghi đè và trả về mã lỗi `PERSON_VERSION_CONFLICT`.
4. Giao diện hiển thị thông báo xung đột kèm nút "Tải lại dữ liệu mới nhất" để người dùng không bị mất ngữ cảnh.

# Authorization & Security: Relationship Management

## 1. Ma Trận Phân Quyền Theo Tree Role

| Thao Tác | Owner | Admin | Editor | Viewer | Outsider |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Xem quan hệ (`SELECT active`) | Cho phép | Cho phép | Cho phép | Cho phép | Từ chối |
| Thêm cha/mẹ mới | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Liên kết cha/mẹ có sẵn | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Thêm con mới / Liên kết con | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Tạo / Kết thúc Union | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Xóa mềm quan hệ / Union | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Thay thế quan hệ | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |

## 2. Các Ràng Buộc Security Mode Của RPC
- Các hàm RPC chạy dưới `SECURITY DEFINER` với `SET search_path = public, _system, pg_temp;`.
- Luôn kiểm tra `auth.uid() IS NOT NULL`.
- Kiểm tra quyền ghi qua `_system.can_write_tree(p_tree_id, auth.uid())`.
- `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated, service_role;`.

# Authorization & RLS: Person Management

## 1. Phân Quyền Theo Vai Trò (Tree Role-Based Access)

| Thao Tác | Owner | Admin | Editor | Viewer | Outsider / Anonymous |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Xem danh sách nhân vật (`SELECT active`) | Cho phép | Cho phép | Cho phép | Cho phép | Từ chối |
| Xem chi tiết nhân vật | Cho phép | Cho phép | Cho phép | Cho phép | Từ chối |
| Thêm nhân vật mới (`INSERT`) | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Chỉnh sửa hồ sơ (`UPDATE`) | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Xóa mềm nhân vật (`UPDATE deleted_at`) | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Xem thùng rác (`SELECT deleted`) | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |
| Khôi phục nhân vật (`restore_person`) | Cho phép | Cho phép | Cho phép | Từ chối | Từ chối |

## 2. Các Policy RLS Được Áp Dụng
- `persons_select_members`: Cho phép thành viên active trong cây đọc bản ghi active (`deleted_at IS NULL AND _system.is_active_tree_member(tree_id)`).
- `persons_insert_writers`: Cho phép writer (Owner/Admin/Editor) thêm nhân vật mới (`deleted_at IS NULL AND _system.can_write_tree(tree_id)`).
- `persons_update_writers`: Cho phép writer cập nhật nhân vật (`deleted_at IS NULL AND _system.can_write_tree(tree_id)`).
- `persons_select_deleted_writers`: Cho phép writer truy cập danh sách nhân vật đã xóa mềm trong Thùng rác.

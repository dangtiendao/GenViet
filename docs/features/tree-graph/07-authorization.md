# Authorization & Security: Tree Graph API

## 1. Ma Trận Phân Quyền Truy Cập Graph

| Vai Trò Thành Viên | Đọc Graph Slice | Trả Về Quyền Ghi Trong Metadata | Ghi Chú |
| :--- | :---: | :---: | :--- |
| **Owner** | Cho phép | `canAddFather = true`, `canAddMother = true` | Toàn quyền xem và sửa |
| **Admin / Editor** | Cho phép | `canAddFather = true`, `canAddMother = true` | Toàn quyền xem và sửa |
| **Viewer** | Cho phép | Cho phép xem (Read-only) | Đọc graph an toàn |
| **Outsider / Anon** | **Từ chối (403/401)** | Không | Không thấy dữ liệu cây |

## 2. Bảo Mật PostgreSQL Function
- Hàm `public.get_tree_graph_slice` chạy dưới `SECURITY DEFINER` với `SET search_path = public, _system, pg_temp;`.
- Xác thực người dùng: `v_user_id := auth.uid()`.
- Kiểm tra quyền đọc: `_system.can_read_tree(p_tree_id, v_user_id)`.
- Chặn tuyệt đối truy cập từ `anon` hoặc `PUBLIC`.

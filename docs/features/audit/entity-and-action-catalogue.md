# Danh Mục Thực Thể & Hành Động Chuẩn Hóa (Entity & Action Catalogue)

## 1. Danh Mục Loại Đối Tượng (Entity Types)

| Mã Entity | Nhãn Tiếng Việt | Bảng Nguồn | Mô Tả |
| :--- | :--- | :--- | :--- |
| `family_tree` | Cây gia phả | `public.family_trees` | Bản ghi cây phả hệ |
| `person` | Nhân vật | `public.persons` | Cá nhân trong gia phả |
| `parent_child_relationship` | Quan hệ Cha/Mẹ - Con | `public.parent_child_relationships` | Liên kết thế hệ huyết thống/nuôi |
| `union` | Quan hệ Hôn nhân | `public.unions` | Liên kết vợ chồng/phối ngẫu |
| `union_member` | Thành viên Hôn nhân | `public.union_members` | Người tham gia cuộc hôn nhân |
| `person_avatar` | Ảnh đại diện | `public.person_avatars` | Siêu dữ liệu ảnh chân dung |

---

## 2. Danh Mục Thao Tác (Action Types)

| Mã Action | Nhãn Tiếng Việt | Ý Nghĩa Nghiệp Vụ |
| :--- | :--- | :--- |
| `create` | Tạo mới | Khởi tạo thực thể mới |
| `update` | Cập nhật | Sửa đổi thông tin thuộc tính |
| `soft_delete` | Xóa vào thùng rác | Đánh dấu xóa mềm (`deleted_at != null`) |
| `restore` | Khôi phục | Đưa thực thể trở lại trạng thái hoạt động |
| `replace` | Thay thế | Đổi người/quan hệ cũ sang đối tượng mới |
| `status_change` | Đổi trạng thái | Thay đổi trạng thái sống hoặc hôn nhân |
| `link` | Liên kết | Gắn quan hệ với người đã có trong cây |
| `unlink` | Hủy liên kết | Tháo gỡ liên kết mà không xóa người |
| `privacy_change` | Đổi quyền riêng tư | Thay đổi chế độ Private / Public của Tree |
| `avatar_replace` | Thay ảnh đại diện | Kích hoạt phiên bản ảnh chân dung mới |
| `avatar_remove` | Xóa ảnh đại diện | Gỡ bỏ ảnh đại diện của nhân vật |

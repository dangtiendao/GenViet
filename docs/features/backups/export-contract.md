# Hợp Đồng Xuất Dữ Liệu Sao Lưu (Export Contract)

## 1. Cơ Chế Xuất Dữ Liệu
- **Quyền hạn:** Chỉ Owner hoặc thành viên có quyền chỉnh sửa (Admin, Editor) mới được phép xuất dữ liệu sao lưu của cây gia phả.
- **Snapshot Nhất Quán:** Xuất dữ liệu thông qua RPC `public.export_family_tree_backup(p_tree_id UUID)` để đảm bảo toàn bộ bảng dữ liệu được chụp tại cùng một thời điểm transaction snapshot.
- **Tên File An Toàn:** Tên tệp được chuẩn hóa `genviet-{safe-tree-name}-{timestamp}.json`, loại bỏ toàn bộ dấu tiếng Việt và ký tự đặc biệt.
- **Headers An Toàn:** Trả về `Content-Type: application/json; charset=utf-8`, `Content-Disposition: attachment`, và `Cache-Control: no-store`.

# Phát Hiện & Xử Lý Xung Đột Khi Khôi Phục (Conflict Detection)

## 1. Phân Loại Xung Đột

### 1.1. Xung Đột Chặn (Blocking Conflicts) - Không Thể Bỏ Qua
- `DEPENDENCY_DELETED`: Cha/Mẹ hoặc Con đang nằm trong thùng rác.
- `CYCLE_CONFLICT`: Khôi phục quan hệ sẽ tạo ra chu trình tổ tiên - hậu duệ khép kín.
- `DUPLICATE_CONFLICT`: Đã có một quan hệ active giữa 2 nhân vật này.
- `VERIFIED_PARENT_CONFLICT`: Đã có đủ cha ruột hoặc mẹ ruột active trong cây.
- `TREE_DELETED`: Cây gia phả đang bị xóa.

### 1.2. Cảnh Báo (Warnings) - Yêu Cầu Xác Nhận
- `SIMILAR_PROFILE_WARNING`: Có nhân vật cùng họ tên đang hoạt động trong cây.
- `MULTIPLE_ACTIVE_UNIONS`: Có nhiều hơn một cuộc hôn nhân đang hoạt động.

# Phát Hiện Trùng Khớp & Gộp Hồ Sơ Có Kiểm Toán (Duplicate Detection & Profile Merge - P27-T15, P27-T16)

## 1. Phát Hiện Hồ Sơ Trùng Khớp (Duplicate Detection)
- Tính điểm trùng lặp có giải thích dựa trên: Họ tên (40đ), Giới tính (10đ), Ngày sinh (25đ), Cha/Mẹ (25đ).
- Chỉ tạo danh sách ứng viên đề xuất cho người dùng xem xét, tuyệt đối không tự động gộp.

## 2. Gộp Hồ Sơ Có Kiểm Toán (Auditable Profile Merge)
- Cho phép chọn hồ sơ giữ lại (Survivor) và hồ sơ bị gộp (Duplicate).
- Giải quyết từng trường thông tin, chuyển đổi toàn bộ quan hệ, sự kiện, ảnh đại diện.
- Đánh dấu xóa mềm (tombstone) hồ sơ bị gộp kèm theo ghi nhận lịch sử kiểm toán đầy đủ.

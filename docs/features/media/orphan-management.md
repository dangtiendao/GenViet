# Quản Lý & Dọn Dẹp Tệp Mồ Côi (Orphan Management)

## 1. Định Nghĩa Tệp Mồ Côi (Orphan Objects)
- Tệp tin upload vào thư mục `temporary/...` nhưng người dùng đóng trình duyệt trước khi hoàn tất cập nhật.
- Tệp tin đã được thay thế (`replaced`) hoặc đã xóa (`deleted`) nhưng bước dọn dẹp tức thời gặp sự cố mạng.

---

## 2. Tiện Ích Dọn Dẹp (`cleanup-orphan-avatars.mjs`)
- Ngưỡng an toàn thời gian: `safeAgeHours = 24` (chỉ dọn các file có tuổi thọ trên 24 giờ).
- Chế độ chạy mặc định: `--dry-run` (chỉ liệt kê, không xóa thật).
- Lệnh thực thi xóa thật: `node scripts/storage/cleanup-orphan-avatars.mjs --force`.

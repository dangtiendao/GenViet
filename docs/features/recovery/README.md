# Tính Năng Khôi Phục Dữ Liệu (Recovery Feature)

## 1. Tổng Quan
Tính năng Khôi phục cung cấp cơ chế an toàn giúp người dùng lấy lại các nhân vật hoặc quan hệ đã vô tình bị xóa vào thùng rác:
- **Nguyên tử & Tự động ghi log:** Mọi thao tác khôi phục đều thực thi qua RPC chuyên dụng và tự động ghi nhận audit log trong cùng transaction.
- **Bảo toàn tính toàn vẹn (Integrity Safeguards):** Kiểm tra xung đột chu trình tổ tiên - hậu duệ, trùng lặp liên kết, và trạng thái hoạt động của các nhân vật liên quan trước khi cho phép khôi phục.

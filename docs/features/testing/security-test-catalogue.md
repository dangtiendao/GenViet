# Danh Mục Kiểm Thử Bảo Mật (Security Test Catalogue)

## 1. Các Kịch Bản Bảo Mật Đã Kiểm Thử

1. **Cross-Tree Tenant Isolation (P22-T29):** Ngăn chặn người dùng từ Tree A truy vấn hoặc sửa đổi dữ liệu thuộc Tree B.
2. **Request Tampering (P22-T30):** Ngăn chặn chèn sai lệch `tree_id` vào request payload.
3. **UI Bypass (P22-T31):** Ngăn chặn thực thi RPC/API trái phép khi cố tình gọi trực tiếp.
4. **File Upload Security (P22-T32):** Chặn các tệp HTML đổi đuôi .jpg, tệp SVG có mã thực thi, tệp hỏng magic bytes.
5. **Client Bundle Secret Scan (P22-T33):** Quét mã build và Service Worker để đảm bảo không rò rỉ service-role key hay heartbeat secret.
6. **Signed URL Expiry (P22-T34):** Tự động vô hiệu hóa URL sau khi hết hạn và khi người dùng đăng xuất.
7. **Basic Rate Abuse (P22-T35):** Ngăn chặn gửi payload vượt quá 1KB hoặc spam secret sai.
8. **Supply Chain Audit (P22-T36):** Rà soát phụ thuộc với `npm audit` ghi nhận 0 lỗ hổng bảo mật.

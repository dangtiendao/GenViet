# Bảo Mật & Quyền Riêng Tư (Privacy & Security)

## 1. Nguyên Tắc Bảo Mật Dữ Liệu
1. **Loại bỏ Secret Tuyệt Đối:** File sao lưu JSON chỉ chứa dữ liệu phả hệ công cộng/nghiệp vụ. Tuyệt đối không chứa tài khoản người dùng (`auth.users`), mật khẩu, mã xác thực JWT, session cookies hay Storage signed URLs.
2. **Quyền Riêng Tư Đích Luôn Là Private:** Khi nhập vào hệ thống, cây gia phả mới luôn được khởi tạo ở chế độ `private`, người nhập là Owner duy nhất.
3. **Chống Tiêm Nhiễm (Anti-Injection & Digest Verification):** Tính toán mã băm SHA-256 của nội dung tệp tại bước Preview và đối soát khi Execute để đảm bảo tệp không bị chỉnh sửa lén lút giữa hai bước.

# Cách Ly Dữ Liệu & Bảo Vệ Tài Khoản (Auth & Cache Isolation)

## 1. Nguyên Tắc Bảo Vệ Dữ Liệu
1. **0% Dữ Liệu Riêng Tư Trong Cache Storage:** Toàn bộ API cây gia phả, kết quả tìm kiếm, ảnh private và backup payload đều được thiết lập chiến lược `NetworkOnly`.
2. **Quy Trình Dọn Dẹp Khi Đăng Xuất (Logout Cleanup):**
   - Khi bấm "Đăng xuất", hàm `clearAllPrivateCaches()` được gọi trước khi hoàn tất sign out.
   - Gửi lệnh `CLEAR_PRIVATE_CACHES` tới Service Worker.
   - Xóa `sessionStorage` và các cache private nếu có.
3. **Cách Ly Đổi Tài Khoản:** Khi Tài khoản B đăng nhập trên cùng thiết bị sau khi Tài khoản A đăng xuất, Tài khoản B sẽ không bao giờ thấy dữ liệu stale của Tài khoản A.

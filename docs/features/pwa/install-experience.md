# Trải Nghiệm Cài Đặt Ứng Dụng Đa Nền Tảng (Install Experience)

## 1. Cơ Chế Trên Các Nền Tảng
1. **Chromium / Android / Desktop:**
   - Lắng nghe sự kiện `beforeinstallprompt`, lưu trữ trong bộ nhớ và hiển thị nút `PwaInstallButton`.
   - Khi người dùng chạm nút, gọi `prompt()` và xử lý kết quả người dùng.
   - Tự động ẩn nút khi sự kiện `appinstalled` phát ra hoặc khi đang ở chế độ `standalone`.
2. **iOS / iPadOS Safari:**
   - Phát hiện thiết bị iOS qua User Agent.
   - Khi người dùng chạm nút `PwaInstallButton`, mở hộp thoại `IosInstallInstructions` hướng dẫn 3 bước: "Chia sẻ" -> "Thêm vào Màn hình chính" -> "Thêm".
   - Tự động ẩn hướng dẫn khi ứng dụng đã chạy ở chế độ Home Screen standalone (`navigator.standalone = true`).

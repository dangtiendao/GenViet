# Chiến Lược Cập Nhật Phiên Bản (Update Strategy)

## 1. Cơ Chế Phát Hiện & Áp Dụng Cập Nhật
1. **Phát hiện Worker mới:** Hook `useServiceWorkerUpdate` lắng nghe sự kiện `updatefound` và trạng thái `waiting` của Service Worker.
2. **Thông báo người dùng:** Hiển thị `PwaUpdateBanner` với 2 lựa chọn: "Cập nhật ngay" và "Để sau".
3. **Áp dụng:** Khi người dùng bấm "Cập nhật ngay", gửi lệnh `SKIP_WAITING` tới Service Worker.
4. **Tải lại an toàn:** Lắng nghe sự kiện `controllerchange` và thực hiện `window.location.reload()` đúng một lần duy nhất, chống vòng lặp reload loop.

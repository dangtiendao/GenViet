# Hành Vi Ngoại Tuyến & Ranh Giới Tính Năng (Offline Behavior)

## 1. Hành Vi Khi Mất Kết Nối
1. **Điều hướng trang mới:** Trả về trang `/offline` với thông điệp rõ ràng và nút "Thử lại kết nối".
2. **Trang đang mở:** Hiển thị thanh thông báo màu hổ phách `OfflineStatusBanner` trên đầu trang: "Thiết bị đang ngoại tuyến. Chỉnh sửa phả hệ hiện không khả dụng cho đến khi có mạng trở lại."
3. **Thao tác chỉnh sửa (Mutations):** Bị chặn an toàn, tuyệt đối không tạo hàng đợi ngầm hay lưu trữ mutation offline.
4. **Khi có mạng trở lại:** Tự động hiển thị thanh thông báo màu xanh `OfflineStatusBanner`: "Đã khôi phục kết nối Internet. Dữ liệu đã sẵn sàng đồng bộ."

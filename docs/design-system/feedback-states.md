# Trạng thái Phản hồi & Thông báo (Feedback States) - Phase P10

- **Mã tài liệu:** `DS-FEEDBACK-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Hệ thống Toast Notifications
- Hỗ trợ 4 loại thông báo: `success`, `error`, `warning`, `info`.
- Tự động đóng sau 4-5 giây hoặc bấm nút đóng thủ công.
- Không chứa mã lỗi thô hoặc thông tin bảo mật nhạy cảm.

## 2. Empty State & Error State
- **`EmptyState`:** Hiển thị khi danh sách cây gia phả hoặc kết quả tìm kiếm trống. Kèm theo nút kêu gọi hành động (CTA) hướng dẫn người dùng bắt đầu.
- **`ErrorState`:** Hiển thị khi xảy ra sự cố tải dữ liệu hoặc lỗi mạng. Cung cấp mã lỗi công khai (ví dụ `ERR_NETWORK_TIMEOUT`) và nút "Thử lại".

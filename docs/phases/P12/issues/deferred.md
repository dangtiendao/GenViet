# Deferred Items: Phase P12

## 1. P12-T05: Nhập Tên Thường Gọi / Biệt Hiệu (Nickname / Common Name)
- **Trạng thái:** DEFERRED (Hoãn lại sang giai đoạn mở rộng schema).
- **Lý do kỹ thuật:** Bảng `public.persons` trong migration P07 không có cột `nickname` hoặc `common_name`.
- **Ranh giới:** Không tự ý chèn dữ liệu vào cột `biography`, không sử dụng cột JSONB tạm thời.
- **Kế hoạch tương lai:** Sẽ được xem xét bổ sung cột `nickname TEXT NULL` trong một migration nâng cấp schema có kiểm soát.

## 2. Avatar Upload & Media Documents
- **Trạng thái:** OUT OF SCOPE (Thuộc Phase P17 - Media & Documents).
- **Ranh giới:** Phase P12 chỉ hiển thị chữ cái đầu đại diện làm avatar placeholder.

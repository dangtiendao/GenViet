# Phase P16: Xử Lý Lỗi & Bảo Mật (Error Handling & Security)

## 1. Bảo Mật & Ranh Giới Dữ Liệu
1. **Phân Quyền RLS & Same-Tree Isolation:** Toàn bộ truy vấn tìm kiếm bắt buộc gắn liền với một `tree_id` và xác thực quyền thành viên của `auth.uid()`.
2. **Chống Tấn Công XSS:** 100% không dùng `dangerouslySetInnerHTML`. Highlight sử dụng các React element độc lập và thẻ `<mark>`.
3. **Chống Tấn Công Regex Injection:** Tách từ khóa và so khớp chuỗi bằng hàm `normalizeVietnamese` an toàn.
4. **Chống Giả Mạo Cursor:** Giải mã cursor có xác thực kiểu dữ liệu chặt chẽ; cursor không hợp lệ sẽ trả về `null` thay vì gây crash hệ thống.

---

## 2. Bảng Phân Loại Lỗi (Section 46)
Lớp lỗi `PersonSearchDomainError` xử lý 13 mã lỗi tìm kiếm rõ ràng, có phân loại khả năng thử lại (`retryable`) để hiển thị thông báo thân thiện tới người dùng.

# Phase P16: Đặc Tả Chuẩn Hóa Tiếng Việt (Vietnamese Normalization Spec)

## 1. Nguyên Tắc Thiết Kế
1. **Bất biến & tất định (Deterministic & Immutable):** Cùng một chuỗi đầu vào phải luôn cho ra đúng 1 chuỗi đầu ra duy nhất trên cả PostgreSQL và TypeScript runtime.
2. **Quy đổi triệt để ký tự `đ/Đ`:** Do extension `unaccent` không chuẩn hóa `đ/Đ` thành `d`, hàm chuẩn hóa chủ động thực hiện `replace('Đ', 'd')` và `replace('đ', 'd')`.
3. **Thu gọn khoảng trắng:** Loại bỏ khoảng trắng thừa, tab, newline và non-breaking space.
4. **Bảo vệ toàn vẹn họ tên gốc:** Cột `full_name` luôn lưu trữ đầy đủ dấu tiếng Việt nguyên bản theo người dùng nhập; chỉ có cột `normalized_name` được tự động chuyển đổi phục vụ tìm kiếm.

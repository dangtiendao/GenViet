# Đánh giá Hiểm họa Bảo mật Xác thực (Auth Threat Review)

- **Mã tài liệu:** `SEC-THREAT-P09-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Bảng Đánh giá Hiểm họa theo Mô hình STRIDE

| Hiểm họa STRIDE | Nguy cơ Tiềm ẩn | Biện pháp Phòng thủ Đã Triển khai | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Spoofing (Giả mạo)** | Đăng nhập bằng tài khoản người khác | Mật khẩu mã hóa mạnh bởi Supabase Auth; bắt buộc xác minh email. | `MITIGATED` |
| **Tampering (Can thiệp)** | Sửa đổi Profile hoặc Tree của người khác | RLS policies (`profiles_update_own`), trigger chống sửa `tree_id`/`id`. | `MITIGATED` |
| **Repudiation (Chối bỏ)** | Thay đổi thông tin không để lại dấu vết | Tự động ghi nhận `updated_at` UTC tại CSDL. | `MITIGATED` |
| **Information Disclosure (Lộ lọt)** | Account Enumeration / Lộ token qua URL | Thông báo lỗi trung tính; xóa sạch code/token khỏi URL cuối cùng. | `MITIGATED` |
| **Denial of Service (Từ chối DV)** | Spam form đăng nhập / quên mật khẩu | Supabase Auth Rate Limiting tích hợp và disable repeated submit. | `MITIGATED` |
| **Elevation of Privilege (Nâng quyền)** | Tự nâng quyền Owner / Sửa user metadata | Phân quyền CSDL lấy từ `tree_memberships`, không dựa vào JWT claims. | `MITIGATED` |

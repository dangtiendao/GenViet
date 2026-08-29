# Security Documentation

Thư mục này quản lý toàn bộ các chính sách, quy chuẩn và hướng dẫn bảo mật thông tin, bảo vệ dữ liệu người dùng và quản trị khóa/secrets trong dự án **GenViet**.

---

## 1. Mục đích & Phạm vi

- Xác lập tiêu chuẩn bảo mật cho mã nguồn, cơ sở dữ liệu và hạ tầng.
- Hướng dẫn quản lý biến môi trường, API keys và Supabase Service Role keys an toàn.
- Thiết lập quy trình ứng phó khẩn cấp khi xảy ra sự cố lộ lọt thông tin hoặc secret.
- Kiểm soát bảo mật truy cập dữ liệu đa người dùng (Multi-tenant isolation).

---

## 2. Tài liệu cốt lõi

- [project-security-rules.md](./project-security-rules.md): **Quy tắc bảo mật bắt buộc và quản lý secret** (Áp dụng cho toàn bộ thành viên và AI Agents).
- `threat-model.md`: Mô hình đánh giá hiểm họa bảo mật (Dự kiến thực hiện ở Phase Kiến trúc/Bảo mật).
- `incident-response.md`: Quy trình xử lý sự cố an ninh mạng và thu hồi khóa khẩn cấp.

---

## 3. Nguyên tắc bảo mật cơ bản

1. **Tuyệt đối không commit Secrets:** Không bao giờ commit file `.env`, file cấu hình chứa mật khẩu, private key hoặc service role token.
2. **Ngăn chặn truy cập chéo (Cross-tenant Data Leakage):** Mọi truy vấn database phải được kiểm soát chặt chẽ bằng Supabase RLS.
3. **Ẩn thông tin nhạy cảm khỏi log:** Không in token, mật khẩu, thông tin cá nhân vào `console.log` hay hệ thống ghi log tập trung.

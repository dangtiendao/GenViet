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
- [rls-authorization-model.md](./rls-authorization-model.md): **Mô hình phân quyền Row Level Security (RLS)** theo vai trò và membership.
- [rls-policy-catalogue.md](./rls-policy-catalogue.md): **Danh mục 17 chính sách RLS** bảo vệ 7 bảng CSDL cốt lõi.
- [authorization-matrix.md](./authorization-matrix.md): **Ma trận phân quyền chi tiết** cho từng role và thực thể.
- [grants-matrix.md](./grants-matrix.md): **Ma trận quyền bảng CSDL (Grants)** theo nguyên tắc Least Privilege.
- [owner-only-actions.md](./owner-only-actions.md): **Danh mục thao tác độc quyền của Chủ sở hữu (Owner)**.
- [cross-tree-isolation.md](./cross-tree-isolation.md): **Cơ chế 3 lớp cách ly dữ liệu giữa các cây gia phả**.
- [service-role-isolation.md](./service-role-isolation.md): **Chính sách cách ly khóa đặc quyền Service-Role**.
- [rls-performance-review.md](./rls-performance-review.md): **Báo cáo đánh giá hiệu năng và chỉ mục RLS**.
- [authentication-model.md](./authentication-model.md): **Mô hình định danh và xác thực người dùng (P09)**.
- [session-management.md](./session-management.md): **Quản trị phiên làm việc và đồng bộ Server SSR**.
- [auth-redirect-security.md](./auth-redirect-security.md): **Cơ chế an toàn chuyển hướng và chống Open-Redirect**.
- [auth-threat-review.md](./auth-threat-review.md): **Đánh giá hiểm họa bảo mật xác thực (STRIDE Model)**.

---

## 3. Nguyên tắc bảo mật cơ bản

1. **Tuyệt đối không commit Secrets:** Không bao giờ commit file `.env`, file cấu hình chứa mật khẩu, private key hoặc service role token.
2. **Ngăn chặn truy cập chéo (Cross-tenant Data Leakage):** Mọi truy vấn database phải được kiểm soát chặt chẽ bằng Supabase RLS.
3. **Ẩn thông tin nhạy cảm khỏi log:** Không in token, mật khẩu, thông tin cá nhân vào `console.log` hay hệ thống ghi log tập trung.

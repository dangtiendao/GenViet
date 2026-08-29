# ADR-0003: Phân định Rạch ròi giữa Server Actions và Route Handlers

- **Mã Quyết định:** `ADR-0003`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
Để tránh việc lập trình viên tạo API tùy tiện hoặc lạm dụng Server Action cho các mục đích không phù hợp:
1. **Sử dụng Server Actions cho:** 100% các thao tác thay đổi dữ liệu (Mutations) xuất phát từ Form nội bộ ứng dụng (Tạo cây, Thêm/Sửa/Xóa thành viên, Nối quan hệ, Đổi center, Cập nhật cài đặt).
2. **Sử dụng Route Handlers (`/api/*`) cho:**
   - Xử lý Auth PKCE Callback từ Supabase Auth.
   - Cấp URL ký tải ảnh chân dung (`/api/media/sign-upload`).
   - Stream xuất file nhị phân sao lưu JSON dung lượng lớn (`/api/tree/:id/export`).
   - Endpoint kiểm tra sức khỏe hệ thống (`/api/healthz`).
3. Cả Server Action và Route Handler đều phải gọi vào **cùng một Service Layer**, không nhân đôi logic nghiệp vụ.

## 2. Hệ quả
- **Tích cực:** Tận dụng được cơ chế bảo vệ CSRF và revalidation tự động của Next.js; phân định rạch ròi giữa Form UI Mutation và HTTP Endpoint.
- **Tiêu cực:** Không cung cấp REST API công khai ra bên ngoài (phù hợp với phạm vi ứng dụng cá nhân MVP v0.1).

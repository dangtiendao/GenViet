# ADR-0004: Sử dụng Supabase Auth làm Nền tảng Định danh cho MVP v0.1

- **Mã Quyết định:** `ADR-0004`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Lựa chọn:** Sử dụng **Supabase Auth** (GoTrue Engine) làm nhà cung cấp định danh duy nhất cho GenViet v0.1.
- **Phương thức:** Email và Mật khẩu (theo PRD P01).
- **Cơ chế Phiên:** Sử dụng `@supabase/ssr` lưu JWT trong HTTP-Only Secure Cookies.
- **Bất biến Định danh (`INV-001`):** Phân định rạch ròi giữa `auth.users` (Tài khoản người dùng) và `public.persons` (Nhân vật gia phả).

## 2. Hệ quả
- **Tích cực:** Tích hợp trực tiếp với PostgreSQL Row Level Security qua hàm `auth.uid()`; loại bỏ rủi ro tự xây dựng hệ thống mã hóa mật khẩu; hỗ trợ sẵn quy trình Reset Password qua email.
- **Tiêu cực:** Phụ thuộc vào dịch vụ Supabase Auth (được chấp nhận như một quyết định kiến trúc chiến lược).

# Nhật ký Quyết định Kỹ thuật: Phase P06 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật phát sinh trong quá trình thiết lập hạ tầng Supabase cho Phase P06.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P06

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P06-DEC-001`** | **Khóa Phiên bản Supabase CLI Cục bộ:** | `ACCEPTED` | Cài đặt `supabase@^2.116.0` trong `devDependencies` của `package.json`, không dựa vào global CLI để đảm bảo tính tái lập trên mọi máy dev và CI. |
| **`P06-DEC-002`** | **Cơ chế Quản lý Cloud Project Không Lộ Token:** | `ACCEPTED` | Phân tách rõ: Kỹ sư/chủ dự án đăng nhập Dashboard tạo project `genviet-dev` theo checklist `docs/database/supabase-cloud-setup.md`; tuyệt đối không dán Personal Access Token vào repository hay file tracked. |
| **`P06-DEC-003`** | **Ranh giới Schema Nền tảng `_system`:** | `ACCEPTED` | Migration đầu tiên tạo schema `_system` và bảng `infrastructure_status` để phục vụ xác minh migration workflow và seed status; tuyệt đối không tạo các bảng nghiệp vụ thuộc phạm vi Phase P07. |
| **`P06-DEC-004`** | **Chuẩn hóa Adapter Cookie `@supabase/ssr`:** | `ACCEPTED` | Sử dụng pattern `getAll()` và `setAll(cookiesToSet)` mới nhất của `@supabase/ssr` kết hợp `cookies()` bất đồng bộ của Next.js 16. |
| **`P06-DEC-005`** | **Chính sách Sao lưu Bắt buộc trước Migration Production:** | `ACCEPTED` | Quy định không thực thi bất kỳ lệnh migration nào trên production nếu chưa có SQL dump hoặc logical backup hợp lệ lưu tại `.backups/` (được gitignore). |
| **`P06-DEC-006`** | **Tự động hóa Kiểm toán Migration & Stale Types trong CI:** | `ACCEPTED` | Tích hợp các scripts `supabase:check`, `check-migrations.mjs` và `verify-generated-types.mjs` vào chuỗi kiểm tra `npm run check`. |

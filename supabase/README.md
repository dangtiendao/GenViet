# Supabase Infrastructure Configuration & Migrations

Thư mục này chứa toàn bộ cấu hình Supabase Local Stack, danh mục migrations PostgreSQL và seed data cho dự án **GenViet**.

---

## 1. Cấu trúc Thư mục

- `config.toml`: Cấu hình Supabase local services (Auth, PostgreSQL, Studio, Storage, Inbucket).
- `full_schema.sql`: Tập tin SQL hợp nhất toàn bộ các migrations để triển khai 1 lần duy nhất trên môi trường mới/production hoặc Supabase SQL Editor.
- `migrations/`: Danh mục các file SQL migration được đánh số thứ tự theo timestamp `YYYYMMDDHHMMSS_*.sql`.
- `seed.sql`: Dữ liệu khởi tạo môi trường local development (tự động nạp khi reset database).
- `tests/`: Thư mục chứa pgTAP unit tests cho database functions & RLS policies (triển khai từ P08).

---

## 2. Các Lệnh Thao tác Nhanh

```bash
npm run supabase:start          # Khởi động Supabase local stack (Yêu cầu Docker Desktop)
npm run supabase:status         # Kiểm tra trạng thái các services local
npm run supabase:stop           # Dừng Supabase local stack
npm run supabase:reset          # Reset CSDL local, chạy lại migrations và seed
npm run supabase:schema:bundle  # Tái tạo và đồng bộ file full_schema.sql từ migrations/
npm run supabase:migrations:check # Kiểm tra định dạng migration và độ đồng bộ của full_schema.sql
npm run supabase:types          # Sinh lại TypeScript Database types từ CSDL local
npm run supabase:types:check    # Kiểm tra xem generated types có bị cũ/stale không
```

---

## 3. Quy tắc Bắt buộc khi Sửa đổi CSDL (Database Change Rule)

> [!IMPORTANT]
> **Mỗi khi tạo mới hoặc sửa đổi bất kỳ file migration SQL con nào trong `migrations/`:**
> 1. Chạy lệnh `npm run supabase:schema:bundle` để cập nhật lại `full_schema.sql`.
> 2. Chạy lệnh `npm run supabase:check` để xác minh độ đồng bộ và toàn vẹn của schema trước khi kết thúc task.


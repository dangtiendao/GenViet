# Ma Trận Biến Môi Trường (Environment Variables Matrix - P24-T04, P24-T05)

## 1. Phân Tách Biến Môi Trường Theo Môi Trường

| Tên Biến | Mục Đích | Môi Trường Áp Dụng | Phạm Vi Tiếp Xúc (Scope) | Tính Chất |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL kết nối API Supabase | Development, Preview, Production | Client Browser | Công khai (Public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public key cho RLS | Development, Preview, Production | Client Browser | Công khai (Public) |
| `NEXT_PUBLIC_APP_URL` | Canonical URL của ứng dụng | Production (`https://genviet.vn`) | Client Browser | Công khai (Public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Key đặc quyền quản trị | Development, Preview, Production | Server Only | **TUYỆT MẬT (Secret)** |
| `HEARTBEAT_SECRET` | Secret xác thực heartbeat định kỳ | Production | Server Only | **TUYỆT MẬT (Secret)** |
| `CRON_SECRET` | Secret xác thực Vercel Cron | Production | Server Only | **TUYỆT MẬT (Secret)** |
| `DATABASE_URL` | Chuỗi kết nối trực tiếp PostgreSQL | Development / Production | Server Only | **TUYỆT MẬT (Secret)** |

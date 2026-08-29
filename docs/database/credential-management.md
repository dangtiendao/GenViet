# Quản lý Thông tin Xác thực & Luân chuyển Khóa (Credential Management & Key Rotation)

- **Mã tài liệu:** `SEC-CRED-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Phân loại Khóa & Ranh giới Bảo mật (Key Classification)

| Tên Khóa / Biến môi trường | Phân vùng | Được phép Browser | Mô tả & Rủi ro |
| :--- | :---: | :---: | :--- |
| **`NEXT_PUBLIC_SUPABASE_URL`** | Public | ✅ Có | Endpoint API của Supabase Project |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** | Public | ✅ Có | Anonymous Key cho client, được RLS bảo vệ |
| **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** | Public | ✅ Có | Publishable Key theo mô hình mới của Supabase |
| **`SUPABASE_SERVICE_ROLE_KEY`** | Server | ❌ TUYỆT ĐỐI CẤM | Service Role Key bypass RLS, chỉ dùng server background |
| **`SUPABASE_SECRET_KEY`** | Server | ❌ TUYỆT ĐỐI CẤM | Secret Key theo mô hình mới của Supabase |
| **`DATABASE_URL` / `SUPABASE_DB_URL`** | Server | ❌ TUYỆT ĐỐI CẤM | Chuỗi kết nối trực tiếp PostgreSQL kèm password |
| **`CRON_SECRET`** | Server | ❌ TUYỆT ĐỐI CẤM | Khóa xác thực endpoint định kỳ |

---

## 2. Quy trình Luân chuyển Khóa khi Nghi ngờ Rò rỉ (Key Rotation Procedure)

Nếu nghi ngờ hoặc phát hiện Service Role Key / Database Password bị rò rỉ:
1. **Bước 1 (Thu hồi Ngay):** Truy cập Supabase Dashboard $\rightarrow$ **Project Settings** $\rightarrow$ **API** $\rightarrow$ Nhấn **Generate new API keys** (hoặc **Reset Database Password** trong Database Settings).
2. **Bước 2 (Cập nhật Môi trường Vercel / Cloudflare):** Điền khóa mới vào Environment Variables của Vercel Production và redeploy ngay lập tức.
3. **Bước 3 (Cập nhật Local):** Thay đổi giá trị trong file `.env.local` cá nhân.
4. **Bước 4 (Rà soát Nhật ký Truy cập):** Kiểm tra Supabase Audit Logs để phát hiện các truy vấn bất thường trong thời gian khóa cũ bị lộ.

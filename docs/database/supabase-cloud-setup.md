# Hướng dẫn Thiết lập Supabase Cloud Development Project (Cloud Setup Guide)

- **Mã tài liệu:** `DB-CLOUD-01`
- **Phiên bản:** `v0.1-baseline`
- **Project mục tiêu:** `genviet-dev`
- **Trạng thái thực thi:** `MANUAL_ACTION_REQUIRED` (Cần quyền truy cập tài khoản chủ dự án)

---

## 1. Hướng dẫn Từng bước cho Chủ Dự án (Owner Setup Checklist)

Do việc tạo project đám mây yêu cầu quyền tài khoản Supabase và lựa chọn Organization/Region mà không lộ Personal Access Token trong Git repository, Chủ sở hữu dự án thực hiện theo checklist sau:

### Bước 1: Tạo Cloud Development Project
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard).
2. Chọn Organization của bạn.
3. Nhấn **New Project** và điền thông tin:
   - **Name:** `genviet-dev`
   - **Database Password:** Tạo mật khẩu mạnh (tối thiểu 16 ký tự) và lưu vào Password Manager.
   - **Region:** `Southeast Asia (Singapore) - ap-southeast-1` (Khuyến nghị để tối ưu độ trễ cho người dùng tại Việt Nam).
   - **Pricing Plan:** `Free Tier` ($0/tháng).
4. Nhấn **Create new project** và đợi 1-2 phút để hạ tầng sẵn sàng.

### Bước 2: Lấy Thông tin Kết nối & Cấu hình Local
1. Vào **Project Settings** $\rightarrow$ **API**:
   - Sao chép **Project URL** $\rightarrow$ gán vào `NEXT_PUBLIC_SUPABASE_URL` trong file `.env.local`.
   - Sao chép **anon public key** $\rightarrow$ gán vào `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong file `.env.local`.
2. Vào **Project Settings** $\rightarrow$ **General**:
   - Sao chép **Reference ID** (Project Ref, ví dụ: `abcdefghijklmnop`).

### Bước 3: Liên kết Mã nguồn Cục bộ với Cloud Project
Mở terminal tại thư mục gốc dự án và chạy:
```bash
npx supabase link --project-ref <your-project-ref>
```

### Bước 4: Đẩy Migration Nền tảng lên Cloud Development
```bash
npm run supabase:db:push:dev
```
*(Lệnh này sẽ áp dụng file migration nền tảng `20260829152230_p06_initialize_supabase_foundation.sql` lên CSDL `genviet-dev`).*

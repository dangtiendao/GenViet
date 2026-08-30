# Hướng Dẫn Gắn Tên Miền Tùy Chỉnh (Custom Domain - P24-T08)

## 1. Các Bước Cấu Hình Trên Vercel
1. Truy cập **Vercel Project Dashboard** $\rightarrow$ **Settings** $\rightarrow$ **Domains**.
2. Nhập tên miền chính: `genviet.vn`.
3. Chọn tùy chọn chuyển hướng tự động `www.genviet.vn` về `genviet.vn` (hoặc ngược lại tùy nhu cầu canonical).
4. Lưu lại các giá trị bản ghi DNS do Vercel cung cấp:
   - **Bản ghi A:** `76.76.21.21` cho `genviet.vn`
   - **Bản ghi CNAME:** `cname.vercel-dns.com` cho `www.genviet.vn`

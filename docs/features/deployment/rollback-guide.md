# Sổ Tay Quy Trình Khôi Phục & Rollback (Production Rollback Guide - P24-T15)

## 1. Các Tình Huống Kích Hoạt Rollback
- Tỷ lệ lỗi 5xx trên Production tăng đột biến (> 1%).
- Luồng Auth callback hoặc Login bị gián đoạn hoàn toàn.
- Lỗ hổng bảo mật nghiêm trọng (Rò rỉ Service Role, vỡ RLS).
- Tệp Service Worker PWA gặp lỗi vòng lặp cập nhật.

## 2. Các Bước Thực Hiện Rollback

### Bước 1: Khôi phục ứng dụng trên Vercel (Instant Rollback)
1. Truy cập **Vercel Dashboard** $\rightarrow$ **Deployments**.
2. Tìm bản build gần nhất hoạt động ổn định (Last Known Good Deployment).
3. Nhấp vào menu 3 chấm $\rightarrow$ **Instant Rollback** để tái kích hoạt bản build này trỏ về Production Domain.

### Bước 2: Khôi phục mã nguồn Git
- Tạo commit revert cục bộ: `git revert HEAD -m 1`.
- Kiểm tra tính tương thích và kiểm thử trước khi tạo Pull Request mới.

### Bước 3: Đảm bảo tính tương thích Cơ sở dữ liệu (Database Compatibility)
- **Lưu ý quan trọng:** Vercel Rollback KHÔNG tự động rollback cơ sở dữ liệu Supabase.
- Mọi database migration của GenViet đều tuân thủ nguyên tắc **Forward-Only Schema** (không drop cột/bảng đang dùng), do đó bản build ứng dụng cũ vẫn tương thích với database mới.

### Bước 4: Kiểm tra xác nhận sau Rollback
Chạy lại kịch bản smoke test:
```bash
node scripts/deployment/smoke-production.mjs https://genviet.vn
```

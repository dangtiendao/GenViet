# Sổ Tay Xử Lý Sự Cố: Triển Khai Build / Release Lỗi (Deployment Failure Runbook - P25-T14)

- **Mức độ sự cố:** `SEV-2` hoặc `SEV-3`.
- **Người chịu trách nhiệm chính:** Release Engineer / SRE.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Lệnh build thất bại trên Vercel do lỗi Typecheck, Lint hoặc thiếu biến môi trường.
- Bản build triển khai thành công nhưng xuất hiện lỗi 5xx trên Production ngay sau khi phát hành.
- Lỗi Service Worker PWA gây vòng lặp tải lại trang cho người dùng.

## 2. Quy Trình Khắc Phục Chuẩn
1. **Kích hoạt Instant Rollback:** Truy cập Vercel Dashboard $\rightarrow$ Deployments $\rightarrow$ kích hoạt bản build ổn định trước đó (Last Known Good Deployment) trỏ về Production Domain.
2. **Khôi phục mã nguồn Git:** Tạo commit revert cục bộ: `git revert HEAD -m 1`.
3. **Chạy Production Smoke Test:** Xác minh lại hệ thống qua `scripts/deployment/smoke-production.mjs`.

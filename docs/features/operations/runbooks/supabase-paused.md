# Sổ Tay Xử Lý Sự Cố: Dự Án Supabase Bị Tạm Dừng (Supabase Paused Runbook - P25-T17)

- **Mức độ sự cố:** `SEV-1`.
- **Người chịu trách nhiệm chính:** Supabase Operations Engineer / System Administrator.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Mọi truy vấn database đều bị từ chối kết nối (`Project is paused`).
- Hệ thống Heartbeat P21 báo cáo `heartbeat.stale` hoặc không thể ghi bản ghi mới.

## 2. Quy Trình Khôi Phục Hoạt Động (Unpause Project)
1. Đăng nhập Supabase Dashboard $\rightarrow$ chọn Project `GenViet`.
2. Nhấn nút **Restore / Unpause Project** để khởi động lại máy chủ cơ sở dữ liệu.
3. Chờ từ 1 - 3 phút để các container PostgreSQL và GoTrue Auth hoàn tất khởi động.
4. Chạy script kiểm tra sức khỏe Heartbeat:
   ```bash
   node scripts/operations/inspect-heartbeat.mjs
   ```
5. Chạy smoke test toàn hệ thống:
   ```bash
   node scripts/deployment/smoke-production.mjs https://genviet.vn
   ```

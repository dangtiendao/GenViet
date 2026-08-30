# Quy Trình Sao Lưu Cơ Sở Dữ Liệu Thủ Công (Database Backup - P25-T10)

## 1. Công Cụ Sao Lưu
Thực thi script sao lưu bảo vệ:
```bash
node scripts/operations/create-database-backup.mjs
```

## 2. Đặc Điểm An Toàn
- Tệp backup và manifest lưu tại `.backups/database/` (đã được cấu hình trong `.gitignore`).
- Tự động sinh mã băm SHA-256 xác thực tính toàn vẹn.
- Ngăn chặn chạy nhầm trên môi trường Production khi chưa có cờ xác nhận.

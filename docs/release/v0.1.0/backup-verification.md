# Báo Cáo Kiểm Chứng Sao Lưu Dữ Liệu (Backup Verification Report - P26-T05)

- **Mục tiêu:** Kiểm tra hai cơ chế sao lưu: Sao lưu ứng dụng (Application JSON Backup - P19) và Sao lưu cơ sở dữ liệu (PostgreSQL Logical Backup - P25).
- **Trạng thái:** `PASS`

---

## 1. Sao Lưu Ứng Dụng (Application JSON Backup - P19)
- Định dạng xuất: JSON chuẩn v1.0.
- Xác minh tính toàn vẹn: Checksum sha256 và cấu trúc Person, Relationship, Union.
- Kiểm tra bảo mật: Không chứa JWT tokens, session cookies hay signed URLs.
- Nhập lại (Import): Tự động remap ID và tạo cây gia phả mới hoàn toàn độc lập mà không ảnh hưởng cây gốc.

## 2. Sao Lưu Cơ Sở Dữ Liệu Có Cơ Chế Bảo Vệ (Guarded DB Backup - P25)
- Công cụ thực thi: `scripts/operations/create-database-backup.mjs`.
- Manifest & Checksum: Sinh tệp JSON Manifest chứa mã băm SHA-256 xác thực toàn vẹn.
- Thư mục lưu trữ: `.backups/database/` (được bảo vệ trong `.gitignore`, không bao giờ commit vào Git).
- Cơ chế chống chạy nhầm: Bắt buộc xác nhận cờ khi thực thi trên môi trường ngoài.

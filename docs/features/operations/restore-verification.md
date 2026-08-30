# Kiểm Chứng Phục Hồi Cơ Sở Dữ Liệu Cô Lập (Restore Verification - P25-T11)

## 1. Quy Trình Kiểm Chứng
1. Xác minh tính toàn vẹn qua mã băm SHA-256:
   ```bash
   node scripts/operations/verify-backup.mjs
   ```
2. Phục hồi vào schema/database thử nghiệm cô lập:
   ```bash
   node scripts/operations/restore-backup-isolated.mjs
   ```
3. Kiểm tra xác nhận tính toàn vẹn RLS, Trigger và Foreign Keys:
   ```bash
   node scripts/operations/verify-restored-database.mjs
   ```

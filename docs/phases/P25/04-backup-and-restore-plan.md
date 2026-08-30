# Phase P25: Kế Hoạch Sao Lưu & Phục Hồi (Backup & Restore Plan)

- **Sao lưu:** Script `create-database-backup.mjs` sinh tệp SQL và Manifest SHA-256 vào `.backups/database/`.
- **Phục hồi thử nghiệm:** Script `restore-backup-isolated.mjs` nạp vào môi trường cô lập để kiểm chứng RLS, Triggers và Foreign Keys.

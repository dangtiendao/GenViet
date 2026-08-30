# Phase P19: Biên Bản Bàn Giao (Phase Handover)

## 1. Thông Tin Bàn Giao
- **Mã Phase:** P19
- **Tên Phase:** Sao lưu và khôi phục
- **Nhánh Thực Hiện:** `phase/p19-json-backup-restore`
- **Trạng Thái:** **COMPLETED & ACCEPTED**

---

## 2. Hướng Dẫn Bàn Giao Cho Các Phase Sau
- **Bàn giao P20 (PWA & Offline-First):**
  - Không cache file backup hoặc nội dung import vào service worker shared cache.
  - Phục hồi kết nối mạng trước khi thực hiện import transaction.
- **Bàn giao P22 (Security & Hardening):**
  - Fixtures kiểm thử tệp tiêm nhiễm, cycle, duplicate ID trong `tests/fixtures/backups/`.
  - Bộ kiểm thử kháng secret scan và digest SHA-256 integrity.
- **Bàn giao P25 (Maintenance & Operations):**
  - Giới hạn file-size 10MB và giới hạn số lượng phần tử (5.000 Persons, 10.000 Relationships).
  - Phân biệt giữa Application Backup (file JSON) và Infrastructure Database Backup (pg_dump / WAL archiving).
- **Bàn giao P26 (Release & Acceptance):**
  - Tiêu chuẩn chấp nhận sao lưu và khôi phục v1 (`schemas/genviet-backup-v1.schema.json`).

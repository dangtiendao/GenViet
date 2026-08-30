# Phase P17: Biên Bản Bàn Giao (Phase Handover)

## 1. Thông Tin Bàn Giao
- **Mã Phase:** P17
- **Tên Phase:** Ảnh đại diện và Storage
- **Nhánh Thực Hiện:** `phase/p17-avatar-storage`
- **Trạng Thái:** **COMPLETED & ACCEPTED**

---

## 2. Hướng Dẫn Bàn Giao Cho Các Phase Sau
- **Bàn giao P18 (Audit & Activity Log):**
  - Các sự kiện cần audit: `avatar.created`, `avatar.replaced`, `avatar.deleted`.
  - Không bao giờ audit Signed URL hoặc Token cấp quyền.
- **Bàn giao P22 (Security & Hardening):**
  - Fixture test giả mạo MIME bytes, kiểm tra cách ly cross-tree và kiểm tra hết hạn của Signed URL.
- **Bàn giao P23 (Performance & Optimization):**
  - TTL bộ nhớ đệm client (900s), chi phí sinh Signed URL và dung lượng tối ưu của WebP.
- **Bàn giao P25 (Maintenance & Operations):**
  - Lệnh quét dọn file mồ côi: `node scripts/storage/cleanup-orphan-avatars.mjs [--dry-run | --force]`.

# Chính Sách Lưu Trữ Nhật Ký (Audit Log Retention Policy)

## 1. Nguyên Tắc Bảo Tồn Vĩnh Viễn Trong MVP
- Toàn bộ dữ liệu `audit_logs` được bảo lưu vĩnh viễn trong phiên bản v0.1 phục vụ mục đích kiểm vết và điều tra biến động lịch sử.
- Không áp dụng chính sách tự động xóa (auto-purge) trên bảng nhật ký.
- Quản trị viên có thể sử dụng công cụ kiểm tra dung lượng `node scripts/retention/audit-retention-dry-run.mjs` để theo dõi tốc độ tăng trưởng của bảng.

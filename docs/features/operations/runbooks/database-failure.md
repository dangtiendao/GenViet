# Sổ Tay Xử Lý Sự Cố: Cơ Sở Dữ Liệu Lỗi (Database Failure Runbook - P25-T12)

- **Mức độ sự cố:** `SEV-1` (Toàn bộ ứng dụng không truy cập được) hoặc `SEV-2` (Degraded / Slow query).
- **Người chịu trách nhiệm chính:** Site Reliability Engineer / Database Administrator.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Lỗi 5xx tăng đột biến trên các Route Handler (`/api/trees/*`, `/dashboard`).
- Log ghi nhận lỗi `Connection terminated`, `Query timeout` hoặc `Connection pool exhausted`.
- Cơ sở dữ liệu Supabase bị chuyển trạng thái `Unhealthy` hoặc `Paused`.

## 2. Các Hành Động Nghiêm Cấm Tuyệt Đối
- **CẤM:** Tắt RLS (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY`) để thử debug.
- **CẤM:** Chạy các câu lệnh SQL phá hủy cấu trúc (`DROP TABLE`, `TRUNCATE`) trên Production.
- **CẤM:** Tự ý chạy script `restore` đè lên cơ sở dữ liệu Production khi chưa có phê duyệt.

## 3. Quy Trình Khắc Phục Chuẩn
1. **Kiểm tra trạng thái Supabase:** Truy cập Supabase Dashboard kiểm tra mức sử dụng CPU, RAM, Disk Space và Pooler Connections.
2. **Kiểm tra Log & Request ID:** Tra cứu Request ID của các lỗi 500 gần nhất để xác định bảng hoặc hàm SQL gặp sự cố.
3. **Khôi phục kết nối:** Nếu pooler quá tải, khởi động lại Connection Pooler (PGBouncer / Supavisor).
4. **Phục hồi từ bản sao lưu:** Nếu dữ liệu bị hỏng nghiêm trọng, kích hoạt quy trình phục hồi từ bản sao lưu gần nhất theo `restore-verification.md`.

# Phân Cấp Cảnh Báo & Chính Sách Lưu Trữ Log (Alerting & Retention)

## 1. Ma Trận Mức Độ Sự Cố (Severity Matrix)
- **SEV-1 (Khẩn cấp):** Rò rỉ bí mật, vỡ RLS dữ liệu chéo, mất kết nối toàn bộ hệ thống. Phản hồi trong < 15 phút.
- **SEV-2 (Nghiêm trọng):** Luồng đăng nhập hoặc upload bị gián đoạn, lỗi 5xx diện rộng. Phản hồi trong < 1 giờ.
- **SEV-3 (Cảnh báo):** Heartbeat quá hạn, lỗi một route đơn lẻ, tỷ lệ auth rejection tăng. Phản hồi trong < 4 giờ.
- **SEV-4 (Thông tin):** Cảnh báo tài nguyên, thông tin vận hành thông thường.

## 2. Thời Gian Lưu Trữ (Retention Policy)
- **Vercel Runtime Logs:** Theo gói Hobby hiện hành (1 ngày).
- **Error Tracker Events:** 30 - 90 ngày.
- **Database Backups:** Giữ 7 bản sao lưu gần nhất.

# Sổ Tay Xử Lý Sự Cố: Rò Rỉ Bí Mật (Secret Exposure Runbook - P25-T16)

- **Mức độ sự cố:** `SEV-1` (Nguy cơ vi phạm an toàn dữ liệu nghiêm trọng).
- **Người chịu trách nhiệm chính:** Application Security Engineer / Security Lead.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Service Role Key, Database URL hoặc Heartbeat Secret vô tình bị commit vào Git hoặc xuất hiện trong build bundle/log công khai.

## 2. Quy Trình Khắc Phục Khẩn Cấp
1. **Thu hồi (Revoke & Rotate) ngay lập tức:**
   - Đăng nhập Supabase Dashboard $\rightarrow$ Settings $\rightarrow$ API $\rightarrow$ nhấn **Generate New Secret Key** để vô hiệu hóa key cũ.
   - Đổi mật khẩu PostgreSQL nếu Database URL bị lộ.
2. **Cập nhật Vercel Environment Variables:** Cập nhật ngay các biến môi trường mới trên Vercel và kích hoạt Redeploy.
3. **Quét lịch sử Git:** Chạy script `scripts/deployment/scan-client-secrets.mjs` để xác nhận không còn secret nào sót lại trong code.

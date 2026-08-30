# Sổ Tay Xử Lý Sự Cố: Mất Tên Miền / DNS / SSL Lỗi (Domain Loss Runbook - P25-T15)

- **Mức độ sự cố:** `SEV-1` (Mất kết nối toàn bộ hệ thống).
- **Người chịu trách nhiệm chính:** Cloudflare DNS Engineer / Domain Owner.
- **Ngày rà soát gần nhất:** 30/08/2026.

## 1. Dấu Hiệu Nhận Biết
- Trình duyệt báo lỗi `DNS_PROBE_FINISHED_NXDOMAIN` hoặc `ERR_SSL_VERSION_OR_CIPHER_MISMATCH`.
- Tên miền hết hạn đăng ký tại Registrar.
- Cấu hình Cloudflare Proxy (Đám mây cam) bị bật nhầm làm hỏng chứng chỉ SSL của Vercel.

## 2. Quy Trình Khắc Phục Chuẩn
1. **Kiểm tra trạng thái DNS Cloudflare:** Đảm bảo các bản ghi A (`76.76.21.21`) và CNAME (`cname.vercel-dns.com`) đang ở chế độ **DNS Only (Đám mây xám)**.
2. **Kiểm tra gia hạn tên miền:** Đăng nhập vào Domain Registrar xác minh ngày hết hạn và thanh toán gia hạn nếu cần.
3. **Kích hoạt phát hành lại chứng chỉ SSL:** Trên Vercel Domains Dashboard, nhấn nút **Refresh / Re-issue Certificate**.

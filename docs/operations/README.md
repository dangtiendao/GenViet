# Operations Documentation

Thư mục này chứa tài liệu về vận hành hạ tầng, quy trình triển khai (Deployment), tích hợp liên tục (CI/CD), quản lý tên miền (DNS) và giám sát hệ thống (Monitoring) của dự án **GenViet**.

---

## 1. Mục đích & Phạm vi

- Hướng dẫn thiết lập môi trường (Development, Staging, Production).
- Quy trình cấu hình Vercel, Supabase Cloud và Cloudflare DNS.
- Quản lý chiến lược sao lưu (Backup) và phục hồi thảm họa (Disaster Recovery) cho cơ sở dữ liệu PostgreSQL.
- Định hướng kế hoạch di chuyển hạ tầng (Migration plan) khi tách rời khỏi các dịch vụ hosting ban đầu.

---

## 2. Cấu trúc tài liệu dự kiến

- `README.md`: Chỉ mục và hướng dẫn vận hành (file này).
- `deployment-guide.md`: Hướng dẫn cấu hình triển khai trên Vercel và Supabase.
- `dns-and-domains.md`: Cấu hình Cloudflare DNS, SSL/TLS, Caching rules.
- `backup-and-recovery.md`: Quy trình tự động backup database và kế hoạch khôi phục.
- `monitoring-and-logging.md`: Giám sát uptime, lỗi ứng dụng (Error tracking) và hiệu năng (Web Vitals).

---

## 3. Nguyên tắc vận hành

1. **Infrastructure as Code / Documented Configuration:** Mọi thiết lập hạ tầng phải được ghi chép chi tiết để có thể dựng lại môi trường mới từ đầu trong thời gian ngắn nhất.
2. **Ưu tiên chi phí thấp:** Tối ưu hóa việc tiêu thụ tài nguyên trên các gói Free Tier, thiết lập cảnh báo khi chạm ngưỡng giới hạn (quota limits).
3. **Quy trình deploy an toàn:** Mọi release lên production đều phải tuân thủ [Quy trình phát hành](../release-process.md).

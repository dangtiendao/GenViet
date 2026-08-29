# Yêu cầu Kỹ thuật An ninh & Bảo vệ Dữ liệu (Security Requirements)

- **Mã tài liệu:** `SEC-REQUIREMENTS-01`
- **Mã Kiến trúc liên quan:** `SEC-001..010`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## Danh mục 10 Yêu cầu An ninh Bắt buộc (Mandatory Security Controls)

1. **`SEC-001` (Kích hoạt 100% Row Level Security):** Tất cả các bảng dữ liệu trong schema `public` (`trees`, `memberships`, `persons`, `relationships`, `marriages`, `media_metadata`, `audit_logs`) bắt buộc phải bật `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
2. **`SEC-002` (Bảo vệ Phiên làm việc qua Cookie HTTP-Only):** JWT session cookie phải được cấu hình cờ `HttpOnly`, `Secure`, `SameSite=Lax` để chống tấn công XSS và CSRF.
3. **`SEC-003` (Cô lập Khóa Quản trị Máy chủ):** `SUPABASE_SERVICE_ROLE_KEY` chỉ được đặt trong biến môi trường server bí mật (`.env.local` không commit Git); kiểm toán bundle JS để đảm bảo 0% khả năng rò rỉ ra trình duyệt.
4. **`SEC-004` (Xác thực Dữ liệu Đầu vào Đa lớp):** 100% dữ liệu từ máy khách gửi lên Server Actions phải được xác thực kiểu dữ liệu và giới hạn độ dài bằng thư viện Zod.
5. **`SEC-005` (Bảo vệ File Storage bằng Chữ ký Thời hạn):** Bucket media luôn ở chế độ `Private`; chỉ truy cập ảnh qua Signed URLs thời hạn $\le 15$ phút.
6. **`SEC-006` (Kiểm soát Nghiêm ngặt Định dạng & Dung lượng Tải lên):** Chỉ chấp nhận định dạng ảnh `image/jpeg`, `image/png`, `image/webp` với dung lượng tối đa $5\text{MB}$. Cấm tuyệt đối định dạng `image/svg+xml` trong phân hệ tải ảnh người dùng (chống stored XSS).
7. **`SEC-007` (Lọc Dữ liệu Nhạy cảm Khỏi Nhật ký):** Hệ thống logging phải tự động lọc bỏ (redact) mật khẩu, token, private key và số CCCD trước khi ghi ra console hoặc gửi tới dịch vụ telemetry.
8. **`SEC-008` (Bảo mật Tệp Sao lưu JSON):** Route Handler tải file sao lưu phải xác thực quyền chủ sở hữu cây và ghi nhận sự kiện vào `audit_logs`.
9. **`SEC-009` (Cấu hình Security Headers):** Ứng dụng phải cấu hình các HTTP Security Headers cơ bản: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
10. **`SEC-010` (Kiểm tra Lỗ hổng Thư viện Định kỳ):** Bật công cụ GitHub Dependabot và chạy lệnh `npm audit` trong pipeline CI/CD để phát hiện sớm các thư viện có lỗ hổng bảo mật.

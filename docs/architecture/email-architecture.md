# Kiến trúc Phân hệ Gửi Email (Email Architecture & Adapter Seam)

- **Mã tài liệu:** `ARCH-EMAIL-01`
- **Mã Kiến trúc liên quan:** `ADP-002`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Phân định Hai Nhóm Email trong Hệ thống

1. **Nhóm 1: Email Xác thực Hệ thống (Auth Emails - Active trong v0.1):**
   - Bao gồm: Email xác nhận tài khoản, Email gửi link đặt lại mật khẩu.
   - **Cơ chế xử lý:** Do **Supabase Auth Engine (`CNT-003`)** tự động điều phối trực tiếp, không đi qua Application Service của Next.js.
2. **Nhóm 2: Email Thông báo Nghiệp vụ (Transactional Application Emails - Deferred Post-MVP):**
   - Bao gồm: Lời mời tham gia cây gia phả, thông báo cập nhật ngày giỗ dòng họ (tính năng thuộc v0.2+).
   - **Cơ chế xử lý:** Được thiết kế sẵn qua **Email Adapter Seam (`IEmailAdapter`)** nhưng chưa kích hoạt trong bản phát hành v0.1.

---

## 2. Đặc tả Hợp đồng Email Adapter (IEmailAdapter - `ADP-002`)

> [!NOTE]
> Khai báo dưới đây là ví dụ hợp đồng kiến trúc (**`NON-PRODUCTION ARCHITECTURE EXAMPLE`**), không phải mã nguồn production.

```typescript
// NON-PRODUCTION ARCHITECTURE EXAMPLE

export interface SendEmailPayload {
  to: string;
  templateId: string;
  locale: 'vi' | 'en';
  variables: Record<string, string>;
  idempotencyKey?: string;
}

export interface IEmailAdapter {
  sendTransactionalEmail(payload: SendEmailPayload): Promise<{ success: boolean; messageId?: string }>;
}
```

### Các Quy tắc An toàn khi Gửi Email:
- **Không Ghi Secret vào Log:** Tuyệt đối không in mã token reset mật khẩu hay link magic-link vào file log hệ thống.
- **Không Gửi Dữ liệu Nhạy cảm:** Email thông báo chỉ chứa tiêu đề tóm tắt và đường link bảo mật yêu cầu người dùng đăng nhập để xem, không đính kèm toàn bộ gia phả qua email.
- **Thất bại Gửi Email Không Làm Hỏng Giao dịch CSDL:** Việc gửi email chỉ là một tác vụ phụ (Side-effect), nếu gửi email lỗi sẽ không làm rollback dữ liệu trong PostgreSQL.

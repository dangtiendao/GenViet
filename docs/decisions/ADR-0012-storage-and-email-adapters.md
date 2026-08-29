# ADR-0012: Thiết kế Adapter Seams cho Lưu trữ Media và Gửi Email

- **Mã Quyết định:** `ADR-0012`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Thiết kế các **Lớp Tiếp hợp (Adapter Interfaces)** để cô lập các dịch vụ đám mây bên thứ ba:
  1. **`IStorageAdapter`:** Trừu tượng hóa việc ký URL upload/download ảnh đại diện (`SupabaseStorageAdapter` cho MVP, `CloudflareR2StorageAdapter` cho tương lai).
  2. **`IEmailAdapter`:** Trừu tượng hóa việc gửi email giao dịch thông báo (`ResendAdapter` / `PostmarkAdapter` cho post-MVP).
- **Ranh giới:** Service Layer không bao giờ import SDK của nhà cung cấp cụ thể.

## 2. Hệ quả
- **Tích cực:** Cho phép thay đổi nhà cung cấp đám mây mà không phải sửa logic nghiệp vụ cốt lõi; hỗ trợ tạo Mock Adapter hoàn hảo khi chạy automated tests.
- **Tiêu cực:** Phải duy trì thêm các interface và DTO trung gian.

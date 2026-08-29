# ADR-0007: Sử dụng Supabase Storage Private Bucket cho Avatar & Media MVP v0.1

- **Mã Quyết định:** `ADR-0007`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Sử dụng **Supabase Storage** với Bucket `avatars` được thiết lập ở chế độ **Private** (`public = false`) để lưu trữ ảnh chân dung thành viên.
- **Ranh giới:** CSDL PostgreSQL chỉ lưu chuỗi `avatar_key` (đường dẫn ngẫu nhiên); tệp tin nhị phân tải lên trực tiếp qua Signed Upload URL và tải xuống qua Signed Read URL thời hạn ngắn ($\le 15$ phút).
- **Cách ly qua Adapter:** Lõi nghiệp vụ giao tiếp qua `IStorageAdapter`, sẵn sàng chuyển sang Cloudflare R2 trong tương lai.

## 2. Hệ quả
- **Tích cực:** Bảo vệ ảnh chân dung riêng tư của dòng họ khỏi việc bị quét link công khai; giảm tải băng thông xử lý binary cho server Next.js.
- **Tiêu cực:** Phải sinh Signed URL định kỳ khi hiển thị ảnh trên giao diện.

# ADR-0015: Giữ Vững Tính Linh động Runtime và Sẵn sàng Chuyển sang Cloudflare

- **Mã Quyết định:** `ADR-0015`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Chuẩn hóa toàn bộ mã nguồn của GenViet tuân thủ các tiêu chuẩn **Web APIs (Fetch, Request, Response, Web Crypto, Cookies)**, tránh phụ thuộc vào các API đặc thù của môi trường Node.js truyền thống (như `fs`, C++ native bindings).
- **Ranh giới:** Đảm bảo hệ thống có thể được đóng gói và vận hành mượt mà trên **Cloudflare Workers** (thông qua OpenNext) và **Cloudflare R2** mà không cần sửa đổi kiến trúc nghiệp vụ cốt lõi.

## 2. Hệ quả
- **Tích cực:** Tối ưu hóa tính di động của mã nguồn; giảm thiểu độ trễ phản hồi toàn cầu (Edge latency); mở rộng khả năng triển khai đa đám mây (Multi-cloud).
- **Tiêu cực:** Không thể sử dụng một số thư viện Node.js cũ chưa hỗ trợ Web Crypto hoặc Edge Runtime.

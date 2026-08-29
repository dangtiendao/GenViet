# ADR-0001: Sử dụng Next.js App Router làm Kiến trúc Định tuyến & Render Chính

- **Mã Quyết định:** `ADR-0001`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Vấn đề (Context & Problem)
GenViet cần một framework hiện đại để phát triển Web App quản lý cây gia phả cá nhân với yêu cầu:
- Tối ưu hóa hiệu năng tải trang ban đầu (First Load JS) trên thiết bị di động.
- Hỗ trợ kết hợp linh hoạt giữa Server-Side Rendering (SSR) bảo mật và Client-Side Rendering (CSR) tương tác đồ thị.
- Định tuyến phân cấp, hỗ trợ Layout dùng chung cho Dashboard và Canvas.

## 2. Các Lựa chọn Đã Cân nhắc (Options Considered)
1. **Next.js Pages Router (Mô hình cũ):** Đã trưởng thành nhưng thiếu Server Components gốc, kích thước bundle tải về client lớn hơn.
2. **Next.js App Router (Mô hình mới):** Chuẩn hóa React Server Components (RSC), tối ưu hóa streaming, hỗ trợ Server Actions và Route Handlers tích hợp.
3. **Vite + React SPA thuần:** Tương tác client tốt nhưng không có SSR bảo mật, khó tối ưu bảo mật khóa API và hiệu năng tải ban đầu.

## 3. Quyết định Kiến trúc (Decision)
**Lựa chọn Next.js App Router** làm kiến trúc định tuyến và render chính thức cho toàn bộ ứng dụng GenViet v0.1.

## 4. Hệ quả & Tác động (Consequences & Trade-offs)
- **Tích cực:** Giảm thiểu First Load JS trên mobile ($< 150\text{KB}$); tải dữ liệu gia phả trực tiếp tại server; tích hợp mượt mà với `@supabase/ssr`.
- **Tiêu cực:** Đòi hỏi lập trình viên phải hiểu rõ ranh giới Server vs Client Component; cơ chế caching của App Router cần được kiểm soát chặt chẽ.
- **Tác động An ninh & Riêng tư:** Tăng cường an ninh do dữ liệu nhạy cảm được lọc tại server trước khi gửi xuống client.
- **Tính Linh động Nền tảng:** Tương thích tốt với Vercel và sẵn sàng chuyển sang Cloudflare Workers thông qua OpenNext adapter.

## 5. Kế hoạch Triển khai & Xác minh (Implementation & Verification)
- Triển khai trong Phase P05 (Khởi tạo mã nguồn) và kiểm thử trong Phase P22 (Kiểm thử tích hợp).

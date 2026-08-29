# Danh mục Giả định Kiến trúc Hệ thống: Phase P04 (Architecture Assumptions)

- **Mã tài liệu:** `ARCH-ASSUMPTIONS-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## Danh mục Các Giả định Kiến trúc Kỹ thuật Cốt lõi (v0.1)

| Mã Giả định | Nội dung Giả định Kiến trúc | Căn cứ Thiết kế | Mức độ Rủi ro |
| :--- | :--- | :--- | :---: |
| **`P04-ASM-001`** | Supabase SSR package (`@supabase/ssr`) đáp ứng đầy đủ cơ chế quản lý session cookie trên cả Next.js App Router (Node.js) và Edge Runtime. | Tài liệu chính thức Supabase SSR 2026. | Thấp |
| **`P04-ASM-002`** | Thuật toán `elk.layered` của ELK.js đáp ứng tốt yêu cầu tự động bố trí đồ thị phả hệ Việt Nam phân tầng mà không cần viết thuật toán layout từ đầu. | Kiến trúc đã được kiểm chứng trong các hệ thống phả hệ hiện đại. | Thấp |
| **`P04-ASM-003`** | Mô hình Single-Owner (một người sở hữu cây) trong v0.1 giúp đơn giản hóa chính sách RLS `owner_id = auth.uid()`, giảm thiểu xung đột ghi đồng thời. | PRD P01 Scope Baseline. | Thấp |
| **`P04-ASM-004`** | Quy mô tối đa 1.000 người/cây trong v0.1 có thể xử lý trọn vẹn trong bộ nhớ RAM client khi xuất sao lưu JSON mà không cần background queue worker phức tạp. | Giới hạn 1.000 bản ghi JSON $\approx 2\text{MB}$ payload. | Thấp |
| **`P04-ASM-005`** | Việc tuân thủ chuẩn Web APIs sẽ đảm bảo mã nguồn Next.js có thể chuyển sang Cloudflare Workers thông qua OpenNext với tỷ lệ tương thích $\ge 95\%$. | OpenNext & Cloudflare Architecture Guide. | Trung bình |

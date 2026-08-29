# ADR-0009: Sử dụng ELK.js làm Thuật toán Tính toán Bố cục Phân tầng Tự động

- **Mã Quyết định:** `ADR-0009`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Sử dụng thư viện **ELK.js (Eclipse Layout Kernel)** với thuật toán `elk.layered` để tự động sắp xếp các thế hệ trong gia phả thành các hàng ngang trật tự.
- **Ranh giới:** ELK.js nhận đầu vào là `Layout Graph` (kích thước node, quan hệ) và trả về `tọa độ (x, y)`. Kết quả của ELK chỉ là dữ liệu hiển thị tạm thời, không lưu vào PostgreSQL.
- **Tối ưu Hiệu năng:** Hỗ trợ chạy tính toán layout bên trong **Web Worker** trên trình duyệt để đảm bảo giao diện luôn đạt $\ge 45\text{ FPS}$ trên điện thoại.

## 2. Hệ quả
- **Tích cực:** Tự động hóa 100% việc tính toán vị trí hiển thị phả hệ phức tạp; giảm thiểu giao cắt đường nối; độc lập hoàn toàn khỏi thư viện render.
- **Tiêu cực:** Kích thước bundle của ELK.js khá lớn ($\sim 1\text{MB}$ uncompressed), cần áp dụng kỹ thuật dynamic import và Web Worker ở Phase P15.

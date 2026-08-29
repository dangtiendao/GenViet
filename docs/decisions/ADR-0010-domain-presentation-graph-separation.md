# ADR-0010: Phân tách Triệt để 4 Lớp Đồ thị Phả hệ

- **Mã Quyết định:** `ADR-0010`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Chuẩn hóa cấu trúc đồ thị gia phả của GenViet thành **4 Lớp Độc lập Tuyệt đối**:
  1. **Lớp 1 (Domain Graph):** Thực thể CSDL PostgreSQL (`persons`, `relationships`, `marriages`). Không chứa tọa độ.
  2. **Lớp 2 (Query Graph Slice):** Lát cắt dữ liệu 30-50 nodes quanh Center Person do Service truy vấn.
  3. **Lớp 3 (Layout Graph):** Cấu trúc hình học (Kích thước `220x90px`, dummy marriage nodes) gửi vào ELK.js.
  4. **Lớp 4 (Presentation Graph):** Đối tượng React Flow (`nodes`, `edges`, callbacks) vẽ lên Canvas.
- **Ranh giới:** Dummy Union Node hay Edge Type của React Flow chỉ là khái niệm hiển thị, không làm ô nhiễm cấu trúc dữ liệu phả học của CSDL.

## 2. Hệ quả
- **Tích cực:** Cho phép thay đổi thư viện render (ví dụ: chuyển React Flow sang D3/SVG) hoặc thuật toán layout mà không cần sửa 1 dòng code CSDL hay Domain logic nào.
- **Tiêu cực:** Phải viết các hàm Projection Adapter chuyển đổi qua lại giữa các lớp đồ thị ở Phase P15.

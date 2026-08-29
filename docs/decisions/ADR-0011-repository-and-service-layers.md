# ADR-0011: Kiến trúc Phân tầng Ứng dụng: Repository Layer và Service Layer

- **Mã Quyết định:** `ADR-0011`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Áp dụng mô hình **Kiến trúc Phân tầng (Layered Architecture)** rõ ràng:
  1. **Tầng Dịch vụ (Service Layer):** Chịu trách nhiệm thực thi toàn bộ Use Cases, kiểm tra bất biến phả hệ (DAG Invariant `INV-004`), điều phối Transaction nguyên tử và ghi nhận Audit log. Hoàn toàn độc lập khỏi UI.
  2. **Tầng Truy cập Dữ liệu (Repository Layer):** Chỉ chịu trách nhiệm đóng gói các câu lệnh SQL/PostgREST truy vấn CSDL, luôn gắn kèm điều kiện `tree_id` và thực thi dưới ngữ cảnh phiên người dùng để kích hoạt RLS.
- **Ranh giới:** Cấm UI Component gọi trực tiếp SDK CSDL để thực hiện các thao tác thay đổi dữ liệu đa bước.

## 2. Hệ quả
- **Tích cực:** Tăng tối đa khả năng kiểm thử đơn vị (Unit Testing) cho logic nghiệp vụ phả hệ mà không cần kết nối CSDL thật; ngăn chặn rò rỉ logic nghiệp vụ lên giao diện.
- **Tiêu cực:** Tăng số lượng file cấu trúc trong dự án.

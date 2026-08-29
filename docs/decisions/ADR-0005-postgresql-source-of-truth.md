# ADR-0005: PostgreSQL là Nguồn Sự Thật Duy Nhất của Dữ liệu Nghiệp vụ

- **Mã Quyết định:** `ADR-0005`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** **PostgreSQL (trong Supabase)** là Nguồn Sự Thật Duy Nhất (Single Source of Truth) cho toàn bộ thực thể phả hệ (Cây, Thành viên, Quan hệ huyết thống, Hôn phối, Cài đặt và Audit).
- **Ranh giới:** React Flow Node/Edge state hay Client cache chỉ là các bản chiếu dẫn xuất tạm thời. Không sử dụng Graph Database chuyên biệt (Neo4j) hay NoSQL cho MVP để tránh phức tạp hóa kiến trúc.

## 2. Hệ quả
- **Tích cực:** Đảm bảo toàn vẹn ACID, hỗ trợ Foreign Keys, Check Constraints và Transactions; dễ dàng backup/restore toàn bộ dữ liệu dòng họ.
- **Tiêu cực:** Các câu truy vấn đệ quy cây lớn đòi hỏi phải tối ưu hóa qua Recursive CTEs hoặc Indexed Foreign Keys ở Phase P07.

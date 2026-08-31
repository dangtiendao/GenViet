# Kế Hoạch Thi Công Chi Tiết (Implementation Plan P28)

## 1. Danh Sách Work Packages (P28-WP01 -> P28-WP11)

- **P28-WP01: Preflight và khóa contract**
  - Khảo sát mô hình giới tính, phân định Domain Graph vs View Graph, thiết lập tài liệu đầu vào.
- **P28-WP02: Graph schema và metadata**
  - Mở rộng schema, định nghĩa hợp đồng Traversal Mode, phân loại truncation reason.
- **P28-WP03: Database traversal**
  - Viết migration cập nhật RPC `get_tree_graph_slice` với Recursive CTE hỗ trợ PATERNAL_LINE, Center exception, metadata `hasHiddenDescendants`.
- **P28-WP04: Lazy loading và branch expansion**
  - Tích hợp tham số traversal mode vào query hook, xử lý lazy loading và thao tác tại node nữ.
- **P28-WP05: Cache và invalidation**
  - Mở rộng deterministic cache key theo mode, xây dựng quy tắc invalidate khi giới tính hoặc quan hệ thay đổi.
- **P28-WP06: Graph conversion, Worker và layout**
  - Cập nhật DTO mapper, đảm bảo Web Worker ELK chỉ layout và không chứa business logic giới tính.
- **P28-WP07: Tree View, UX và accessibility**
  - Xây dựng component `HiddenDescendantsIndicator`, cập nhật `PersonNode`, hỗ trợ keyboard/screen-reader và tooltip mobile.
- **P28-WP08: Domain-feature regression**
  - Kiểm thử và bảo toàn tuyệt đối Search, Person Detail, Kinship, Address Terms, Duplicate Detection, Merge, Backup, Restore, GEDCOM.
- **P28-WP09: PDF và in cây**
  - Cập nhật tài liệu xuất PDF và in cây lớn công bố rõ phạm vi hiển thị PATERNAL_LINE.
- **P28-WP10: Test và regression**
  - Viết và chạy đầy đủ bộ test: Unit, Database SQL, Integration, Component, E2E, Performance, Security & Data-Integrity.
- **P28-WP11: Review và handover**
  - Hoàn thiện tài liệu kiến trúc, security review, performance review, summary và handover.

# Báo Cáo Tổng Kết (Summary Report) - Phase P28

## 1. Thông Tin Chung
- **Mã phase:** P28
- **Tên phase:** Chế độ hiển thị dòng họ mặc định (Default Paternal-Line Tree View)
- **Dự án:** GenViet
- **Trạng thái:** HOÀN THÀNH (100% Tasks Completed)
- **Nhánh làm việc:** `phase/p28-paternal-line-view`

## 2. Các Kết Quả Đạt Được
1. **Hợp đồng Traversal Mode:** Thiết lập `PATERNAL_LINE` làm chế độ duyệt hậu duệ mặc định toàn hệ thống, đồng thời chuẩn hóa sẵn chế độ `ALL_DESCENDANTS`.
2. **PostgreSQL Recursive CTE:** Cập nhật hàm RPC `get_tree_graph_slice` tại cơ sở dữ liệu để dừng mở rộng hậu duệ dưới node con gái, đồng thời bảo toàn ngoại lệ cho Center Person là nữ.
3. **Phân biệt Domain Graph & View Graph:** Đảm bảo toàn bộ các tính năng nghiệp vụ cốt lõi (Search, Person Detail, Kinship, Address Terms, Duplicate Detection, Merge, Backup, Restore, GEDCOM, Excel Import) duy trì hoạt động trên 100% dữ liệu gốc.
4. **Metadata & Accessibility:** Bổ sung `hasHiddenDescendants`, `descendantsTruncated`, `truncationReason: 'PATERNAL_LINE'` và component `HiddenDescendantsIndicator` với hỗ trợ tiếp cận WCAG 2.1 AA.
5. **Cache & Invalidation:** Mở rộng deterministic cache key theo `descendantTraversalMode` và `branchBoundaryPersonId`, vô hiệu hóa cache an toàn khi thay đổi dữ liệu nhân vật và quan hệ.
6. **PDF & Large Tree Print:** Bổ sung ghi chú phạm vi hiển thị rõ ràng trên tài liệu xuất PDF và bản in cây lớn.
7. **Kiểm thử toàn diện:** Bổ sung 5 bộ test mới bao gồm Unit test, Component test, Integration test và Database SQL test, đạt tỷ lệ vượt qua 100%.

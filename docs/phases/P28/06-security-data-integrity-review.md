# Đánh Giá An Ninh & Tính Toàn Vẹn Dữ Liệu (Security & Data-Integrity Review) - Phase P28

## 1. Đánh Giá An Ninh (Security Review)
- **RLS & Phân Quyền Truy Cập:**
  - Hàm `get_tree_graph_slice` thực thi kiểm tra bảo mật nghiêm ngặt tại đầu hàm bằng `_system.can_read_tree(p_tree_id, v_user_id)`.
  - Không cho phép người dùng ẩn danh (anon) gọi RPC (`REVOKE ALL FROM anon, PUBLIC`).
  - Kiểm tra Same-Tree Isolation: `p_branch_boundary_person_id` và `p_center_person_id` bắt buộc phải thuộc cùng `p_tree_id` và không bị soft-deleted.
  - Không nới lỏng hay thay đổi bất kỳ chính sách Row Level Security (RLS) nào của các bảng `persons`, `parent_child_relationships`, `unions`, `union_members`.
- **Cache Isolation:**
  - Cache key chứa `userScope`, `treeId`, `descendantTraversalMode`, `branchBoundaryPersonId`.
  - Không rò rỉ dữ liệu giữa các tài khoản khác nhau hoặc giữa các cây khác nhau.
- **Client Bundle & Service Worker:**
  - Không đưa secret, token hay dữ liệu gia phả nhạy cảm vào client bundle hoặc Service Worker cache.

## 2. Đánh Giá Tính Toàn Vẹn Dữ Liệu (Data-Integrity Review)
- **Không Xóa Sửa Dữ Liệu:**
  - Quy tắc `PATERNAL_LINE` chỉ tác động đến phép chiếu hiển thị đồ thị (View Graph).
  - Không có bất kỳ lệnh `DELETE`, `UPDATE` hay `INSERT` nào làm biến đổi dữ liệu nhân vật, quan hệ huyết thống hay hôn nhân.
- **Bảo Toàn Domain Consumers:**
  - Tính năng tìm kiếm (Search), chi tiết nhân vật (Person Detail), tìm đường quan hệ (Kinship Path), gợi ý xưng hô (Address Terms), phát hiện hồ sơ trùng (Duplicate Detection), gộp hồ sơ (Merge), sao lưu/phục hồi (JSON Backup & Restore), nhập xuất Excel và GEDCOM hoàn toàn không bị ảnh hưởng và hoạt động trên 100% dữ liệu đầy đủ.
- **Chống Dangling Edges:**
  - DTO Mapper `TreeGraphMapper` loại bỏ bất kỳ cạnh nào mà `parentId` hoặc `childId` không nằm trong danh sách `persons` của lát cắt, bảo đảm không có cạnh treo trên canvas.

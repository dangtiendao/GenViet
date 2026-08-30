# Soft Deletion & Restore: Person Management

## 1. Xóa Mềm (Soft Deletion)
- Khi thực hiện xóa nhân vật:
  - Cột `deleted_at` được gán thời điểm hiện tại (`now()`).
  - Cột `deleted_by` lưu ID người thực hiện.
  - Cột `version` tăng thêm 1.
- **Ràng buộc bảo vệ:**
  - Nếu nhân vật đang được chọn làm **Mốc số đời (Generation Anchor)** của cây gia phả (`family_trees.generation_anchor_person_id = person.id`), hệ thống từ chối xóa và yêu cầu gỡ mốc trong Cài đặt cây trước (`PERSON_GENERATION_ANCHOR_CONFLICT`).
  - Các liên kết quan hệ trong `parent_child_relationships` và `union_members` vẫn được giữ nguyên trong cơ sở dữ liệu.

## 2. Khôi Phục (Restore)
- Thực hiện thông qua RPC function `public.restore_person(p_person_id UUID, p_expected_version int)`.
- Hàm chạy dưới quyền `SECURITY DEFINER` với `SET search_path = public, _system, pg_temp;`.
- Kiểm tra quyền ghi (`_system.can_write_tree`), kiểm tra version, xóa dấu vết xóa mềm (`deleted_at = NULL, deleted_by = NULL`), tăng `version` và trả về `true`.

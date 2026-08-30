# Traversal Rules: Ancestor & Descendant Traversal

## 1. Duyệt Tổ Tiên (Ancestor Traversal)
- Bắt đầu từ `center_person_id` ở `depth = 0`.
- Với mỗi nhân vật hiện tại, tìm các bản ghi `parent_child_relationships` có `child_id = current_person_id`.
- Lấy `parent_id` và tăng `depth = depth + 1`.
- Dừng lại khi `depth >= appliedAncestorDepth` hoặc không còn cha mẹ.
- Cơ chế bảo vệ chu trình: Mảng `visited_path` ghi nhận toàn bộ các node đã duyệt trên nhánh hiện tại, loại trừ `r.parent_id = ANY(visited_path)`.

## 2. Duyệt Hậu Duệ (Descendant Traversal)
- Bắt đầu từ `center_person_id` ở `depth = 0`.
- Với mỗi nhân vật hiện tại, tìm các bản ghi `parent_child_relationships` có `parent_id = current_person_id`.
- Lấy `child_id` và tăng `depth = depth + 1`.
- Dừng lại khi `depth >= appliedDescendantDepth` hoặc không còn con cái.

## 3. Quy Tắc Phối Ngẫu & Hôn Nhân
- Với mỗi nhân vật trong tập hợp slice (Center + Ancestors + Descendants):
  - Tìm tất cả `unions` mà nhân vật đó là thành viên active.
  - Lấy toàn bộ các phối ngẫu cùng tham gia Union đó và đưa vào danh sách Persons.
  - Không tự động duyệt tổ tiên hay hậu duệ của phối ngẫu nếu không có liên kết trực tiếp với Center Person.

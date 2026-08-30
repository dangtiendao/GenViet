# Union & Child Flows (Luồng Hôn Nhân và Con Cái)

## 1. Phân Hệ Hôn Nhân (Unions)
- **Tạo Union:** Liên kết 2 cá nhân trong cùng Tree (`create_union_with_new_person` hoặc `create_union_with_existing_person`).
- **Nhiều lần kết hôn:** Một cá nhân có thể có nhiều quan hệ Union theo thời gian (ví dụ: tái hôn, đa thê trong lịch sử phong kiến).
- **Kết thúc hôn nhân (`end_union`):** Cập nhật trạng thái `divorced`, `widowed`, `separated`, `former` kèm ngày kết thúc. Không xóa hồ sơ và không xóa liên kết con cái.

## 2. Luồng Thêm Con Cái (Child Flows)
- **Hướng quan hệ:** Luôn là `Parent -> Child`.
- **Thêm con mới (`create_person_with_child_relationship`):**
  - Tạo Person con mới.
  - Tạo quan hệ với Cha/Mẹ chính.
  - Tùy chọn liên kết với Cha/Mẹ thứ hai trong cùng một transaction.
- **Liên kết con có sẵn (`link_existing_child`):**
  - Chọn nhân vật con có sẵn trong Tree.
  - Kiểm tra chu trình và liên kết an toàn.

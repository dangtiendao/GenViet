# Hợp Đồng Dữ Liệu Nhật Ký (Audit Contract)

## 1. Cấu Trúc Bảng `audit_logs`
- `id`: UUID Primary Key ngẫu nhiên
- `tree_id`: UUID cây gia phả sở hữu
- `actor_user_id`: UUID người thực hiện (hoặc NULL nếu tác vụ hệ thống)
- `actor_name_cached`: Tên người thực hiện tại thời điểm ghi log
- `entity_type`: Loại thực thể (`family_tree`, `person`, `parent_child_relationship`, `union`, `union_member`, `person_avatar`)
- `entity_id`: UUID thực thể bị tác động
- `action_type`: Hành động (`create`, `update`, `soft_delete`, `restore`, `replace`, `status_change`, ...)
- `before_data`: JSONB chứa snapshot trước thay đổi
- `after_data`: JSONB chứa snapshot sau thay đổi
- `changed_fields`: Mảng danh sách các trường dữ liệu thực sự thay đổi
- `created_at`: Thời điểm ghi nhật ký (TIMESTAMPTZ UTC)

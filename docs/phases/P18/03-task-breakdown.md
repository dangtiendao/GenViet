# Phase P18: Bảng Đối Soát 18 Nhiệm Vụ (Task Breakdown P18-T01 đến P18-T18)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Chi Tiết Thực Hiện |
| :--- | :--- | :---: | :--- |
| `P18-T01` | Tạo `audit_logs` | **COMPLETED** | Bảng bất biến, foreign key, indexes phục vụ query |
| `P18-T02` | Chốt entity types | **COMPLETED** | 6 loại: family_tree, person, relationship, union, member, avatar |
| `P18-T03` | Chốt action types | **COMPLETED** | 12 thao tác: create, update, soft_delete, restore, replace, ... |
| `P18-T04` | Ghi before data | **COMPLETED** | Snapshot allowlisted trước thay đổi |
| `P18-T05` | Ghi after data | **COMPLETED** | Snapshot allowlisted sau thay đổi kèm changed_fields |
| `P18-T06` | Loại bỏ secret | **COMPLETED** | Khử nhiễm Denylist + Allowlist (không token, không password) |
| `P18-T07` | Log tạo nhân vật | **COMPLETED** | Tích hợp trong create person & relationship flow |
| `P18-T08` | Log sửa nhân vật | **COMPLETED** | Tích hợp trong update person với optimistic concurrency |
| `P18-T09` | Log tạo quan hệ | **COMPLETED** | Tích hợp trong create parent/child và union RPCs |
| `P18-T10` | Log xóa quan hệ | **COMPLETED** | Tích hợp trong soft_delete relationship & union RPCs |
| `P18-T11` | Log thay đổi gia phả | **COMPLETED** | Tích hợp trong create/restore family tree RPCs |
| `P18-T12` | Giao diện lịch sử | **COMPLETED** | Route `/trees/[treeId]/history` và component history list |
| `P18-T13` | Bộ lọc lịch sử | **COMPLETED** | Lọc theo Entity, Action, Date range với cursor pagination |
| `P18-T14` | Khôi phục nhân vật | **COMPLETED** | RPC `restore_person` với kiểm tra tree status & version |
| `P18-T15` | Khôi phục quan hệ | **COMPLETED** | RPC `restore_parent_child_relationship` & `restore_union` |
| `P18-T16` | Kiểm tra xung đột | **COMPLETED** | Blocking: cycle, duplicate, dependency deleted; Warnings |
| `P18-T17` | Thời hạn thùng rác | **COMPLETED** | 30 ngày cho person/rel, audit vĩnh viễn, dry-run script |
| `P18-T18` | Test kháng sửa xóa | **COMPLETED** | RLS không cấp UPDATE/DELETE, client không INSERT tùy ý |

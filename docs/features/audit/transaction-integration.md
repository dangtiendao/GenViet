# Tích Hợp Giao Dịch Ghi Nhật Ký (Transaction Integration)

## 1. Cơ Chế Thực Thi Nguyên Tử (Atomic Execution)
- Toàn bộ các hàm RPC thay đổi dữ liệu phả hệ (`create_family_tree`, `create_person_with_parent_relationship`, `soft_delete_parent_child_relationship`, `restore_person`, `restore_parent_child_relationship`, ...) đều gọi trực tiếp hàm nội bộ `_system.write_audit_log` bên trong cùng Database Transaction.
- Nếu thao tác thay đổi dữ liệu thất bại hoặc bị Rollback, bản ghi audit log tương ứng cũng bị hủy bỏ, đảm bảo không bao giờ sinh ra log rác hoặc log mồ côi.

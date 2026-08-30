# Hợp Đồng Khôi Phục Dữ Liệu (Restore Contract)

## 1. Các RPC Khôi Phục Chuyên Dụng
1. `restore_person(p_person_id UUID, p_expected_version INT)`:
   - Khôi phục Person đã bị xóa mềm, tăng version lên +1, gán `deleted_at = NULL`.
   - Không tự động khôi phục quan hệ cũ (người dùng khôi phục chủ động theo nhu cầu).
2. `restore_parent_child_relationship(p_relationship_id UUID, p_expected_version INT)`:
   - Khôi phục quan hệ Cha/Mẹ - Con.
   - Bắt buộc cả cha/mẹ và con đều phải đang active (nếu đang bị xóa $\rightarrow$ chặn `DEPENDENCY_DELETED`).
   - Kiểm tra chu trình `_system.check_parent_child_cycle` $\rightarrow$ chặn nếu có chu trình.
3. `restore_union(p_union_id UUID, p_expected_version INT)`:
   - Khôi phục quan hệ hôn nhân.
   - Bắt buộc các thành viên phối ngẫu đều đang active.

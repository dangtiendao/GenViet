# Danh sách Hạng mục Tạm hoãn: Phase P07 (Deferred Items & Invariants)

- **Mã Phase:** `P07`
- **Ngày đối soát:** 2026-08-29
- **Trạng thái:** `2 Deferred Invariants ghi nhận theo kiến trúc`

---

## Danh sách Invariants Tạm hoãn cho các Phase Tiếp theo:

1. **`DEFERRED-INV-P07-01` (Cycle Detection Toàn Đồ thị Phả hệ):**
   - *Mô tả:* Chặn chu trình tổ tiên - hậu duệ (ví dụ: A là cha B, B là cha C, C không thể là cha A).
   - *Phase chịu trách nhiệm:* **Phase P13 (Service Layer & Cycle Prevention)**.
   - *Trạng thái P07:* Đã chặn self-link (`parent_id <> child_id`) bằng Check constraint `chk_parent_child_not_self`.

2. **`DEFERRED-INV-P07-02` (Giới hạn Tối đa 2 Thành viên trong 1 Union):**
   - *Mô tả:* Đảm bảo một mối quan hệ kết đôi/hôn nhân chỉ có tối đa 2 người active.
   - *Phase chịu trách nhiệm:* **Phase P13 (Service Layer & Union Validation)**.
   - *Trạng thái P07:* Đã chặn trùng lặp cùng 1 người bằng Unique partial index `idx_union_members_active_unique`.

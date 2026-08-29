# Danh sách Hạng mục Tạm hoãn: Phase P08 (Deferred Items & Invariants)

- **Mã Phase:** `P08`
- **Ngày đối soát:** 2026-08-29
- **Trạng thái:** `1 Deferred Invariant ghi nhận theo kiến trúc`

---

## Danh sách Invariants Tạm hoãn cho các Phase Tiếp theo:

1. **`DEFERRED-INV-P08-01` (Bảo đảm Tối thiểu 1 Owner & Quy trình Chuyển giao Sở hữu Cây):**
   - *Mô tả:* Quy tắc ngăn chặn việc xóa/hạ quyền Owner cuối cùng của một cây gia phả, và quy trình chuyển giao quyền sở hữu (`Ownership Transfer`) từ Owner hiện tại sang thành viên khác.
   - *Phase chịu trách nhiệm:* **Phase P11 (Family Tree Management Service Layer & Transactional RPC)**.
   - *Trạng thái P08:* Đã chặn Viewer và Editor can thiệp vào bảng `tree_memberships` và đã cưỡng chế quyền quản lý membership chỉ thuộc về Owner.

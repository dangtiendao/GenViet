# Danh sách Hạng mục Hoãn lại (Deferred Items) - Phase P11

- **Mã Phase:** `P11`

---

## 1. Danh sách Hạng mục Hoãn lại Có Lý do

| Mã Hạng mục | Tên Hạng mục | Trạng thái | Lý do Kỹ thuật & Kế hoạch |
| :--- | :--- | :---: | :--- |
| **`DEF-P11-001`** | **Xóa vĩnh viễn (Hard Purge - `P11-T15`)** | `DEFERRED_FOR_SAFETY` | Hoãn lại để bảo đảm an toàn dữ liệu gia phả. Sẽ được triển khai khi có Reauthentication thời gian thực, Backup/Export tự động và Audit log toàn diện trong Phase P18. |
| **`DEF-P11-002`** | **Default Person Column (`P11-T10`)** | `DEFERRED` | Schema P07 thiết kế chuẩn tập trung vào `generation_anchor_person_id` (Mốc số đời). Khái niệm Default Focus Person của client sẽ được xử lý linh hoạt tại client state khi vẽ canvas trong Phase P15. |

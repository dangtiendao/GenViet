# Chính sách Dấu thời gian & Kiểm toán Người thực hiện (Timestamp & Actor Policy)

- **Mã tài liệu:** `DB-AUDIT-POLICY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Quy chuẩn Dấu thời gian (Timestamps Standard)

1. **Chuẩn Múi giờ:** Mọi cột thời gian lưu trữ trong PostgreSQL đều sử dụng kiểu `TIMESTAMPTZ` (Timestamp with time zone) và mặc định tính theo múi giờ UTC (`timezone('utc'::text, now())`).
2. **Cột `created_at`:** Được thiết lập một lần duy nhất khi tạo bản ghi, không thay đổi qua các lần update.
3. **Cột `updated_at`:** Được cập nhật tự động thông qua trigger `_system.set_updated_at()` trên tất cả các bảng khi có lệnh `UPDATE`.
4. **Cột `deleted_at`:** Nhận giá trị `TIMESTAMPTZ` khi bản ghi bị xóa mềm; nhận giá trị `NULL` khi bản ghi đang hoạt động (`active`).

---

## 2. Quy chuẩn Người thực hiện (Actor Fields Standard)

1. **Tham chiếu Người dùng:** Các trường `created_by`, `updated_by`, `deleted_by` sử dụng kiểu `UUID` tham chiếu tới `auth.users(id)`.
2. **Hành vi Khi Xóa Tài khoản:** Sử dụng `ON DELETE SET NULL` để đảm bảo nếu tài khoản người dùng bị xóa khỏi hệ thống, dữ liệu phả hệ do họ tạo vẫn được lưu giữ trọn vẹn và không bị cascade xóa mất mát.
3. **Không Thay thế Audit Log Chuyên sâu:** Các trường actor này phục vụ metadata cơ bản; hệ thống Audit Log chuyên sâu sẽ được thiết lập độc lập trong Phase P18.

# Phân Quyền & Kiểm Soát Truy Cập Nhật Ký (Audit Authorization)

## 1. Ma Trận Phân Quyền Nhật Ký (Audit Authorization Matrix)

| Vai Trò | Xem Nhật Ký (SELECT) | Thêm (INSERT) | Sửa (UPDATE) | Xóa (DELETE) |
| :--- | :---: | :---: | :---: | :---: |
| **Owner / Admin / Editor** | ✅ Cho phép | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn |
| **Viewer (Thành viên xem)** | ✅ Cho phép | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn |
| **Outsider (Người ngoài)** | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn |
| **Khách (anon)** | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn |

- Ghi log được thực hiện độc quyền bởi các hàm DB Function / RPC đáng tin cậy (`SECURITY DEFINER`).
- Tuyệt đối không cấp quyền UPDATE hoặc DELETE trên bảng `audit_logs` cho bất kỳ người dùng nào (kể cả Owner).

# Phân Quyền & Ranh Giới Bảo Mật (Storage Authorization)

## 1. Ma Trận Phân Quyền (Authorization Matrix)

| Vai trò / Thao tác | Upload (INSERT) | Đọc ảnh (SELECT / Signed URL) | Xóa ảnh (DELETE) |
| :--- | :---: | :---: | :---: |
| **Owner / Admin / Editor** | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép |
| **Viewer (Thành viên xem)** | ❌ Bị chặn | ✅ Cho phép | ❌ Bị chặn |
| **Outsider (Người ngoài cây)**| ❌ Bị chặn | ❌ Bị chặn (trừ Tree Public) | ❌ Bị chặn |
| **Cross-Tree (Cây khác)** | ❌ Bị chặn | ❌ Bị chặn | ❌ Bị chặn |

---

## 2. Kiểm Soát Tại CSDL & Storage RLS
- Storage RLS trích xuất an toàn `tree_id` từ object path thông qua hàm `_system.extract_tree_id_from_avatar_path` và đối soát với bảng `public.tree_memberships`.
- Không thể đoán URL hoặc đường dẫn ngẫu nhiên để đọc ảnh nếu không có token chữ ký hợp lệ.

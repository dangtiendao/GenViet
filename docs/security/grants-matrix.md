# Ma trận Quyền Bảng CSDL (Table Grants Matrix)

- **Mã tài liệu:** `SEC-GRANTS-MATRIX-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Bảng Phân bổ Grants PostgreSQL

| Bảng CSDL | Database Role | `SELECT` | `INSERT` | `UPDATE` | `DELETE` | Ghi chú & Ràng buộc |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **`public.profiles`** | `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ❌ | ✅ | ❌ | User chỉ sửa profile mình; insert quản lý qua auth |
| **`public.family_trees`** | `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ❌ | Xóa qua soft delete (UPDATE) |
| **`public.tree_memberships`**| `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ✅ | Owner quản lý membership (có thể DELETE link) |
| **`public.persons`** | `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ❌ | Xóa qua soft delete (UPDATE) |
| **`public.parent_child_relationships`**| `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ❌ | Xóa qua soft delete (UPDATE) |
| **`public.unions`** | `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ❌ | Xóa qua soft delete (UPDATE) |
| **`public.union_members`** | `anon` | ❌ | ❌ | ❌ | ❌ | Bị từ chối hoàn toàn |
| | `authenticated` | ✅ | ✅ | ✅ | ❌ | Xóa qua soft delete (UPDATE) |
| **`_system` Functions** | `anon` / `PUBLIC` | ❌ (REVOKE EXECUTE) | | | | Chặn gọi trực tiếp từ client chưa xác thực |
| | `authenticated` | ✅ (GRANT EXECUTE) | | | | Phục vụ đánh giá RLS policies |

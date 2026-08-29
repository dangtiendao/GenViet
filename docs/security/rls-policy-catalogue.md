# Danh mục Chính sách RLS (RLS Policy Catalogue)

- **Mã tài liệu:** `SEC-RLS-CATALOGUE-01`
- **Phiên bản:** `v0.1-baseline`
- **Migration nguồn:** `20260829160221_p08_add_rls_authorization_policies.sql`

---

## Danh mục Chi tiết Các Policies theo Bảng

### 1. Bảng `public.profiles`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `profiles_select_own` | `SELECT` | `authenticated` | `USING (id = (select auth.uid()))` | Chỉ cho phép người dùng đọc profile của chính mình |
| `profiles_update_own` | `UPDATE` | `authenticated` | `USING/WITH CHECK (id = (select auth.uid()))`| Chỉ cho phép người dùng cập nhật profile của chính mình |

---

### 2. Bảng `public.family_trees`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `family_trees_insert_authenticated` | `INSERT` | `authenticated` | `WITH CHECK (created_by = (select auth.uid()))` | Người dùng tạo cây gia phả mới với chính mình là creator |
| `family_trees_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_active_tree_member(id))` | Thành viên active đọc thông tin cây |
| `family_trees_update_owners` | `UPDATE` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_tree_owner(id)) WITH CHECK (_system.is_tree_owner(id))` | Chỉ Owner sửa thông tin và xóa mềm cây |

---

### 3. Bảng `public.tree_memberships`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `tree_memberships_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND (user_id = (select auth.uid()) OR _system.is_active_tree_member(tree_id)))` | Đọc membership của mình hoặc các thành viên cùng cây |
| `tree_memberships_insert_owners` | `INSERT` | `authenticated` | `WITH CHECK (_system.is_tree_owner(tree_id) OR (tree.created_by = auth.uid() AND user_id = auth.uid() AND role = 'owner'))` | Owner mời thành viên hoặc creator khởi tạo owner membership |
| `tree_memberships_update_owners` | `UPDATE` | `authenticated` | `USING/WITH CHECK (_system.is_tree_owner(tree_id))` | Chỉ Owner cập nhật role/status thành viên |
| `tree_memberships_delete_owners` | `DELETE` | `authenticated` | `USING (_system.is_tree_owner(tree_id))` | Chỉ Owner thu hồi/xóa thành viên |

---

### 4. Bảng `public.persons`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `persons_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_active_tree_member(tree_id))` | Thành viên active đọc danh sách nhân vật trong cây |
| `persons_insert_writers` | `INSERT` | `authenticated` | `WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer (Owner/Admin/Editor) tạo nhân vật mới |
| `persons_update_writers` | `UPDATE` | `authenticated` | `USING (deleted_at IS NULL AND _system.can_write_tree(tree_id)) WITH CHECK (_system.can_write_tree(tree_id))` | Writer sửa thông tin hoặc xóa mềm nhân vật |

---

### 5. Bảng `public.parent_child_relationships`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `parent_child_relationships_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_active_tree_member(tree_id))` | Thành viên active đọc quan hệ trực hệ trong cây |
| `parent_child_relationships_insert_writers` | `INSERT` | `authenticated` | `WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer tạo quan hệ cha/mẹ - con |
| `parent_child_relationships_update_writers` | `UPDATE` | `authenticated` | `USING/WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer cập nhật hoặc xóa mềm quan hệ |

---

### 6. Bảng `public.unions` & `public.union_members`
| Policy Name | Command | Role | Expression (USING / WITH CHECK) | Mục đích Bảo vệ |
| :--- | :---: | :---: | :--- | :--- |
| `unions_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_active_tree_member(tree_id))` | Thành viên active đọc quan hệ hôn nhân |
| `unions_insert_writers` | `INSERT` | `authenticated` | `WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer tạo quan hệ hôn nhân mới |
| `unions_update_writers` | `UPDATE` | `authenticated` | `USING/WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer sửa hoặc xóa mềm quan hệ hôn nhân |
| `union_members_select_members` | `SELECT` | `authenticated` | `USING (deleted_at IS NULL AND _system.is_active_tree_member(tree_id))` | Thành viên active đọc bạn đời trong union |
| `union_members_insert_writers` | `INSERT` | `authenticated` | `WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer thêm bạn đời vào union |
| `union_members_update_writers` | `UPDATE` | `authenticated` | `USING/WITH CHECK (deleted_at IS NULL AND _system.can_write_tree(tree_id))` | Writer cập nhật thông tin thành viên union |

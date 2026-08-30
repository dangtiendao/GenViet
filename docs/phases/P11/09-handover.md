# Hồ sơ Bàn giao Nghiệm thu: Phase P11 (Handover Dossier - Cổng G7)

- **Mã Phase:** `P11`
- **Tên Phase:** Quản lý gia phả (Family Tree Management)
- **Dự án:** GenViet (v0.1)
- **Nhánh bàn giao:** `phase/p11-family-tree-management`
- **Starting Commit:** `3727f07`
- **Trạng thái:** **`READY_FOR_MERGE`**

---

## 1. Danh mục Tệp tin Bàn giao (Deliverables Checklist)

### 1.1. Cơ sở dữ liệu & Migrations
- `supabase/migrations/20260830000000_p11_add_family_tree_management_functions.sql`
- `supabase/tests/02000_create_family_tree_transaction.test.sql`
- `supabase/tests/02100_family_tree_restore.test.sql`

### 1.2. Mã nguồn Ứng dụng & Phân hệ
- `src/features/family-trees/types/family-tree.types.ts`
- `src/features/family-trees/schemas/family-tree.schema.ts`
- `src/features/family-trees/errors/family-tree.errors.ts`
- `src/features/family-trees/repositories/family-tree.repository.ts`
- `src/features/family-trees/services/family-tree.service.ts`
- `src/features/family-trees/actions/family-tree.actions.ts`
- `src/features/family-trees/components/family-tree-card.tsx`
- `src/features/family-trees/components/family-tree-list.tsx`
- `src/features/family-trees/components/family-tree-empty-state.tsx`
- `src/features/family-trees/components/family-tree-form.tsx`
- `src/features/family-trees/components/family-tree-overview.tsx`
- `src/features/family-trees/components/family-tree-settings-form.tsx`
- `src/features/family-trees/components/family-tree-switcher.tsx`
- `src/features/family-trees/components/delete-family-tree-dialog.tsx`
- `src/features/family-trees/components/restore-family-tree-dialog.tsx`
- `src/app/(dashboard)/trees/page.tsx`
- `src/app/(dashboard)/trees/new/page.tsx`
- `src/app/(dashboard)/trees/[treeId]/page.tsx`
- `src/app/(dashboard)/trees/[treeId]/settings/page.tsx`
- `src/app/(dashboard)/trees/trash/page.tsx`
- `src/app/(dashboard)/trees/trash/restore-trash-item-button.tsx`
- `src/app/(dashboard)/dashboard/page.tsx` (Tích hợp danh sách cây vào trang chủ)
- `src/config/navigation.ts` (Kích hoạt `isImplemented: true` cho cây gia phả)

### 1.3. Bộ Kiểm thử
- `tests/unit/family-trees/schemas.test.ts`
- `tests/unit/family-trees/errors.test.ts`
- `tests/unit/family-trees/components.test.tsx`
- `tests/e2e/family-trees.spec.ts`

---

## 2. Hướng dẫn Nghiệm thu & Merge dành cho Người dùng

Để nghiệm thu và hợp nhất nhánh `phase/p11-family-tree-management` vào `master`:
```bash
git checkout master
git merge --no-ff phase/p11-family-tree-management -m "Merge Phase P11: Family Tree Management"
```
*(Tuân thủ DEC-007: AI không tự động push remote, không tự động merge).*

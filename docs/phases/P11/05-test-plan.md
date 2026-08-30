# Kế hoạch Kiểm thử Hệ thống Quản lý Gia phả: Phase P11 (Test Plan - Cổng G3)

Tài liệu này xác định các kịch bản kiểm thử tĩnh, unit, database và end-to-end cho Phase P11.

---

## 1. Ma trận Kịch bản Kiểm thử

### Nhóm 1: Database & RPC Transaction Tests (pgTAP)
- **TEST-01:** `create_family_tree` tạo thành công `family_trees` và `tree_memberships` với `role = 'owner'` và `status = 'active'` $\rightarrow$ `PASS` (`supabase/tests/02000_create_family_tree_transaction.test.sql`).
- **TEST-02:** `create_family_tree` rollback toàn bộ khi có lỗi xảy ra $\rightarrow$ `PASS`.
- **TEST-03:** Từ chối caller chưa xác thực hoặc anon $\rightarrow$ `PASS`.
- **TEST-04:** `restore_family_tree` khôi phục thành công cây đã xóa mềm cho Owner $\rightarrow$ `PASS` (`supabase/tests/02100_family_tree_restore.test.sql`).
- **TEST-05:** Người dùng khác không thể khôi phục cây của Owner $\rightarrow$ `PASS`.

### Nhóm 2: Unit & Component Tests (Vitest)
- **TEST-06:** Validation tên tiếng Việt, khoảng trắng, độ dài $\le 100$, chặn ký tự điều khiển $\rightarrow$ `PASS` (`tests/unit/family-trees/schemas.test.ts`).
- **TEST-07:** Phân loại mã lỗi và mapping thông điệp tiếng Việt thân thiện $\rightarrow$ `PASS` (`tests/unit/family-trees/errors.test.ts`).
- **TEST-08:** Render Card, List, Empty State và Delete Confirmation Dialog $\rightarrow$ `PASS` (`tests/unit/family-trees/components.test.tsx`).

### Nhóm 3: End-to-End Tests (Playwright)
- **TEST-09:** Người dùng chưa đăng nhập truy cập `/trees`, `/trees/new`, `/trees/[treeId]`, `/trees/[treeId]/settings`, `/trees/trash` bị redirect về `/login?next=...` $\rightarrow$ `PASS` (`tests/e2e/family-trees.spec.ts`).
- **TEST-10:** Giao diện mobile $320\text{px}$ và $375\text{px}$ không bị tràn ngang $\rightarrow$ `PASS`.

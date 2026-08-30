# Danh mục Kịch bản Kiểm thử (Test Catalogue) - Phase P11

- **Mã tài liệu:** `FT-TEST-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Danh mục Test Suites

### 1.1. Database Tests (pgTAP)
- `supabase/tests/02000_create_family_tree_transaction.test.sql`: Kiểm thử atomic create RPC, rollback, từ chối caller chưa xác thực, chặn anon role.
- `supabase/tests/02100_family_tree_restore.test.sql`: Kiểm thử soft delete và restore RPC bởi Owner, từ chối người dùng khác.

### 1.2. Unit & Component Tests (Vitest)
- `tests/unit/family-trees/schemas.test.ts` (13 tests): Validation tên tiếng Việt, khoảng trắng, độ dài, control characters, newlines, mô tả, privacy, expected version.
- `tests/unit/family-trees/errors.test.ts` (3 tests): Phân loại mã lỗi và mapping thông điệp an toàn.
- `tests/unit/family-trees/components.test.tsx` (3 tests): Render Card, List, Empty State.

### 1.3. End-to-End Tests (Playwright)
- `tests/e2e/family-trees.spec.ts` (6 tests): Unauthenticated redirect tới `/login?next=...`, bảo vệ dynamic route `/trees/[treeId]`, `/trees/[treeId]/settings`, `/trees/trash`, kiểm thử không tràn ngang trên màn hình $320\text{px}$.

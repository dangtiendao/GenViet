# Test Catalogue: Relationship Management

## 1. Danh Mục Test Suite

| Test Suite | Đường Dẫn | Loại Test | Số Lượng | Kết Quả |
| :--- | :--- | :---: | :---: | :---: |
| Relationship Validation Schemas | `tests/unit/relationships/schemas.test.ts` | Vitest Unit | 12 tests | 100% PASS |
| Relationship Error Taxonomy | `tests/unit/relationships/errors.test.ts` | Vitest Unit | 3 tests | 100% PASS |
| Relationship Preview Builder | `tests/unit/relationships/preview.test.ts` | Vitest Unit | 3 tests | 100% PASS |
| Relationship UI Components | `tests/unit/relationships/components.test.tsx` | Vitest Unit | 3 tests | 100% PASS |
| Basic Relationship Functions | `supabase/tests/04000_relationship_functions.test.sql` | pgTAP DB | 6 tests | 100% PASS |
| Recursive Cycle Detection | `supabase/tests/04100_relationship_cycles.test.sql` | pgTAP DB | 6 tests | 100% PASS |
| Transaction Atomicity & Rollback | `supabase/tests/04200_relationship_transactions.test.sql` | pgTAP DB | 4 tests | 100% PASS |
| Union & Spouse Transactions | `supabase/tests/04300_union_transactions.test.sql` | pgTAP DB | 6 tests | 100% PASS |
| Relationship Authorization & RLS | `supabase/tests/04400_relationship_authorization.test.sql` | pgTAP DB | 4 tests | 100% PASS |
| Relationship E2E Tests | `tests/e2e/relationships.spec.ts` | Playwright E2E | 2 tests | 100% PASS |

**Tổng cộng toàn dự án:** 25 test files Vitest (129 tests), 9 test files pgTAP DB (46 tests), 7 test files Playwright E2E (28 tests). 100% PASS.

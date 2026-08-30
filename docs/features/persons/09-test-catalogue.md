# Test Catalogue: Person Management

## 1. Danh Mục Test Suite

| Test Suite | Đường Dẫn | Loại Test | Số Lượng | Kết Quả |
| :--- | :--- | :--- | :---: | :---: |
| Person Validation Schemas | `tests/unit/persons/schemas.test.ts` | Vitest Unit | 15 tests | 100% PASS |
| Partial Date Mapping & INV-002 | `tests/unit/persons/partial-date-mapper.test.ts` | Vitest Unit | 10 tests | 100% PASS |
| Person Error Taxonomy | `tests/unit/persons/errors.test.ts` | Vitest Unit | 3 tests | 100% PASS |
| Person UI Components | `tests/unit/persons/components.test.tsx` | Vitest Unit | 3 tests | 100% PASS |
| Database Normalization Trigger | `supabase/tests/03000_person_normalization.test.sql` | pgTAP DB | 6 tests | 100% PASS |
| Database Concurrency Versioning | `supabase/tests/03100_person_concurrency.test.sql` | pgTAP DB | 4 tests | 100% PASS |
| Database Soft Delete & Restore | `supabase/tests/03200_person_restore.test.sql` | pgTAP DB | 6 tests | 100% PASS |
| Database Similarity & Isolation | `supabase/tests/03300_person_similarity.test.sql` | pgTAP DB | 4 tests | 100% PASS |
| Person Management E2E | `tests/e2e/persons.spec.ts` | Playwright E2E | 6 tests | 100% PASS |

**Tổng cộng:** 21 test files Vitest (108 tests), 4 test files pgTAP DB (20 tests), 6 test files Playwright E2E (26 tests). Tất cả đều đạt tỷ lệ pass 100%.

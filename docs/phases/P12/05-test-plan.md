# Kế Hoạch & Ma Trận Kiểm Thử: Phase P12

## 1. Ma Trận Kiểm Thử Nghiệp Vụ

| Kịch Bản Kiểm Thử | Công Cụ | File Test | Kết Quả |
| :--- | :--- | :--- | :---: |
| Họ tên tiếng Việt có dấu, trim khoảng trắng, chặn control chars | Vitest | `tests/unit/persons/schemas.test.ts` | PASS |
| Chặn ngày mất trước ngày sinh (Exact & Year-only) | Vitest | `tests/unit/persons/schemas.test.ts` | PASS |
| Ánh xạ PartialDateValue $\leftrightarrow$ DB, cấm ngày giả `01/01` (INV-002) | Vitest | `tests/unit/persons/partial-date-mapper.test.ts` | PASS |
| Bảng phân loại lỗi nghiệp vụ thân thiện | Vitest | `tests/unit/persons/errors.test.ts` | PASS |
| Render component UI Person Detail & Relationship List | Vitest | `tests/unit/persons/components.test.tsx` | PASS |
| Chuẩn hóa tên tự động bằng Trigger DB | pgTAP | `supabase/tests/03000_person_normalization.test.sql` | PASS |
| Optimistic Concurrency Locking với cột `version` | pgTAP | `supabase/tests/03100_person_concurrency.test.sql` | PASS |
| Xóa mềm & Khôi phục nhân vật bằng RPC | pgTAP | `supabase/tests/03200_person_restore.test.sql` | PASS |
| Tìm kiếm ứng viên tương tự & Cách ly cây phả hệ | pgTAP | `supabase/tests/03300_person_similarity.test.sql` | PASS |
| Bảo vệ chuyển hướng đăng nhập và responsive routes | Playwright | `tests/e2e/persons.spec.ts` | PASS |

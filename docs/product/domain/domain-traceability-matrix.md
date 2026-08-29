# Ma trận Truy vết Yêu cầu Nghiệp vụ Phả hệ (Domain Traceability Matrix)

- **Mã tài liệu:** `DOM-TRACE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Ma trận Truy vết Toàn diện từ P01 sang P02

| P01 Objective | P01 Use Case | P01 User Story | P01 AC | P02 Concept | P02 Business Rule | P02 Invariant | P02 Test Case | Severity | Phase Triển khai |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`OBJ-001`** (Quản trị riêng tư) | `UC-001`..`UC-003` | `US-A01`..`US-A03` | `AC-US-A01-01` | `ENT-001` (User) | `BR-ID-001`..`005` | `INV-001`, `INV-013` | `RTC-001`..`003` | `BLOCKING` | `Phase P04` |
| **`OBJ-001`** (Quản trị riêng tư) | `UC-004`, `UC-005` | `US-B01`, `US-B02` | `AC-US-B01-01` | `ENT-002` (Tree) | `BR-TR-001`..`004` | `INV-005` | `RTC-004` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-006`..`UC-008` | `US-C01`..`US-C03` | `AC-US-C01-01` | `ENT-003` (Person) | `BR-IP-001`, `PDR-001` | `INV-006`, `INV-010` | `RTC-005`, `RTC-042` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-019`, `UC-020` | `US-C04`, `US-C05` | `AC-US-C04-01` | `ENT-003` (Person) | `DEL-001`..`DEL-004` | `INV-015` | `RTC-060`..`068` | `BLOCKING` | `Phase P05` |
| **`OBJ-003`** (Mở rộng tổ tiên) | `UC-009`, `UC-010` | `US-D01`, `US-D02` | `AC-US-D01-01` | `REL-001` (BioParent) | `BR-EX-001`..`004` | `INV-004`, `INV-017` | `RTC-006`..`009` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-011` (Link có sẵn) | `US-D03` | `AC-US-D03-01` | `REL-001` (BioParent) | `BR-LK-001`..`004` | `INV-004`, `INV-005` | `RTC-014`, `RTC-016` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-012` (Hôn phối) | `US-D04` | `AC-US-D04-01` | `REL-005` (Marriage) | `BR-MA-001`..`004` | `INV-003`, `INV-016` | `RTC-029`..`035` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-013` (Thêm con) | `US-D05` | `AC-US-D05-01` | `REL-001` (BioChild) | `RR-001`, `GEN-002` | `INV-017` | `RTC-017`, `RTC-070` | `BLOCKING` | `Phase P05` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-024` (Anti-cycle) | `US-D06` | `AC-US-D06-01..02` | `REL-001` (DAG Invariant) | `RR-001`, `RR-002` | `INV-002`, `INV-004` | `RTC-018`, `RTC-023..028` | `BLOCKING` | `Phase P05 / P16` |
| **`OBJ-004`** (Đa thiết bị) | `UC-014`..`UC-016` | `US-E01`..`US-E04` | `AC-US-E01-01..04` | `CONCEPT-002` (Center) | `BR-CP-001`..`004` | `INV-007`, `INV-009` | `RTC-010`, `RTC-011` | `INFO` | `Phase P06` |
| **`OBJ-005`** (Tra cứu nhanh) | `UC-017` | `US-F01`, `US-F02` | `AC-US-F01-01..02` | `ENT-003` (Search) | `BR-CP-002` | `INV-007` | `RTC-011` | `INFO` | `Phase P07` |
| **`OBJ-006`** (Sao lưu dữ liệu) | `UC-021`, `UC-022` | `US-H01`, `US-H02` | `AC-US-H01-01..02` | `ENT-002` (Export) | `PDR-001`..`003` | `INV-010` | `RTC-049` | `BLOCKING` | `Phase P20` |

---

## 2. Kiểm toán Độ bao phủ (Coverage Audit)

- [x] 100% User Stories nhóm Must của P01 đều có Business Rule tương ứng trong P02.
- [x] 100% trong số 20 Domain Invariants (`INV-001` - `INV-020`) đều có ít nhất 1 kịch bản kiểm thử (`RTC-XXX`).
- [x] 100% các mã lỗi Blocking (`ERR-001` - `ERR-008`) đều có test case kiểm chứng hành vi chặn.
- [x] Không có quy tắc nào vi phạm các ràng buộc phạm vi ngoài (Out-of-scope) của P01.

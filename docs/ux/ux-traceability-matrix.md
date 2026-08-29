# Ma trận Truy vết Trải nghiệm Người dùng (UX Traceability Matrix)

- **Mã tài liệu:** `UX-TRACE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Ma trận Truy vết Toàn diện từ Yêu cầu P01/P02 sang Thiết kế UX P03

| P01 Objective | P01 Use Case | P01 User Story | P02 Domain Rule | P02 Validation Severity | P03 User Flow | P03 Screen IDs | P03 State IDs | Priority | Future Implementation Phase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`OBJ-001`** (Quản trị riêng tư) | `UC-001`..`003` | `US-A01`..`A03` | `BR-ID-001`..`005` | `ERR-UX-01` | `FLOW-AUTH-01` | `SCR-001`..`004`, `SCR-022` | `STATE-001`..`004` | `MUST` | `Phase P04 / P11` |
| **`OBJ-001`** (Quản trị riêng tư) | `UC-004`, `005` | `US-B01`, `B02` | `BR-TR-001`..`004` | `INV-005` | `FLOW-SETUP-01`| `SCR-005`, `SCR-007` | `STATE-005` | `MUST` | `Phase P05 / P12` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-006`..`008` | `US-C01`..`C03` | `BR-IP-001`, `PDR-001` | `INV-008`, `INV-010` | `FLOW-SETUP-02`| `SCR-008`, `SCR-012` | `STATE-006`, `007` | `MUST` | `Phase P05 / P13` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-019`, `020` | `US-C04`, `C05` | `DEL-001`..`DEL-004`| `INV-015`, `CONF-002` | `FLOW-PERSON-02`| `SCR-011`, `SCR-018` | `STATE-008` | `MUST` | `Phase P05 / P14` |
| **`OBJ-003`** (Mở rộng tổ tiên) | `UC-009`, `010` | `US-D01`, `D02` | `BR-EX-001`, `RR-001`| `INV-004`, `ERR-002` | `FLOW-REL-01`, `02` | `SCR-009`, `SCR-014` | `STATE-009`, `010` | `MUST` | `Phase P05 / P15` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-011` (Link có sẵn)| `US-D03` | `BR-LK-001`..`004` | `INV-004`, `ERR-001` | `FLOW-REL-05` | `SCR-017` | `STATE-011` | `MUST` | `Phase P05 / P16` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-012` (Hôn phối) | `US-D04` | `BR-MA-001`..`004` | `INV-003`, `ERR-003` | `FLOW-REL-03` | `SCR-009`, `SCR-015` | `STATE-012` | `MUST` | `Phase P05 / P15` |
| **`OBJ-002`** (Nhập dần theo time) | `UC-013` (Thêm con) | `US-D05` | `RR-001`, `GEN-002` | `INV-017`, `WARN-002` | `FLOW-REL-04` | `SCR-009`, `SCR-016` | `STATE-013` | `MUST` | `Phase P05 / P15` |
| **`OBJ-004`** (Đa thiết bị) | `UC-014`..`016` | `US-E01`..`E04` | `BR-CP-001`..`004` | `INV-007` | `FLOW-TREE-01` | `SCR-009`, `SCR-011` | `STATE-014` | `MUST` | `Phase P06 / P15` |
| **`OBJ-005`** (Tra cứu nhanh) | `UC-017` | `US-F01`, `F02` | `BR-CP-002` | `INV-007` | `FLOW-SEARCH-01`| `SCR-010` | `STATE-015` | `MUST` | `Phase P07 / P17` |
| **`OBJ-006`** (Sao lưu dữ liệu) | `UC-021`, `022` | `US-H01`, `H02` | `PDR-001`..`003` | `INV-010` | `FLOW-BACKUP-01`| `SCR-019`, `SCR-020` | `STATE-016` | `MUST` | `Phase P20` |

---

## 2. Kiểm toán Độ bao phủ UX (UX Coverage Audit)

- [x] **100% User Stories nhóm Must** của P01 đều có User Flow và Màn hình wireframe tương ứng.
- [x] **100% Blocking Invariants** (`INV-001` - `INV-020`) và mã lỗi (`ERR-001` - `ERR-008`) đều có UI State và thông báo dễ hiểu.
- [x] **100% Warning Rules** (`WARN-001` - `WARN-007`) đều có Relationship Warning Pattern và hộp thoại xác nhận.
- [x] **100% Thao tác Nguy hiểm** (Xóa mềm, ngắt liên kết, đổi anchor) đều có Dangerous Action Pattern.
- [x] **100% Core Flows** đều được đặc tả cả hành vi trên Desktop và Mobile.

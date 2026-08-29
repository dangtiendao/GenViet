# Ma trận Truy vết Yêu cầu Sản phẩm (Product Traceability Matrix)

- **Mã tài liệu:** `PROD-TRACE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Ma trận Truy vết Toàn diện (Full Traceability Matrix)

Ma trận này kết nối toàn diện chuỗi giá trị từ Mục tiêu $\rightarrow$ Vấn đề $\rightarrow$ Use Case $\rightarrow$ Yêu cầu Chức năng $\rightarrow$ User Story $\rightarrow$ Acceptance Criteria $\rightarrow$ Chỉ số Thành công $\rightarrow$ Phase Thi công:

| Objective | Problem | Use Case | Requirement | User Story | Acceptance Criteria | MoSCoW | Success Metric | Phase Thi công |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **OBJ-001** (Quản trị riêng tư) | `PROB-004` (Lộ dữ liệu) | `UC-001`, `UC-002`, `UC-003` | `FR-001` (Auth) | `US-A01`, `US-A02`, `US-A03` | `AC-US-A01-01..02`, `AC-US-A02-01..02`, `AC-US-A03-01` | `Must` | `SM-001`, `SM-004` | `Phase P04` |
| **OBJ-001** (Quản trị riêng tư) | `PROB-004` (Lộ dữ liệu) | `UC-004`, `UC-005` | `FR-002` (Cây) | `US-B01`, `US-B02` | `AC-US-B01-01`, `AC-US-B02-01` | `Must` | `SM-001`, `SM-004` | `Phase P05` |
| **OBJ-002** (Nhập dần theo time) | `PROB-001` (Chắp vá) | `UC-006`, `UC-007`, `UC-008` | `FR-003` (Nhân vật) | `US-C01`, `US-C02`, `US-C03` | `AC-US-C01-01..02`, `AC-US-C02-01`, `AC-US-C03-01` | `Must` | `SM-001`, `SM-002` | `Phase P05` |
| **OBJ-002** (Nhập dần theo time) | `PROB-005` (Mất dữ liệu) | `UC-019`, `UC-020` | `FR-008` (Xóa mềm) | `US-C04`, `US-C05` | `AC-US-C04-01..02`, `AC-US-C05-01` | `Must`/`Should` | `SM-001`, `SM-009` | `Phase P05` |
| **OBJ-003** (Mở rộng tổ tiên) | `PROB-002` (Cứng nhắc) | `UC-009`, `UC-010` | `FR-004` (Quan hệ) | `US-D01`, `US-D02` | `AC-US-D01-01`, `AC-US-D02-01` | `Must` | `SM-001`, `SM-002` | `Phase P05` |
| **OBJ-002** (Nhập dần theo time) | `PROB-001` (Chắp vá) | `UC-011`, `UC-012`, `UC-013` | `FR-004` (Quan hệ) | `US-D03`, `US-D04`, `US-D05` | `AC-US-D03-01`, `AC-US-D04-01`, `AC-US-D05-01` | `Must` | `SM-001`, `SM-002` | `Phase P05` |
| **OBJ-002** (Nhập dần theo time) | `PROB-001` (Chắp vá) | `UC-024` (Anti-cycle) | `FR-004` (Quan hệ) | `US-D06` (Chống lặp) | `AC-US-D06-01`, `AC-US-D06-02` | `Must` | `SM-003` (Toàn vẹn) | `Phase P05 / P16` |
| **OBJ-004** (Đa thiết bị) | `PROB-003` (Kém mobile) | `UC-014`, `UC-015`, `UC-016` | `FR-005` (Đồ thị) | `US-E01`, `US-E02`, `US-E03`, `US-E04` | `AC-US-E01-01`, `AC-US-E02-01`, `AC-US-E03-01`, `AC-US-E04-01` | `Must` | `SM-005`, `SM-006` | `Phase P06 / P22` |
| **OBJ-005** (Tra cứu nhanh) | `PROB-001` (Khó tìm) | `UC-017` (Tìm kiếm) | `FR-006` (Tìm kiếm) | `US-F01`, `US-F02` | `AC-US-F01-01`, `AC-US-F02-01` | `Must` | `SM-001`, `SM-002` | `Phase P07` |
| **OBJ-002** (Nhập dần theo time) | `PROB-006` (Giao diện) | `UC-018` (Avatar) | `FR-007` (Avatar) | `US-G01` | `AC-US-G01-01` | `Should` | `SM-001` | `Phase P08` |
| **OBJ-006** (Sao lưu dữ liệu) | `PROB-005` (Mất dữ liệu) | `UC-021`, `UC-022` | `FR-009` (Backup) | `US-H01`, `US-H02` | `AC-US-H01-01`, `AC-US-H02-01` | `Must`/`Should` | `SM-007`, `SM-009` | `Phase P20` |
| **OBJ-001** (Quản trị riêng tư) | `PROB-004` (Lộ dữ liệu) | `UC-004`, `UC-019` | `FR-011` (Privacy/RLS) | `US-I01`, `US-I02` | `AC-US-I01-01`, `AC-US-I02-01` | `Must` | `SM-004`, `SM-009` | `Phase P04 / P17` |
| **OBJ-007** (Khả thi MVP) | `PROB-006` (Chi phí cao) | `UC-023` (Empty state) | `FR-012` (UX States) | `US-B03` | `AC-US-B03-01` | `Must` | `SM-001`, `SM-008` | `Phase P06` |

---

## 2. Kiểm tra Tính Nhất quán (Traceability Audit)

- [x] 100% Mục tiêu (`OBJ-001` đến `OBJ-007`) đều có ít nhất một Use Case và User Story phục vụ.
- [x] 100% Vấn đề (`PROB-001` đến `PROB-006`) đều có giải pháp tương ứng trong Functional Requirements.
- [x] 100% User Stories nhóm `Must` đều có Acceptance Criteria chi tiết dạng Given-When-Then.
- [x] 100% Tính năng `Won't` đều được liên kết chính xác sang danh mục `Out-of-Scope` ([docs/product/out-of-scope.md](./out-of-scope.md)).
- [x] Không có yêu cầu `Must` nào bị mồ côi hoặc không xác định được Phase thi công kỹ thuật tương lai.

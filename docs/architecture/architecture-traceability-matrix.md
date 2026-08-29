# Ma trận Truy vết Kiến trúc Hệ thống (Architecture Traceability Matrix)

- **Mã tài liệu:** `ARCH-TRACE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bảng Ma trận Truy vết Khép kín từ Yêu cầu P01/P02/P03 sang Kiến trúc P04

| P01 Objective / Use Case | P02 Domain Invariant | P03 UX Flow & Screen | P04 Component & Rule | ADR Áp dụng | Phase Triển khai | Phase Kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`OBJ-001`** (Quản trị riêng tư) | `INV-001` (Tách User vs Person) | `FLOW-AUTH-01`, `SCR-001..004` | `CNT-003` (Supabase Auth), `AR-004` | `ADR-0004` | `Phase P09` | `Phase P22` |
| **`OBJ-001`** (Quản trị riêng tư) | `INV-005` (Một người sở hữu cây) | `FLOW-SETUP-01`, `SCR-005, 007` | `CNT-004` (Postgres RLS), `AR-003` | `ADR-0005`, `0006` | `Phase P06, P08` | `Phase P22` |
| **`OBJ-002`** (Khởi tạo linh hoạt) | `INV-008` (Initial Person $\ne$ Thủy tổ) | `FLOW-SETUP-02`, `SCR-008` | `CMP-004` (Server Action), `SVC-002` | `ADR-0001`, `0003` | `Phase P05, P11` | `Phase P22` |
| **`OBJ-002`** (Ngày tháng lịch sử) | `INV-010` (Hỗ trợ Partial Dates) | `FLOW-PERSON-01`, `SCR-013` | `REP-002` (PersonRepo), `SVC-002` | `ADR-0005`, `0011` | `Phase P07, P11` | `Phase P22` |
| **`OBJ-003`** (Mở rộng tổ tiên) | `INV-004` (Chống chu trình DAG) | `FLOW-REL-01, 02`, `SCR-014` | `CMP-006` (DAG Invariant Validator) | `ADR-0010`, `0011` | `Phase P07, P13` | `Phase P22` |
| **`OBJ-002`** (Hôn phối & Con cái) | `INV-003`, `INV-016` (Hôn nhân độc lập) | `FLOW-REL-03, 04`, `SCR-015, 016` | `CMP-007` (Atomic Tx Coordinator) | `ADR-0008`, `0010` | `Phase P07, P13` | `Phase P22` |
| **`OBJ-002`** (Liên kết người có sẵn)| `INV-002`, `INV-004` (Chống self-link) | `FLOW-REL-05`, `SCR-017` | `SVC-003` (RelationshipService) | `ADR-0003`, `0011` | `Phase P07, P13` | `Phase P22` |
| **`OBJ-002`** (Xóa mềm bảo toàn) | `INV-015` (Cấm xóa lan truyền) | `FLOW-PERSON-02`, `SCR-018` | `CMP-007` (Soft Delete Tx), `AUD-003` | `ADR-0011`, `0016` | `Phase P07, P14` | `Phase P22` |
| **`OBJ-004`** (Tương tác Đồ thị) | `INV-007` (Center Person chỉ là View) | `FLOW-TREE-01`, `SCR-009` | `CMP-001` (React Flow), `CMP-002` (ELK) | `ADR-0008`, `0009` | `Phase P14, P15` | `Phase P23` |
| **`OBJ-005`** (Tìm kiếm tiếng Việt) | `INV-007` | `FLOW-SEARCH-01`, `SCR-010` | `SVC-005` (SearchService), `REP-002` | `ADR-0002`, `0011` | `Phase P07, P16` | `Phase P22` |
| **`OBJ-006`** (Sao lưu dữ liệu) | `INV-010` (Bảo toàn độ chính xác ngày) | `FLOW-BACKUP-01`, `SCR-020` | `CMP-005` (Route Handler Stream) | `ADR-0003`, `0005` | `Phase P20` | `Phase P22` |
| **`OBJ-007`** (Media Avatar) | `INV-010` | `SCR-011, 012` | `CMP-009` (Storage Adapter), `CNT-005` | `ADR-0007`, `0012` | `Phase P17` | `Phase P22` |

---

## 2. Kiểm toán Độ bao phủ Kiến trúc (Architecture Coverage Audit)

- [x] **100% Must Use Cases** của P01 đều có đường dẫn kiến trúc (Architecture Path) từ UI $\rightarrow$ Server Action/Handler $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ CSDL.
- [x] **100% 20 Domain Invariants** (`INV-001` - `INV-020`) của P02 đều có vị trí cưỡng chế rõ ràng tại Service Layer và CSDL Constraints/Triggers.
- [x] **100% 25 Màn hình & Overlays** của P03 đều được phân định Server Component vs Client Component.
- [x] **100% Thao tác Nguy hiểm** đều có Transaction Boundary và Audit Logging bảo vệ.
- [x] **100% Ranh giới An ninh** đều có giải pháp giảm thiểu rủi ro (Mitigation Controls) trong Threat Model.

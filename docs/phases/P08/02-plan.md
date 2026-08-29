# Kế hoạch Thi công Chi tiết: Phase P08 (Phase Plan - Cổng G1)

- **Mã Phase:** `P08`
- **Tên Phase:** RLS và Phân quyền
- **Trạng thái Kế hoạch:** `ACCEPTED`
- **Nhánh thi công:** `phase/p08-rls-authorization`
- **Starting Commit:** `ef25d32`

---

## 1. Phân chia 8 Gói Công việc (Work Packages Breakdown)

```mermaid
graph TD
    WP1[P08-WP01: Preflight & Authorization Planning] --> WP2[P08-WP02: RLS Foundation & Profiles Policies]
    WP2 --> WP3[P08-WP03: Family Tree & Membership Policies]
    WP3 --> WP4[P08-WP04: Person Policies & Immutability]
    WP4 --> WP5[P08-WP05: Relationships & Unions Policies]
    WP5 --> WP6[P08-WP06: Escalation & Cross-Tree Protection]
    WP6 --> WP7[P08-WP07: Security Tests & Service-Role Isolation]
    WP7 --> WP8[P08-WP08: Performance, Full Review & Handover]
```

- **`P08-WP01`:** Git preflight, xác minh DoR $\rightarrow$ `docs/phases/P08/01-input-readiness.md`, `02-plan.md`, `03-task-breakdown.md`.
- **`P08-WP02` (Tasks T01..T03):** RLS enablement, table grants baseline, `profiles` policies & tests.
- **`P08-WP03` (Tasks T04..T09):** `family_trees` & `tree_memberships` policies, owner protection, recursion handling.
- **`P08-WP04` (Tasks T10..T13):** `persons` read/create/update/soft-delete policies, immutable trigger.
- **`P08-WP05` (Tasks T14..T15):** `parent_child_relationships`, `unions`, `union_members` policies & same-tree tests.
- **`P08-WP06` (Tasks T16..T19):** Chặn đổi `tree_id`, chặn Viewer ghi, cưỡng chế Owner-only actions.
- **`P08-WP07` (Tasks T20..T24):** Owner, Viewer, Outsider, Cross-Tree, Service-Role isolation tests.
- **`P08-WP08` (Task T25):** Policy query-plan review, supporting indexes, full validation, summary và handover cho Phase P09.

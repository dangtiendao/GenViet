# Kế hoạch Thi công Chi tiết: Phase P11 (Phase Plan - Cổng G1)

- **Mã Phase:** `P11`
- **Tên Phase:** Quản lý gia phả (Family Tree Management)
- **Trạng thái Kế hoạch:** `ACCEPTED`
- **Nhánh thi công:** `phase/p11-family-tree-management`
- **Starting Commit:** `3727f07`

---

## 1. Phân chia 9 Gói Công việc (Work Packages Breakdown)

- **`P11-WP01`:** Preflight và Family Tree planning.
- **`P11-WP02` (Tasks T03, T04, T05):** Atomic creation foundation (Migration, RPC `create_family_tree`, Database tests).
- **`P11-WP03` (Tasks T01, T02, T16):** List page, Create form, Empty state, responsive tests.
- **`P11-WP04` (Tasks T06, T12):** Overview dynamic route, Tree switcher, Header/Breadcrumb integration.
- **`P11-WP05` (Tasks T07, T08, T09, T10, T11):** Settings (Name, Description, Privacy, Generation Anchor, Optimistic Concurrency versioning).
- **`P11-WP06` (Tasks T13, T14):** Soft delete, Trash access, Restore RPC `restore_family_tree`.
- **`P11-WP07` (Task T15):** Permanent deletion safety gate evaluation $\rightarrow$ `DEFERRED_FOR_SAFETY`.
- **`P11-WP08` (Tasks T17, T18):** Owner authorization tests & Cross-tree isolation tests.
- **`P11-WP09`:** Review, quality gates, changelog & handover.

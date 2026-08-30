# Kế Hoạch Thực Hiện: Phase P13

## 1. Các Gói Công Việc (Work Packages)
- **WP01: Khảo sát & Kế hoạch:** Đánh giá DB schema, RLS, phân rã 34 tasks.
- **WP02: Validation & Cycle Foundation:** Function `_system.check_parent_child_cycle`, Zod schemas, error taxonomy.
- **WP03: Transactional RPCs & Audit:** Các hàm RPC trong `supabase/migrations/20260830110000_p13_add_relationship_transactions.sql`.
- **WP04: Parent Flows:** Thêm cha mới, thêm mẹ mới, cha/mẹ nuôi, liên kết cha/mẹ có sẵn, thay thế quan hệ.
- **WP05: Union & Child Flows:** Tạo Union, thêm vợ/chồng, thêm con, kết thúc hôn nhân, xóa mềm quan hệ.
- **WP06: Relationship UX:** Node Action Menu, Add Relative Dialog, Existing Person Selector, Preview Card.
- **WP07: Integrity & Test Coverage:** Vitest unit tests, pgTAP DB tests, Playwright E2E tests.
- **WP08: Documentation & Quality Gates:** Bộ tài liệu tính năng feature docs và hồ sơ nghiệm thu phase dossier.

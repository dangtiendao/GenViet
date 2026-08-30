# Kế Hoạch Thực Hiện: Phase P12

## 1. Các Gói Công Việc (Work Packages)
- **WP01: Khảo sát & Kế hoạch:** Rà soát schema DB, trigger, RLS policies.
- **WP02: Database Layer:** Tạo migration RPC `restore_person` và RLS policy `persons_select_deleted_writers`.
- **WP03: Domain, Types & Mappers:** Types, Zod schemas, error taxonomy, partial-date-mapper, normalize-person-name.
- **WP04: Repository & Service Layer:** Data access layer và business service với optimistic locking.
- **WP05: Server Actions:** Next.js Server Actions cho Create, Update, Soft Delete, Restore.
- **WP06: UI & App Router Routes:** Form fields, Create Form, Edit Form, Detail View, Relationship Summary, Trash View.
- **WP07: Testing Suites:** Vitest unit tests, pgTAP DB tests, Playwright E2E tests.
- **WP08: Documentation & Quality Gates:** Bộ tài liệu kỹ thuật feature và hồ sơ nghiệm thu phase dossier.

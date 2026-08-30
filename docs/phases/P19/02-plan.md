# Phase P19: Kế Hoạch Thi Công (Execution Plan)

## 1. Các Gói Công Việc (Work Packages)
1. **P19-WP01:** Preflight và lập kế hoạch backup-contract.
2. **P19-WP02:** Versioning và JSON Schema Draft 2020-12 (`schemas/genviet-backup-v1.schema.json`, Zod schema, types, errors).
3. **P19-WP03:** Export pipeline và migration CSDL (`export_family_tree_backup` RPC).
4. **P19-WP04:** Download Route Handler (`GET /api/trees/[treeId]/backup`) và Export Card UI.
5. **P19-WP05:** Import validation pipeline, version detector, digest SHA-256, preview và error report.
6. **P19-WP06:** ID mapping và atomic transactional import (`import_family_tree_backup` RPC, New-Tree default, UI import page).
7. **P19-WP07:** Error reporting, rollback coverage, round-trip tests và tamper tests.
8. **P19-WP08:** Quality gates, Review, Handover và Local Git commit.

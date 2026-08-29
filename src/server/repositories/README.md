# Server Repositories Boundary

- **Scope:** Chứa 7 Repository contracts và implementations truy cập CSDL PostgreSQL với RLS.
- **Rule:** Bắt buộc có chỉ thị `import 'server-only'` trên mọi repository file.
- **Architecture Reference:** `docs/architecture/repository-layer.md`, `ADR-0011`.
- **Implementation Phase:** Phase P07 & P08.

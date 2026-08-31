# Phase P30: Public Guest View - Overview

- **Phase Code**: P30
- **Phase Name**: Public Guest View
- **Predecessors**: P28 (Paternal Line Default View), P29 (Google OAuth)
- **Status**: Completed

## Objectives Achieved
1. Allowed unauthenticated visitors and non-members to view published family trees in a dedicated read-only projection.
2. Unauthenticated visitors use PostgreSQL role `anon` without creating anonymous auth user records.
3. Trees default to `PRIVATE`; only tree Owners can publish or unpublish trees.
4. Server-side conservative redaction for living persons and unknown living status.
5. `CUT_BRANCH` policy for private persons, preventing topology shortcuts.
6. Public Graph defaults to P28 `PATERNAL_LINE` traversal.
7. Isolated cache namespace (`public:tree-graph:...`) and default `noindex` robots metadata.
8. Safe return path integration for user login from the public page.

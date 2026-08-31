# P30: Security and Privacy Review

## 1. Scope & Findings
- **Anonymous Identity**: Unauthenticated guests make requests via `anon` role. No anonymous users are registered in `auth.users`.
- **Least Privilege Grants**: `anon` has zero table access. Public access is mediated solely by 3 `SECURITY DEFINER` RPCs returning allowlisted JSON projections.
- **Living Person PII Sentinel**: Verified with automated tests that living person birth dates, contact info, biographies, and notes are never returned in public DTOs.
- **Topology Preservation**: The `CUT_BRANCH` policy stops traversal at private nodes without creating false direct connections (`A -> C`).
- **Mutation Boundary**: Direct mutation RPCs are revoked from `anon`. Guest mutations are strictly denied.
- **Cache Isolation**: Namespace `public:tree-graph:...` is separated from authenticated cache namespaces.

## 2. Verdict
- **Status**: PASSED (No critical, major, or minor privacy/security vulnerabilities detected).

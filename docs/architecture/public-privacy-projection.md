# Public Privacy Projection Architecture

## 1. Overview
GenViet provides a dedicated, read-only public projection for published family trees. Unauthenticated guests and authenticated non-members can view family trees without receiving private domain DTOs or accessing raw PostgreSQL tables.

## 2. Core Pillars

```
+-------------------------------------------------------------------+
|                        Client / Web Browser                       |
|   - Unauthenticated Guest (PostgreSQL anon role)                  |
|   - Authenticated Non-Member (Subject to identical projection)    |
+---------------------------------+---------------------------------+
                                  |
               HTTPS GET /api/public/trees/[slug]/graph
                                  |
                                  v
+-------------------------------------------------------------------+
|                   Next.js Public API & App Router                 |
|   - Route parameter & Depth bounds validation                     |
|   - SEO metadata enforcement (noindex by default)                 |
|   - Public Cache Namespace Isolation (public:tree-graph:...)      |
+---------------------------------+---------------------------------+
                                  |
                     Database RPC get_public_tree_graph_slice
                                  |
                                  v
+-------------------------------------------------------------------+
|                PostgreSQL Security Definer RPCs                   |
|   - Re-verifies tree privacy_level = 'public'                     |
|   - Applies PATERNAL_LINE default traversal (P28)                 |
|   - Enforces CUT_BRANCH on private nodes (No shortcutting)        |
|   - Applies conservative Living-Person Redaction                  |
|   - Returns allowlisted JSON DTO only                             |
+-------------------------------------------------------------------+
```

## 3. Threat Model & Mitigation
- **PII Exposure**: Living person exact dates, places, biographies, and contact details are redacted at the database level.
- **Topology Leaks**: Private nodes terminate public traversal (`CUT_BRANCH`), preventing relationship leakage while never creating false direct links.
- **Data API Tampering**: `anon` has `REVOKE ALL` on all domain tables; direct REST queries are denied by PostgreSQL.

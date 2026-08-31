# P30: Performance Review

## 1. Scale Benchmarks
Scale testing was performed using synthetic trees across 100, 500, and 1,000 persons:

- **100 Persons**: Projection generated in < 10ms (Budget: 50ms).
- **500 Persons**: Projection generated in < 25ms (Budget: 100ms).
- **1,000 Persons**: Projection generated in < 60ms (Budget: 200ms).

## 2. Query Efficiency & Indexing
- Unique index `idx_family_trees_public_slug` on `family_trees (public_slug)` ensures O(1) slug resolution.
- CTE graph queries limit ancestor and descendant recursion to depth 5 with maximum slice node budgets.
- Zero N+1 queries in public projection generation.

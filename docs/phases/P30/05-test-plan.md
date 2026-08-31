# P30: Test Plan

## 1. Unit Tests
- `tests/unit/public-trees/contracts.test.ts`: Slug validation, normalization, reserved keyword prevention.
- `tests/unit/public-trees/living-person-redaction.test.ts`: Living person PII redaction and unknown fallback.
- `tests/unit/public-trees/private-person-topology.test.ts`: CUT_BRANCH policy enforcement.
- `tests/unit/public-trees/cache-key.test.ts`: Isolated cache key namespace and deterministic hashing.
- `tests/unit/public-trees/hidden-reasons.test.ts`: Priority ordering of hidden reasons.
- `tests/unit/public-trees/errors.test.ts`: Error codes and HTTP status mappings.

## 2. Security Tests
- `tests/security/public-guest/living-pii-sentinel.test.ts`: Verifies no PII leaks into public DTOs.
- `tests/security/public-guest/anon-access-boundaries.test.ts`: Verifies anon table and RPC boundaries in migrations.
- `tests/security/public-guest/client-bundle-secrets.test.ts`: Verifies no service-role secrets in client routes.

## 3. Acceptance & Performance Tests
- `tests/acceptance/public-guest/public-guest-journey.test.tsx`: Component rendering and guest journey validation.
- `tests/performance/public-graph-scale.test.ts`: Scale benchmarks for 100, 500, and 1000 persons under strict performance budgets.

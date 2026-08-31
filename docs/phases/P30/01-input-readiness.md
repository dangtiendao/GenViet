# P30: Input Readiness

## 1. Baseline Verification
- **Current Branch**: `phase/p30-public-guest-view` (created from `master`).
- **Predecessors**: P28 and P29 committed and verified.
- **Existing Test Suite**: All 129 predecessor test files (464 tests) passing with 0 errors.

## 2. Decision Records
- **Guest Identity**: `anon` role, unauthenticated request (`auth.uid() IS NULL`).
- **Publication Defaults**: Every tree is `PRIVATE` by default.
- **Grant Baseline**: `REVOKE ALL` on domain tables from `anon`. Access only via `SECURITY DEFINER` public read RPCs.
- **Living Person Policy**: Conservative allowlisted redaction.
- **Topology**: `CUT_BRANCH` on private nodes.
- **SEO & Cache**: `noindex, nofollow` default; isolated cache prefix.

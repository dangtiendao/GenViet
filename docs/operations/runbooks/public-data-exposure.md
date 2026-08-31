# Runbook: Public Data Exposure & Privacy Incident Response

## 1. Severity Levels
- **SEV-1 (Critical)**: Living individual full PII, phone, email, or private scan documents publicly accessible.
- **SEV-2 (High)**: Private branch topology or living full dates displayed in public graph.
- **SEV-3 (Medium)**: Slug conflict or public caching staleness after unpublishing.

## 2. Immediate Containment Procedure
1. **Unpublish Tree**: Execute `unpublish_family_tree` or update `privacy_level = 'private'`.
2. **Invalidate Public Cache**: Increment `publication_version` or clear edge CDN cache.
3. **Revoke Signed URLs**: Any existing signed URLs expire within 15 minutes max TTL.
4. **Investigate Logs**: Inspect server logs for anomalous enumeration patterns (without logging PII).
5. **Post-Mortem & Fix**: Verify RLS policies, projection allowlists, and unit test coverage.

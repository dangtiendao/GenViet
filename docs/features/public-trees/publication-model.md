# Family Tree Publication Model

## 1. Visibility States
- `PRIVATE` (Default): Accessible only by active tree members.
- `PUBLIC`: Accessible by any visitor via unique slug `/public/trees/[slug]`.

## 2. Publication Rules
- **Owner-Only Guard**: Only users with the `owner` role in `tree_memberships` can publish, unpublish, or modify publication settings.
- **Slug Constraints**: 3-60 characters, lowercase alphanumeric and hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`). System reserved words (`admin`, `api`, `auth`, `public`, `dashboard`, etc.) are blocked.
- **Optimistic Concurrency**: Updates to publication settings enforce `version` checks to prevent race conditions.
- **Audit Logging**: Every publish/unpublish action creates an immutable audit record in `_system.audit_events`.

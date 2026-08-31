# P30: Publication Decisions

1. **Guest Model**: PostgreSQL `anon` role. No row created in `auth.users`, no JWT issued for guest access.
2. **Default Privacy**: All family trees default to `PRIVATE`.
3. **Owner Authorization**: Only users with active `owner` role can publish or unpublish family trees.
4. **Public Slug Model**: Unique, lowercase alphanumeric with hyphens, 3-60 characters. Reserved words blocked.
5. **Living Person Policy**: Default `REDACTED` with option for `STRICT`. Unknown living status is treated conservatively as living.
6. **Private Node Policy**: `CUT_BRANCH` policy selected. No shortcutting `A -> C` over private `B`.
7. **Public Graph**: `PATERNAL_LINE` default traversal with Center-Female exception.
8. **SEO Default**: `NOINDEX, NOFOLLOW` default.

# P30: API & Permissions Plan

## 1. PostgreSQL Function Grants
- `GRANT EXECUTE ON FUNCTION public.get_public_tree_summary(TEXT) TO anon, authenticated, service_role;`
- `GRANT EXECUTE ON FUNCTION public.get_public_tree_graph_slice(...) TO anon, authenticated, service_role;`
- `GRANT EXECUTE ON FUNCTION public.get_public_person_profile(TEXT, UUID) TO anon, authenticated, service_role;`
- `GRANT EXECUTE ON FUNCTION public.publish_family_tree(...) TO authenticated, service_role;` (REVOKED from anon)
- `GRANT EXECUTE ON FUNCTION public.unpublish_family_tree(...) TO authenticated, service_role;` (REVOKED from anon)

## 2. Table Grants
- `REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;` (reaffirmed across all domain tables).

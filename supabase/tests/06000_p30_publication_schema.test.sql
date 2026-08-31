-- ==============================================================================
-- Test: 06000_p30_publication_schema.test.sql
-- Phase: P30 (Public Guest View & Schema Verification)
-- ==============================================================================

BEGIN;

SELECT plan(8);

-- 1. Kiểm tra các cột mới trên bảng family_trees
SELECT has_column('public', 'family_trees', 'public_slug', 'Cột public_slug phải tồn tại');
SELECT has_column('public', 'family_trees', 'published_at', 'Cột published_at phải tồn tại');
SELECT has_column('public', 'family_trees', 'publication_version', 'Cột publication_version phải tồn tại');
SELECT has_column('public', 'family_trees', 'search_engine_visibility', 'Cột search_engine_visibility phải tồn tại');

-- 2. Kiểm tra cột public_visibility trên persons
SELECT has_column('public', 'persons', 'public_visibility', 'Cột public_visibility trên persons phải tồn tại');

-- 3. Kiểm tra các RPC function mới
SELECT has_function('public', 'get_public_tree_summary', ARRAY['text'], 'Hàm get_public_tree_summary phải tồn tại');
SELECT has_function('public', 'get_public_tree_graph_slice', ARRAY['text', 'uuid', 'integer', 'integer', 'boolean', 'boolean', 'text', 'uuid'], 'Hàm get_public_tree_graph_slice phải tồn tại');
SELECT has_function('public', 'get_public_person_profile', ARRAY['text', 'uuid'], 'Hàm get_public_person_profile phải tồn tại');

SELECT * FROM finish();
ROLLBACK;

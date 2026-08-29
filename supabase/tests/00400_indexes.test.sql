-- ==============================================================================
-- Test Suite: 00400_indexes.test.sql
-- Phase: P07 (Index Existence & Partial Uniqueness Verification)
-- ==============================================================================

BEGIN;
SELECT plan(11);

-- 1. Tree Memberships Indexes
SELECT has_index('public', 'tree_memberships', 'idx_tree_memberships_active_user', 'Index idx_tree_memberships_active_user must exist');
SELECT has_index('public', 'tree_memberships', 'idx_tree_memberships_tree_id', 'Index idx_tree_memberships_tree_id must exist');

-- 2. Persons Indexes
SELECT has_index('public', 'persons', 'idx_persons_tree_active', 'Index idx_persons_tree_active must exist');
SELECT has_index('public', 'persons', 'idx_persons_tree_search_name', 'Index idx_persons_tree_search_name must exist');

-- 3. Parent-Child Relationships Indexes
SELECT has_index('public', 'parent_child_relationships', 'idx_parent_child_active_unique', 'Index idx_parent_child_active_unique must exist');
SELECT has_index('public', 'parent_child_relationships', 'idx_parent_child_parent_lookup', 'Index idx_parent_child_parent_lookup must exist');
SELECT has_index('public', 'parent_child_relationships', 'idx_parent_child_child_lookup', 'Index idx_parent_child_child_lookup must exist');

-- 4. Unions Indexes
SELECT has_index('public', 'unions', 'idx_unions_tree_active', 'Index idx_unions_tree_active must exist');

-- 5. Union Members Indexes
SELECT has_index('public', 'union_members', 'idx_union_members_active_unique', 'Index idx_union_members_active_unique must exist');
SELECT has_index('public', 'union_members', 'idx_union_members_union_lookup', 'Index idx_union_members_union_lookup must exist');
SELECT has_index('public', 'union_members', 'idx_union_members_person_lookup', 'Index idx_union_members_person_lookup must exist');

SELECT * FROM finish();
ROLLBACK;

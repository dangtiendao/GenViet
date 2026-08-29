-- ==============================================================================
-- Test Suite: 00100_core_schema.test.sql
-- Phase: P07 (Core Database Schema Structure Verification)
-- ==============================================================================

BEGIN;
SELECT plan(22);

-- 1. Verify Core Tables Existence
SELECT has_table('public', 'profiles', 'Table public.profiles must exist');
SELECT has_table('public', 'family_trees', 'Table public.family_trees must exist');
SELECT has_table('public', 'tree_memberships', 'Table public.tree_memberships must exist');
SELECT has_table('public', 'persons', 'Table public.persons must exist');
SELECT has_table('public', 'parent_child_relationships', 'Table public.parent_child_relationships must exist');
SELECT has_table('public', 'unions', 'Table public.unions must exist');
SELECT has_table('public', 'union_members', 'Table public.union_members must exist');

-- 2. Verify Helper Functions
SELECT has_function('_system', 'set_updated_at', ARRAY[]::text[], 'Function _system.set_updated_at must exist');
SELECT has_function('_system', 'normalize_person_name', ARRAY['text'], 'Function _system.normalize_person_name must exist');

-- 3. Verify Domain Enum Types
SELECT has_type('tree_status', 'Enum tree_status must exist');
SELECT has_type('tree_privacy_level', 'Enum tree_privacy_level must exist');
SELECT has_type('membership_role', 'Enum membership_role must exist');
SELECT has_type('membership_status', 'Enum membership_status must exist');
SELECT has_type('gender_type', 'Enum gender_type must exist');
SELECT has_type('living_status_type', 'Enum living_status_type must exist');
SELECT has_type('date_precision_type', 'Enum date_precision_type must exist');
SELECT has_type('verification_status_type', 'Enum verification_status_type must exist');
SELECT has_type('parent_role_type', 'Enum parent_role_type must exist');
SELECT has_type('relationship_kind_type', 'Enum relationship_kind_type must exist');
SELECT has_type('union_status_type', 'Enum union_status_type must exist');
SELECT has_type('union_member_role_type', 'Enum union_member_role_type must exist');

-- 4. Verify Function Normalization Output
SELECT is(
    _system.normalize_person_name('  Nguyễn   Văn   A  '),
    'nguyễn văn a',
    'Name normalization function trims, lowercases, and collapses whitespaces correctly'
);

SELECT * FROM finish();
ROLLBACK;

-- ==============================================================================
-- Test Suite: 07100_avatar_storage_policies.test.sql
-- Phase: P17 (Avatar Storage Helper Functions & Path Extraction)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Test 1: Extract Tree ID từ active path
SELECT is(
    _system.extract_tree_id_from_avatar_path('trees/11111111-1111-4111-a111-111111111111/persons/22222222-2222-4222-a222-222222222222/avatars/33333333-3333-4333-a333-333333333333/avatar.webp'),
    '11111111-1111-4111-a111-111111111111'::uuid,
    'extract_tree_id_from_avatar_path extracts tree_id from active path'
);

-- Test 2: Extract Person ID từ active path
SELECT is(
    _system.extract_person_id_from_avatar_path('trees/11111111-1111-4111-a111-111111111111/persons/22222222-2222-4222-a222-222222222222/avatars/33333333-3333-4333-a333-333333333333/avatar.webp'),
    '22222222-2222-4222-a222-222222222222'::uuid,
    'extract_person_id_from_avatar_path extracts person_id from active path'
);

-- Test 3: Extract Tree ID từ temporary path
SELECT is(
    _system.extract_tree_id_from_avatar_path('temporary/trees/11111111-1111-4111-a111-111111111111/persons/22222222-2222-4222-a222-222222222222/upload-123/avatar.webp'),
    '11111111-1111-4111-a111-111111111111'::uuid,
    'extract_tree_id_from_avatar_path extracts tree_id from temporary path'
);

-- Test 4: Extract Person ID từ temporary path
SELECT is(
    _system.extract_person_id_from_avatar_path('temporary/trees/11111111-1111-4111-a111-111111111111/persons/22222222-2222-4222-a222-222222222222/upload-123/avatar.webp'),
    '22222222-2222-4222-a222-222222222222'::uuid,
    'extract_person_id_from_avatar_path extracts person_id from temporary path'
);

-- Test 5: Trả về NULL khi path sai định dạng hoặc cố tình path traversal
SELECT is(
    _system.extract_tree_id_from_avatar_path('../../../etc/passwd'),
    NULL,
    'Path traversal should safely evaluate to NULL'
);

-- Test 6: Trả về NULL khi UUID không hợp lệ
SELECT is(
    _system.extract_tree_id_from_avatar_path('trees/invalid-uuid-format/persons/invalid/avatar.webp'),
    NULL,
    'Invalid UUID format should return NULL without crashing'
);

SELECT * FROM finish();
ROLLBACK;

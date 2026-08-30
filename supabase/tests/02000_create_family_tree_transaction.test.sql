-- ==============================================================================
-- Test Suite: 02000_create_family_tree_transaction.test.sql
-- Phase: P11 (Family Tree Management - Atomic Creation & Ownership)
-- ==============================================================================

BEGIN;
SELECT plan(8);

-- Test 1: Unauthenticated execution fails
SELECT throws_matching(
    $$ SELECT public.create_family_tree('Cây Họ Nguyễn') $$,
    'Authentication required',
    'Unauthenticated caller cannot invoke create_family_tree'
);

-- Test 2: Create a dummy test user and invoke create_family_tree
DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_member_count int;
BEGIN
    -- Tạo profile cho test user
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'owner-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Chủ Gia Phả');

    -- Giả lập phiên auth.uid()
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    -- Tạo Family Tree
    v_tree_id := public.create_family_tree('Họ Đặng Chi 2', 'Gia phả chi 2 xã Nam Thắng', 'private'::tree_privacy_level);

    -- Kiểm tra Tree đã được tạo
    PERFORM is(
        (SELECT count(*)::int FROM public.family_trees WHERE id = v_tree_id AND name = 'Họ Đặng Chi 2'),
        1,
        'Family tree record must exist with correct name'
    );

    -- Kiểm tra Owner Membership được tạo tự động cho user_id
    PERFORM is(
        (SELECT count(*)::int FROM public.tree_memberships WHERE tree_id = v_tree_id AND user_id = v_user_id AND role = 'owner' AND status = 'active'),
        1,
        'Owner membership must be automatically created in active state'
    );

    -- Kiểm tra is_tree_owner trả về true
    PERFORM is(
        _system.is_tree_owner(v_tree_id, v_user_id),
        true,
        'is_tree_owner must return true for the creator'
    );
END $$;

-- Test 3: Empty name is rejected
DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'empty-name@genviet.local');
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    PERFORM throws_matching(
        $$ SELECT public.create_family_tree('   ') $$,
        'Family tree name cannot be empty',
        'Whitespace-only tree name must be rejected'
    );
END $$;

-- Test 4: Name exceeding 100 characters is rejected
DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_long_name text := repeat('A', 101);
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'long-name@genviet.local');
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    PERFORM throws_matching(
        format('SELECT public.create_family_tree(%L)', v_long_name),
        'exceeds maximum length',
        'Tree name exceeding 100 characters must be rejected'
    );
END $$;

-- Test 5: Anonymous role has no execute permission
SELECT throws_matching(
    $$ SELECT public.create_family_tree('Test Anon') $$,
    'Authentication required',
    'Anon cannot create family tree'
);

SELECT * FROM finish();
ROLLBACK;

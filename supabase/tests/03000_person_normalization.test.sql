-- ==============================================================================
-- Test Suite: 03000_person_normalization.test.sql
-- Phase: P12 (Person Management - Name Normalization Trigger)
-- ==============================================================================

BEGIN;
SELECT plan(6);

DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
    v_person_id UUID;
    v_norm text;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'norm-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Norm User');

    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Họ Nguyễn Phổ Thông');

    -- Test 1: Insert name with multiple whitespaces & mixed case
    INSERT INTO public.persons (tree_id, full_name, created_by, updated_by)
    VALUES (v_tree_id, '   NGUYỄN   VĂN   AN   ', v_user_id, v_user_id)
    RETURNING id, normalized_name INTO v_person_id, v_norm;

    PERFORM is(
        v_norm,
        'nguyễn văn an',
        'Normalized name should trim and collapse multiple whitespaces while lowercasing'
    );

    -- Test 2: Update full_name updates normalized_name automatically
    UPDATE public.persons
    SET full_name = 'Nguyễn Thị Bình'
    WHERE id = v_person_id;

    SELECT normalized_name INTO v_norm FROM public.persons WHERE id = v_person_id;

    PERFORM is(
        v_norm,
        'nguyễn thị bình',
        'Updating full_name should automatically update normalized_name via trigger'
    );

    -- Test 3: Vietnamese accents preserved in full_name
    PERFORM is(
        (SELECT full_name FROM public.persons WHERE id = v_person_id),
        'Nguyễn Thị Bình',
        'full_name must preserve Vietnamese accents exactly'
    );
END $$;

-- Test 4: Database helper function handles null gracefully
SELECT is(
    _system.normalize_person_name(NULL),
    '',
    '_system.normalize_person_name(NULL) should return empty string'
);

-- Test 5: Database helper function trims & collapses whitespace
SELECT is(
    _system.normalize_person_name('  Đặng   Tiến   Đạo  '),
    'đặng tiến đạo',
    'normalize_person_name collapses internal whitespaces'
);

-- Test 6: Empty name insert is rejected by check constraint
DO $$
DECLARE
    v_user_id UUID := gen_random_uuid();
    v_tree_id UUID;
BEGIN
    INSERT INTO auth.users (id, email) VALUES (v_user_id, 'empty-test@genviet.local');
    INSERT INTO public.profiles (id, display_name) VALUES (v_user_id, 'Empty User');
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    v_tree_id := public.create_family_tree('Cây Test Empty');

    PERFORM throws_matching(
        format('INSERT INTO public.persons (tree_id, full_name) VALUES (%L, %L)', v_tree_id, '   '),
        'violates check constraint',
        'Whitespace-only person name must be rejected by check constraint'
    );
END $$;

SELECT * FROM finish();
ROLLBACK;

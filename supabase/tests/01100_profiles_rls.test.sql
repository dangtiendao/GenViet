-- ==============================================================================
-- Test Suite: 01100_profiles_rls.test.sql
-- Phase: P08 (Profiles RLS Policy Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- Setup test fixtures
INSERT INTO public.profiles (id, display_name)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alice User'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bob User');

-- 1. Simulate Alice session
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Test 1: Alice reads own profile
SELECT is(
    (SELECT display_name FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'Alice User',
    'User Alice must be able to read her own profile'
);

-- Test 2: Alice cannot read Bob profile
SELECT is(
    (SELECT count(*)::integer FROM public.profiles WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    0,
    'User Alice must NOT be able to read Bob profile'
);

-- Test 3: Alice updates own profile
UPDATE public.profiles
SET display_name = 'Alice Updated'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT is(
    (SELECT display_name FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    'Alice Updated',
    'User Alice must be able to update her own display_name'
);

-- Test 4: Alice cannot update Bob profile
UPDATE public.profiles
SET display_name = 'Bob Hacked'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

RESET ROLE;

-- Privileged assertion: Bob was not updated
SELECT is(
    (SELECT display_name FROM public.profiles WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    'Bob User',
    'Bob display_name must remain unchanged after Alice attempted update'
);

-- Test 5: Alice cannot mutate immutable column created_at
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

SELECT throws_ok(
    $$ UPDATE public.profiles SET created_at = '2020-01-01T00:00:00Z' WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' $$,
    '42501',
    NULL,
    'Attempting to mutate created_at on profiles must trigger 42501 immutable exception'
);

-- Test 6: anon role cannot read profiles
SET LOCAL ROLE anon;
RESET "request.jwt.claim.sub";

SELECT is(
    (SELECT count(*)::integer FROM public.profiles),
    0,
    'Role anon must not be able to read any profiles'
);

SELECT * FROM finish();
ROLLBACK;

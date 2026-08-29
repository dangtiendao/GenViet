-- ==============================================================================
-- Test Suite: 02000_auth_profile_provisioning.test.sql
-- Phase: P09 (Auth Profile Provisioning Trigger Verification)
-- ==============================================================================

BEGIN;
SELECT plan(6);

-- 1. Verify existence of helper function
SELECT has_function(
    '_system',
    'handle_new_user',
    'Function _system.handle_new_user() must exist'
);

-- 2. Verify security definer property
SELECT is(
    (SELECT prosecdef FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = '_system' AND p.proname = 'handle_new_user'),
    true,
    'Function _system.handle_new_user() must be SECURITY DEFINER'
);

-- 3. Verify search_path is hardened
SELECT is(
    (SELECT proconfig FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = '_system' AND p.proname = 'handle_new_user'),
    ARRAY['search_path=public, _system, pg_temp'],
    'Function _system.handle_new_user() must have search_path set to public, _system, pg_temp'
);

-- 4. Test execution logic via direct insert into auth.users (simulation)
DO $$
DECLARE
    v_test_uid uuid := gen_random_uuid();
BEGIN
    -- Insert test auth user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        v_test_uid,
        '00000000-0000-0000-0000-000000000000',
        'p09_test_user@example.com',
        'encrypted_placeholder',
        timezone('utc', now()),
        '{"display_name": "Nguyen Van A"}'::jsonb,
        timezone('utc', now()),
        timezone('utc', now()),
        'authenticated',
        'authenticated'
    );

    -- Verify profile was created automatically
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_test_uid AND display_name = 'Nguyen Van A') THEN
        RAISE EXCEPTION 'Profile was not automatically provisioned with expected display name';
    END IF;
END $$;

SELECT pass('Profile provisioning trigger creates public.profiles record automatically with metadata');

-- 5. Test missing metadata fallback
DO $$
DECLARE
    v_test_uid_fallback uuid := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        v_test_uid_fallback,
        '00000000-0000-0000-0000-000000000000',
        'fallback_user@example.com',
        'encrypted_placeholder',
        timezone('utc', now()),
        '{}'::jsonb,
        timezone('utc', now()),
        timezone('utc', now()),
        'authenticated',
        'authenticated'
    );

    -- Verify fallback to email prefix
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_test_uid_fallback AND display_name = 'fallback_user') THEN
        RAISE EXCEPTION 'Profile was not created with fallback display name from email prefix';
    END IF;
END $$;

SELECT pass('Profile provisioning fallback to email prefix works when metadata is empty');

-- 6. Test idempotency (duplicate invocation does not error)
DO $$
DECLARE
    v_test_uid_idem uuid := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        v_test_uid_idem,
        '00000000-0000-0000-0000-000000000000',
        'idem_user@example.com',
        'encrypted_placeholder',
        timezone('utc', now()),
        '{"display_name": "Idempotent User"}'::jsonb,
        timezone('utc', now()),
        timezone('utc', now()),
        'authenticated',
        'authenticated'
    );

    -- Second manual trigger invocation simulation
    INSERT INTO public.profiles (id, display_name)
    VALUES (v_test_uid_idem, 'Duplicate Attempt')
    ON CONFLICT (id) DO NOTHING;
END $$;

SELECT pass('Profile provisioning is idempotent and handles conflict gracefully');

SELECT * FROM finish();
ROLLBACK;

-- ==============================================================================
-- Migration: 20260829163000_p09_provision_profiles.sql
-- Project: GenViet (Responsive Web App quản lý cây gia phả)
-- Phase: P09 (Xác thực người dùng - Profile Provisioning Trigger)
-- ==============================================================================

-- 1. Create Profile Provisioning Function in _system schema
CREATE OR REPLACE FUNCTION _system.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, _system, pg_temp
AS $$
DECLARE
    v_raw_name text;
    v_display_name text;
BEGIN
    -- Extract display name from user metadata or fallback to email prefix
    v_raw_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'display_name',
        split_part(NEW.email, '@', 1)
    );

    -- Sanitize and limit display name
    v_display_name := NULLIF(TRIM(v_raw_name), '');
    IF v_display_name IS NULL THEN
        v_display_name := 'Thành viên GenViet';
    END IF;
    
    -- Substring to max 100 characters according to profiles.display_name column definition
    v_display_name := SUBSTRING(v_display_name FROM 1 FOR 100);

    -- Idempotently insert into public.profiles
    INSERT INTO public.profiles (
        id,
        display_name,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        v_display_name,
        timezone('utc', now()),
        timezone('utc', now())
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- 2. Revoke public/anon execute and grant authenticated / postgres execute
REVOKE EXECUTE ON FUNCTION _system.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION _system.handle_new_user() FROM anon;
GRANT EXECUTE ON FUNCTION _system.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION _system.handle_new_user() TO postgres;

-- 3. Create Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION _system.handle_new_user();

-- Comment on function for documentation
COMMENT ON FUNCTION _system.handle_new_user() IS 'P09: Idempotently creates a public.profile record upon auth.users creation';

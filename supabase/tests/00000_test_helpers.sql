-- ==============================================================================
-- Test Helpers & Environment Setup (00000_test_helpers.sql)
-- Phase: P07 (Core Database Schema Testing)
-- Description: Sets up pgTAP and mock test data helper functions in transaction.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgtap;

-- Schema wrapper for test utilities
CREATE SCHEMA IF NOT EXISTS _test_helpers;

-- Helper to create mock authenticated user in auth.users
CREATE OR REPLACE FUNCTION _test_helpers.create_mock_user(
    p_id UUID DEFAULT gen_random_uuid(),
    p_email TEXT DEFAULT 'testuser@genviet.local'
) RETURNS UUID AS $$
BEGIN
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES (p_id, p_email, '{"display_name": "Test User"}'::jsonb)
    ON CONFLICT (id) DO NOTHING;
    RETURN p_id;
EXCEPTION
    WHEN undefined_table THEN
        -- If auth.users is mock-isolated in testing environment
        RETURN p_id;
END;
$$ LANGUAGE plpgsql;

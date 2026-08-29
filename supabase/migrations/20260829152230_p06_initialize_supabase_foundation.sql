-- ==============================================================================
-- Migration: 20260829152230_p06_initialize_supabase_foundation.sql
-- Phase: P06 (Thiết lập Supabase & Môi trường Ban đầu)
-- Task: P06-T04
-- Author: Principal Backend Engineer & Database DevOps
-- Description: Khởi tạo nền tảng Supabase ban đầu, thiết lập múi giờ UTC và
--              các tiện ích mở rộng chuẩn (extensions) phục vụ phả hệ.
-- Rules: Tuyệt đối không tạo schema nghiệp vụ P07 (profiles, trees, persons).
-- ==============================================================================

-- 1. Đảm bảo các tiện ích mở rộng cốt lõi (Core PostgreSQL Extensions) được kích hoạt
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 2. Thiết lập định dạng múi giờ mặc định cho database session
SET TIME ZONE 'UTC';

-- 3. Tạo schema kỹ thuật nội bộ cho metadata hệ thống (nếu cần tracking hạ tầng)
CREATE SCHEMA IF NOT EXISTS _system;
COMMENT ON SCHEMA _system IS 'Internal system schema for infrastructure tracking and migration verification';

-- 4. Bảng kỹ thuật theo dõi trạng thái hạ tầng hệ thống
CREATE TABLE IF NOT EXISTS _system.infrastructure_status (
    id TEXT PRIMARY KEY DEFAULT 'genviet_foundation',
    phase_code TEXT NOT NULL DEFAULT 'P06',
    initialized_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    version TEXT NOT NULL DEFAULT 'v0.1.0'
);

COMMENT ON TABLE _system.infrastructure_status IS 'Tracks initial Supabase infrastructure bootstrap status';

-- Ghi nhận marker hạ tầng hoàn tất
INSERT INTO _system.infrastructure_status (id, phase_code, version)
VALUES ('genviet_foundation', 'P06', 'v0.1.0')
ON CONFLICT (id) DO UPDATE
SET initialized_at = timezone('utc'::text, now()),
    version = EXCLUDED.version;

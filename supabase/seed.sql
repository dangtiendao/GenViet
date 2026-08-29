-- ==============================================================================
-- GenViet Local Development Seed Data (supabase/seed.sql)
-- Phase: P06 (Thiết lập Supabase & Môi trường Ban đầu)
-- ==============================================================================
-- HƯỚNG DẪN & NGUYÊN TẮC:
-- 1. File này chỉ được nạp tự động khi thực hiện `supabase db reset` trên local development.
-- 2. TUYỆT ĐỐI KHÔNG chứa dữ liệu người dùng thật, email thật, hay secret thật.
-- 3. TUYỆT ĐỐI KHÔNG tạo dữ liệu Person/Family Tree giả trong Phase P06.
-- 4. Dữ liệu hạt giống cho các bảng nghiệp vụ (Family Trees, Persons, Relationships)
--    sẽ được bổ sung có kiểm soát từ Phase P07 trở đi.
-- ==============================================================================

-- Ghi nhận trạng thái seed hạ tầng thành công
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '_system' AND table_name = 'infrastructure_status') THEN
        INSERT INTO _system.infrastructure_status (id, phase_code, version)
        VALUES ('seed_status', 'P06', 'v0.1.0-seed-ready')
        ON CONFLICT (id) DO UPDATE
        SET initialized_at = timezone('utc'::text, now()),
            version = EXCLUDED.version;
    END IF;
END $$;

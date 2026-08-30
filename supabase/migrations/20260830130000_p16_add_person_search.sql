-- ==============================================================================
-- Migration: 20260830130000_p16_add_person_search.sql
-- Phase: P16 (Tìm kiếm nhân vật tiếng Việt & Bộ lọc)
-- Author: Principal Database Architect & PostgreSQL Search Engineer
-- Description:
--   1. Kích hoạt extensions unaccent & pg_trgm trong schema extensions.
--   2. Cập nhật hàm _system.normalize_person_name() chuẩn hóa tiếng Việt bỏ dấu & đ -> d.
--   3. Backfill dữ liệu normalized_name cho toàn bộ persons hiện có.
--   4. Tạo chỉ mục tìm kiếm: GIN Trigram index & Composite B-tree indexes.
--   5. Tạo hàm RPC search_persons_in_tree() hỗ trợ text search, filters,
--      deterministic cursor pagination và parent context không N+1.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. KÍCH HOẠT EXTENSIONS
-- ------------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;

-- ------------------------------------------------------------------------------
-- 2. HÀM CHUẨN HÓA TIẾNG VIỆT TẬP TRUNG (_system.normalize_person_name)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _system.normalize_person_name(input_text text)
RETURNS text AS $$
DECLARE
    cleaned text;
BEGIN
    IF input_text IS NULL THEN
        RETURN '';
    END IF;

    -- 1. Trim và thu gọn nhiều khoảng trắng liên tiếp (space, tab, newline, NBSP)
    cleaned := trim(regexp_replace(input_text, '\s+', ' ', 'g'));
    IF cleaned = '' THEN
        RETURN '';
    END IF;

    -- 2. Chuyển chữ thường
    cleaned := lower(cleaned);

    -- 3. Quy đổi ký tự 'đ' và 'Đ' thành 'd'
    cleaned := replace(replace(cleaned, 'Đ', 'd'), 'đ', 'd');

    -- 4. Bỏ dấu thanh qua unaccent
    RETURN extensions.unaccent('extensions.unaccent', cleaned);
EXCEPTION
    WHEN OTHERS THEN
        -- Fallback nếu dictionary unaccent không khả dụng
        RETURN lower(replace(replace(regexp_replace(trim(input_text), '\s+', ' ', 'g'), 'Đ', 'd'), 'đ', 'd'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION _system.normalize_person_name(text) IS
'Chuẩn hóa tên tiếng Việt: chuyển chữ thường, đổi đ/Đ thành d, bỏ dấu thanh unaccent, thu gọn khoảng trắng';

-- ------------------------------------------------------------------------------
-- 3. BACKFILL DỮ LIỆU NORMALIZED_NAME CHO PERSONS HIỆN CÓ
-- ------------------------------------------------------------------------------

UPDATE public.persons
SET normalized_name = _system.normalize_person_name(full_name)
WHERE deleted_at IS NULL OR normalized_name IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 4. CHỈ MỤC TÌM KIẾM (SEARCH INDEXES)
-- ------------------------------------------------------------------------------

-- GIN Trigram index phục vụ tìm kiếm substring và similarity không dấu
CREATE INDEX IF NOT EXISTS idx_persons_normalized_name_trgm
ON public.persons USING gin (normalized_name extensions.gin_trgm_ops)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ prefix matching, sorting và cursor pagination theo Tree
CREATE INDEX IF NOT EXISTS idx_persons_tree_search_name_id
ON public.persons (tree_id, normalized_name, id)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ lọc theo năm sinh và phân trang theo Tree
CREATE INDEX IF NOT EXISTS idx_persons_tree_birth_year_id
ON public.persons (tree_id, birth_year, id)
WHERE deleted_at IS NULL;

-- Composite B-tree index phục vụ lọc theo trạng thái sống
CREATE INDEX IF NOT EXISTS idx_persons_tree_living_status_id
ON public.persons (tree_id, living_status, id)
WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 5. RPC SEARCH PERSONS IN TREE (public.search_persons_in_tree)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.search_persons_in_tree(
    p_tree_id UUID,
    p_query TEXT DEFAULT NULL,
    p_birth_year SMALLINT DEFAULT NULL,
    p_living_status TEXT DEFAULT NULL,
    p_missing_information TEXT DEFAULT NULL,
    p_cursor_rank_tier INTEGER DEFAULT NULL,
    p_cursor_similarity REAL DEFAULT NULL,
    p_cursor_normalized_name TEXT DEFAULT NULL,
    p_cursor_birth_year SMALLINT DEFAULT NULL,
    p_cursor_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    tree_id UUID,
    full_name TEXT,
    normalized_name TEXT,
    gender gender_type,
    living_status living_status_type,
    birth_date DATE,
    birth_year SMALLINT,
    birth_date_precision date_precision_type,
    birth_is_estimated BOOLEAN,
    death_date DATE,
    death_year SMALLINT,
    death_date_precision date_precision_type,
    death_is_estimated BOOLEAN,
    hometown_text TEXT,
    occupation_text TEXT,
    verification_status verification_status_type,
    parents_json JSONB,
    match_tier INTEGER,
    similarity_score REAL
) AS $$
DECLARE
    v_user_id UUID;
    v_has_access BOOLEAN;
    v_norm_query TEXT;
    v_safe_limit INTEGER;
BEGIN
    -- 1. Xác thực người dùng và phân quyền cùng Tree
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'PERSON_SEARCH_UNAUTHENTICATED: Yêu cầu đăng nhập để tìm kiếm.'
            USING ERRCODE = '42501';
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM public.tree_memberships tm
        WHERE tm.tree_id = p_tree_id
          AND tm.user_id = v_user_id
          AND tm.deleted_at IS NULL
          AND tm.status = 'active'
    ) OR EXISTS (
        SELECT 1
        FROM public.family_trees ft
        WHERE ft.id = p_tree_id
          AND ft.deleted_at IS NULL
          AND ft.privacy_level = 'public'
          AND ft.status = 'active'
    ) INTO v_has_access;

    IF NOT v_has_access THEN
        RAISE EXCEPTION 'PERSON_SEARCH_FORBIDDEN: Không có quyền truy cập cây gia phả.'
            USING ERRCODE = '42501';
    END IF;

    -- 2. Chuẩn hóa query và limit an toàn
    v_norm_query := _system.normalize_person_name(p_query);
    v_safe_limit := LEAST(GREATEST(coalesce(p_limit, 20), 1), 100);

    -- 3. Thực thi truy vấn kết hợp ranking và parent context
    RETURN QUERY
    WITH candidate_persons AS (
        SELECT
            p.id AS p_id,
            p.tree_id AS p_tree_id,
            p.full_name AS p_full_name,
            p.normalized_name AS p_normalized_name,
            p.gender AS p_gender,
            p.living_status AS p_living_status,
            p.birth_date AS p_birth_date,
            p.birth_year AS p_birth_year,
            p.birth_date_precision AS p_birth_date_precision,
            p.birth_is_estimated AS p_birth_is_estimated,
            p.death_date AS p_death_date,
            p.death_year AS p_death_year,
            p.death_date_precision AS p_death_date_precision,
            p.death_is_estimated AS p_death_is_estimated,
            p.hometown_text AS p_hometown_text,
            p.occupation_text AS p_occupation_text,
            p.verification_status AS p_verification_status,
            CASE
                WHEN v_norm_query = '' THEN 5
                WHEN p.normalized_name = v_norm_query THEN 1
                WHEN p.normalized_name LIKE (v_norm_query || '%') THEN 2
                WHEN p.normalized_name LIKE ('%' || v_norm_query || '%') THEN 3
                ELSE 4
            END AS p_match_tier,
            CASE
                WHEN v_norm_query = '' THEN 0.0::real
                ELSE extensions.similarity(p.normalized_name, v_norm_query)
            END AS p_similarity_score
        FROM public.persons p
        WHERE p.tree_id = p_tree_id
          AND p.deleted_at IS NULL
          -- Lọc theo Query text nếu có
          AND (
              v_norm_query = ''
              OR p.normalized_name = v_norm_query
              OR p.normalized_name LIKE (v_norm_query || '%')
              OR p.normalized_name LIKE ('%' || v_norm_query || '%')
              OR (length(v_norm_query) >= 3 AND extensions.similarity(p.normalized_name, v_norm_query) >= 0.25)
          )
          -- Lọc theo năm sinh
          AND (p_birth_year IS NULL OR p.birth_year = p_birth_year)
          -- Lọc theo trạng thái sống
          AND (
              p_living_status IS NULL
              OR p_living_status = 'all'
              OR p.living_status = p_living_status::living_status_type
          )
          -- Lọc hồ sơ thiếu thông tin
          AND (
              p_missing_information IS NULL
              OR p_missing_information = 'none'
              OR (p_missing_information = 'missing_birth' AND p.birth_year IS NULL AND p.birth_date IS NULL)
              OR (p_missing_information = 'missing_death_for_deceased' AND p.living_status = 'deceased' AND p.death_year IS NULL AND p.death_date IS NULL)
              OR (p_missing_information = 'missing_hometown' AND (p.hometown_text IS NULL OR trim(p.hometown_text) = ''))
              OR (p_missing_information = 'missing_any_core' AND (
                  (p.birth_year IS NULL AND p.birth_date IS NULL)
                  OR (p.living_status = 'unknown')
                  OR (p.hometown_text IS NULL OR trim(p.hometown_text) = '')
                  OR (p.verification_status = 'unverified')
              ))
          )
    )
    SELECT
        cp.p_id AS id,
        cp.p_tree_id AS tree_id,
        cp.p_full_name AS full_name,
        cp.p_normalized_name AS normalized_name,
        cp.p_gender AS gender,
        cp.p_living_status AS living_status,
        cp.p_birth_date AS birth_date,
        cp.p_birth_year AS birth_year,
        cp.p_birth_date_precision AS birth_date_precision,
        cp.p_birth_is_estimated AS birth_is_estimated,
        cp.p_death_date AS death_date,
        cp.p_death_year AS death_year,
        cp.p_death_date_precision AS death_date_precision,
        cp.p_death_is_estimated AS death_is_estimated,
        cp.p_hometown_text AS hometown_text,
        cp.p_occupation_text AS occupation_text,
        cp.p_verification_status AS verification_status,
        (
            SELECT coalesce(
                jsonb_agg(
                    jsonb_build_object(
                        'id', parent.id,
                        'fullName', parent.full_name,
                        'parentRole', rel.parent_role,
                        'relationshipKind', rel.relationship_kind,
                        'verificationStatus', rel.verification_status
                    ) ORDER BY
                        CASE rel.parent_role WHEN 'father' THEN 1 WHEN 'mother' THEN 2 ELSE 3 END,
                        parent.full_name ASC
                ),
                '[]'::jsonb
            )
            FROM public.parent_child_relationships rel
            JOIN public.persons parent ON parent.id = rel.parent_id
            WHERE rel.child_id = cp.p_id
              AND rel.tree_id = cp.p_tree_id
              AND rel.deleted_at IS NULL
              AND parent.deleted_at IS NULL
        ) AS parents_json,
        cp.p_match_tier AS match_tier,
        cp.p_similarity_score AS similarity_score
    FROM candidate_persons cp
    WHERE (
        p_cursor_id IS NULL
        OR (
            cp.p_match_tier,
            -cp.p_similarity_score,
            cp.p_normalized_name,
            coalesce(cp.p_birth_year, 9999::smallint),
            cp.p_id
        ) > (
            p_cursor_rank_tier,
            -coalesce(p_cursor_similarity, 0.0::real),
            coalesce(p_cursor_normalized_name, ''),
            coalesce(p_cursor_birth_year, 9999::smallint),
            p_cursor_id
        )
    )
    ORDER BY
        cp.p_match_tier ASC,
        cp.p_similarity_score DESC,
        cp.p_normalized_name ASC,
        cp.p_birth_year ASC NULLS LAST,
        cp.p_id ASC
    LIMIT v_safe_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, extensions, _system, pg_temp;

REVOKE EXECUTE ON FUNCTION public.search_persons_in_tree FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_persons_in_tree TO authenticated;

COMMENT ON FUNCTION public.search_persons_in_tree IS
'RPC tìm kiếm nhân vật phả hệ tiếng Việt có dấu/không dấu, lọc theo năm sinh/trạng thái/thông tin thiếu, phân trang cursor và tích hợp parent context';

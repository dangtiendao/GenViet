-- ==============================================================================
-- Test Suite: 07000_avatar_bucket.test.sql
-- Phase: P17 (Private Avatar Storage Bucket Configuration)
-- ==============================================================================

BEGIN;
SELECT plan(4);

-- Test 1: Bucket person-avatars tồn tại
SELECT is(
    (SELECT count(*)::integer FROM storage.buckets WHERE id = 'person-avatars'),
    1,
    'Bucket person-avatars must exist in storage.buckets'
);

-- Test 2: Bucket person-avatars là Private (public = false)
SELECT is(
    (SELECT public FROM storage.buckets WHERE id = 'person-avatars'),
    false,
    'Bucket person-avatars must be strictly private (public = false)'
);

-- Test 3: Cấu hình giới hạn dung lượng file = 10 MB (10485760 bytes)
SELECT is(
    (SELECT file_size_limit FROM storage.buckets WHERE id = 'person-avatars'),
    10485760::bigint,
    'Bucket person-avatars must enforce 10MB file size limit'
);

-- Test 4: Cột avatar_path tồn tại trên bảng persons
SELECT has_column(
    'public',
    'persons',
    'avatar_path',
    'Column avatar_path must exist on public.persons'
);

SELECT * FROM finish();
ROLLBACK;

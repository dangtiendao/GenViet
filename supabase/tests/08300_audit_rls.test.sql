BEGIN;
SELECT plan(5);

-- 1. Kiểm tra RLS đã được bật trên bảng audit_logs
SELECT is(
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'audit_logs'),
    true,
    'RLS phải được kích hoạt trên bảng public.audit_logs'
);

-- 2. Kiểm tra không có policy UPDATE trên audit_logs
SELECT is_empty(
    'SELECT 1 FROM pg_policies WHERE tablename = ''audit_logs'' AND cmd = ''UPDATE''',
    'Không được có bất kỳ RLS policy UPDATE nào trên audit_logs (Bất biến)'
);

-- 3. Kiểm tra không có policy DELETE trên audit_logs
SELECT is_empty(
    'SELECT 1 FROM pg_policies WHERE tablename = ''audit_logs'' AND cmd = ''DELETE''',
    'Không được có bất kỳ RLS policy DELETE nào trên audit_logs (Bất biến)'
);

-- 4. Kiểm tra có policy SELECT cho Tree Members
SELECT isnt_empty(
    'SELECT 1 FROM pg_policies WHERE tablename = ''audit_logs'' AND policyname = ''audit_logs_select_tree_members''',
    'Policy audit_logs_select_tree_members phải tồn tại cho SELECT'
);

-- 5. Kiểm tra anon không có quyền SELECT
SELECT is(
    has_table_privilege('anon', 'public.audit_logs', 'SELECT'),
    false,
    'Role anon không có quyền SELECT trên public.audit_logs'
);

SELECT * FROM finish();
ROLLBACK;

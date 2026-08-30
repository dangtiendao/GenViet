BEGIN;
SELECT plan(2);

-- 1. Kiểm tra caller unauthenticated bị chặn khi gọi export_family_tree_backup
SET LOCAL ROLE anon;
SELECT throws_ok(
    'SELECT public.export_family_tree_backup(''22222222-2222-4222-a222-222222222222''::uuid)',
    '42501',
    NULL,
    'Caller unauthenticated bị chặn khi gọi export_family_tree_backup'
);

-- 2. Kiểm tra caller unauthenticated bị chặn khi gọi import_family_tree_backup
SELECT throws_ok(
    'SELECT public.import_family_tree_backup(''{ "tree": { "id": "11111111-1111-4111-a111-111111111111" } }''::jsonb)',
    '42501',
    NULL,
    'Caller unauthenticated bị chặn khi gọi import_family_tree_backup'
);

SELECT * FROM finish();
ROLLBACK;

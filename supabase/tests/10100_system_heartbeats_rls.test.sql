-- Test Suite: 10100_system_heartbeats_rls.test.sql
-- Description: Kiểm thử Row Level Security và phân quyền truy cập bảng system_heartbeats

begin;
select plan(6);

-- 1. Kiểm tra RLS đã được bật
select table_has_rls('public', 'system_heartbeats', 'Bảng system_heartbeats phải bật RLS');

-- 2. Đổi sang role anon -> không có quyền SELECT/INSERT
set local role anon;

select throws_ok(
  $$ select * from public.system_heartbeats $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role anon không được phép SELECT bảng system_heartbeats'
);

select throws_ok(
  $$ insert into public.system_heartbeats (id) values ('primary') $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role anon không được phép INSERT bảng system_heartbeats'
);

-- 3. Đổi sang role authenticated -> không có quyền SELECT/INSERT/UPDATE
set local role authenticated;

select throws_ok(
  $$ select * from public.system_heartbeats $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role authenticated không được phép SELECT bảng system_heartbeats'
);

select throws_ok(
  $$ update public.system_heartbeats set last_status = 'failure' $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role authenticated không được phép UPDATE bảng system_heartbeats'
);

-- 4. Đổi sang role service_role -> có quyền SELECT
set local role service_role;

select is(
  (select count(*)::integer from public.system_heartbeats),
  1,
  'service_role có quyền đọc bảng system_heartbeats'
);

select * from finish();
rollback;

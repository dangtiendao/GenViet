-- Test Suite: 10200_system_heartbeats_function.test.sql
-- Description: Kiểm thử hàm record_system_heartbeat và chứng minh không tạo dữ liệu nghiệp vụ giả

begin;
select plan(8);

-- 1. anon/authenticated không thể gọi record_system_heartbeat
set local role anon;
select throws_ok(
  $$ select * from public.record_system_heartbeat('manual') $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role anon không có quyền execute function record_system_heartbeat'
);

set local role authenticated;
select throws_ok(
  $$ select * from public.record_system_heartbeat('manual') $$,
  '42501', -- insufficient_privilege
  NULL,
  'Role authenticated không có quyền execute function record_system_heartbeat'
);

-- 2. service_role gọi thành công và cập nhật thành công
set local role service_role;

-- Ghi nhận heartbeat success
select is(
  (select last_status from public.record_system_heartbeat('github_actions', 'run-100', 45, 'success', null)),
  'success',
  'record_system_heartbeat trả về trạng thái success'
);

select is(
  (select consecutive_failures from public.system_heartbeats where id = 'primary'),
  0,
  'Lần chạy success giữ consecutive_failures = 0'
);

-- Ghi nhận heartbeat failure
select is(
  (select last_status from public.record_system_heartbeat('github_actions', 'run-101', 50, 'failure', 'HEARTBEAT_TIMEOUT')),
  'failure',
  'record_system_heartbeat cập nhật trạng thái failure'
);

select is(
  (select consecutive_failures from public.system_heartbeats where id = 'primary'),
  1,
  'Lần chạy failure tăng consecutive_failures lên 1'
);

-- Ghi nhận heartbeat success phục hồi
select is(
  (select consecutive_failures from public.record_system_heartbeat('github_actions', 'run-102', 30, 'success', null)),
  0,
  'Lần chạy success phục hồi reset consecutive_failures về 0'
);

-- 3. Đảm bảo tổng số dòng system_heartbeats luôn bằng 1
select is(
  (select count(*)::integer from public.system_heartbeats),
  1,
  'Tổng số bản ghi trong system_heartbeats luôn luôn bằng 1 duy nhất'
);

select * from finish();
rollback;

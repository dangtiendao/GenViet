-- Test Suite: 10000_system_heartbeats.test.sql
-- Description: Kiểm thử cấu trúc bảng kỹ thuật system_heartbeats và ràng buộc singleton

begin;
select plan(7);

-- 1. Bảng system_heartbeats tồn tại
select has_table('public', 'system_heartbeats', 'Bảng public.system_heartbeats phải tồn tại');

-- 2. Các cột kỹ thuật cơ bản
select has_column('public', 'system_heartbeats', 'id', 'Phải có cột id');
select has_column('public', 'system_heartbeats', 'last_heartbeat_at', 'Phải có cột last_heartbeat_at');
select has_column('public', 'system_heartbeats', 'consecutive_failures', 'Phải có cột consecutive_failures');

-- 3. Số dòng ban đầu đúng bằng 1
select is(
  (select count(*)::integer from public.system_heartbeats),
  1,
  'Bảng system_heartbeats phải chứa chính xác 1 dòng duy nhất'
);

-- 4. Thử insert dòng thứ 2 với ID khác phải bị chặn bởi check constraint
select throws_ok(
  $$ insert into public.system_heartbeats (id, last_source) values ('secondary', 'manual') $$,
  '23514', -- check_violation
  NULL,
  'Không được phép tạo dòng thứ hai với ID khác primary'
);

-- 5. Giá trị ID của bản ghi duy nhất luôn là primary
select is(
  (select id from public.system_heartbeats limit 1),
  'primary',
  'ID của bản ghi duy nhất phải là primary'
);

select * from finish();
rollback;

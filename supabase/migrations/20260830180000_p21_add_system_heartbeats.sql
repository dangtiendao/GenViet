-- Migration: 20260830180000_p21_add_system_heartbeats.sql
-- Description: Tạo bảng kỹ thuật system_heartbeats với ràng buộc singleton (id = 'primary'), RLS và restricted writer function (Phase P21)

-- 1. Tạo bảng kỹ thuật system_heartbeats
create table if not exists public.system_heartbeats (
  id text primary key default 'primary',
  last_heartbeat_at timestamptz not null default clock_timestamp(),
  last_source text not null default 'manual',
  last_run_id text null,
  last_status text not null default 'success',
  last_duration_ms integer null,
  last_error_code text null,
  consecutive_failures integer not null default 0,
  last_success_at timestamptz null,
  last_failure_at timestamptz null,
  updated_at timestamptz not null default clock_timestamp(),
  constraint system_heartbeats_singleton_check check (id = 'primary'),
  constraint system_heartbeats_source_check check (last_source in ('github_actions', 'manual', 'cron', 'cli', 'migration', 'test')),
  constraint system_heartbeats_status_check check (last_status in ('success', 'failure', 'degraded')),
  constraint system_heartbeats_duration_check check (last_duration_ms is null or last_duration_ms >= 0),
  constraint system_heartbeats_failures_check check (consecutive_failures >= 0)
);

comment on table public.system_heartbeats is 'Bảng kỹ thuật ghi nhận nhịp tim hệ thống và vận hành định kỳ (Singleton table - chỉ 1 dòng duy nhất id=primary)';
comment on column public.system_heartbeats.id is 'Khóa chính cố định giá trị primary để đảm bảo duy nhất 1 dòng bản ghi';
comment on column public.system_heartbeats.last_heartbeat_at is 'Thời điểm ghi nhận nhịp tim gần nhất (UTC)';
comment on column public.system_heartbeats.last_source is 'Nguồn kích hoạt nhịp tim (github_actions, manual, cron, cli, migration, test)';
comment on column public.system_heartbeats.last_run_id is 'Mã định danh lần chạy (ví dụ GitHub Action Run ID)';
comment on column public.system_heartbeats.last_status is 'Trạng thái lần chạy gần nhất (success, failure, degraded)';
comment on column public.system_heartbeats.last_duration_ms is 'Thời gian thực thi của nhịp tim tính bằng mili-giây';
comment on column public.system_heartbeats.last_error_code is 'Mã lỗi an toàn nếu lần chạy gần nhất thất bại';
comment on column public.system_heartbeats.consecutive_failures is 'Số lần thất bại liên tiếp ghi nhận được';
comment on column public.system_heartbeats.last_success_at is 'Thời điểm thành công gần nhất';
comment on column public.system_heartbeats.last_failure_at is 'Thời điểm thất bại gần nhất';
comment on column public.system_heartbeats.updated_at is 'Thời điểm cập nhật bản ghi';

-- 2. Khởi tạo bản ghi singleton ban đầu
insert into public.system_heartbeats (
  id,
  last_heartbeat_at,
  last_source,
  last_status,
  consecutive_failures,
  last_success_at,
  updated_at
)
values (
  'primary',
  clock_timestamp(),
  'migration',
  'success',
  0,
  clock_timestamp(),
  clock_timestamp()
)
on conflict (id) do nothing;

-- 3. Bật RLS và thu hồi quyền từ client roles
alter table public.system_heartbeats enable row level security;
alter table public.system_heartbeats force row level security;

revoke all on public.system_heartbeats from anon, authenticated, public;
grant select, insert, update on public.system_heartbeats to service_role;

-- 4. Tạo restricted database function để ghi nhận heartbeat an toàn
create or replace function public.record_system_heartbeat(
  p_source text default 'manual',
  p_run_id text default null,
  p_duration_ms integer default null,
  p_status text default 'success',
  p_error_code text default null
)
returns public.system_heartbeats
language plpgsql
security definer
set search_path = public, pg_catalog, pg_temp
as $$
declare
  v_result public.system_heartbeats;
  v_source text := coalesce(nullif(trim(p_source), ''), 'manual');
  v_status text := coalesce(nullif(trim(p_status), ''), 'success');
  v_duration integer := p_duration_ms;
begin
  -- Validate source allowlist
  if v_source not in ('github_actions', 'manual', 'cron', 'cli', 'migration', 'test') then
    v_source := 'manual';
  end if;

  -- Validate status allowlist
  if v_status not in ('success', 'failure', 'degraded') then
    v_status := 'success';
  end if;

  -- Validate duration
  if v_duration is not null and v_duration < 0 then
    v_duration := 0;
  end if;

  if v_status = 'success' then
    insert into public.system_heartbeats (
      id,
      last_heartbeat_at,
      last_source,
      last_run_id,
      last_status,
      last_duration_ms,
      last_error_code,
      consecutive_failures,
      last_success_at,
      updated_at
    )
    values (
      'primary',
      clock_timestamp(),
      v_source,
      p_run_id,
      v_status,
      v_duration,
      null,
      0,
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (id) do update set
      last_heartbeat_at = clock_timestamp(),
      last_source = excluded.last_source,
      last_run_id = excluded.last_run_id,
      last_status = excluded.last_status,
      last_duration_ms = excluded.last_duration_ms,
      last_error_code = null,
      consecutive_failures = 0,
      last_success_at = clock_timestamp(),
      updated_at = clock_timestamp()
    returning * into v_result;
  else
    insert into public.system_heartbeats (
      id,
      last_heartbeat_at,
      last_source,
      last_run_id,
      last_status,
      last_duration_ms,
      last_error_code,
      consecutive_failures,
      last_failure_at,
      updated_at
    )
    values (
      'primary',
      clock_timestamp(),
      v_source,
      p_run_id,
      v_status,
      v_duration,
      p_error_code,
      1,
      clock_timestamp(),
      clock_timestamp()
    )
    on conflict (id) do update set
      last_heartbeat_at = clock_timestamp(),
      last_source = excluded.last_source,
      last_run_id = excluded.last_run_id,
      last_status = excluded.last_status,
      last_duration_ms = excluded.last_duration_ms,
      last_error_code = excluded.last_error_code,
      consecutive_failures = system_heartbeats.consecutive_failures + 1,
      last_failure_at = clock_timestamp(),
      updated_at = clock_timestamp()
    returning * into v_result;
  end if;

  return v_result;
end;
$$;

comment on function public.record_system_heartbeat is 'Hàm nội bộ privileged ghi nhận nhịp tim hệ thống singleton, cập nhật atomic counter thất bại/thành công';

-- Thu hồi quyền execute từ public/client và chỉ cấp cho service_role
revoke all on function public.record_system_heartbeat(text, text, integer, text, text) from public, anon, authenticated;
grant execute on function public.record_system_heartbeat(text, text, integer, text, text) to service_role;

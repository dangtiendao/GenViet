# Hợp Đồng Dữ Liệu Nhịp Tim (System Heartbeat Contract)

## 1. Cấu Trúc Bảng `system_heartbeats`

| Cột | Kiểu Dữ Liệu | Ràng Buộc | Ý Nghĩa |
| :--- | :--- | :--- | :--- |
| `id` | `text` | Primary Key, `default 'primary'`, `check (id = 'primary')` | Ràng buộc duy nhất 1 dòng bản ghi |
| `last_heartbeat_at` | `timestamptz` | `not null`, `default clock_timestamp()` | Thời điểm ghi nhận nhịp tim gần nhất (UTC) |
| `last_source` | `text` | `not null`, `check (last_source in (...))` | Nguồn kích hoạt (`github_actions`, `manual`, `cron`, `cli`, `migration`, `test`) |
| `last_run_id` | `text` | `nullable` | Mã định danh lần chạy từ scheduler |
| `last_status` | `text` | `not null`, `check (last_status in ('success', 'failure', 'degraded'))` | Trạng thái thực thi gần nhất |
| `last_duration_ms` | `integer` | `nullable`, `check (last_duration_ms >= 0)` | Thời gian xử lý tính bằng mili-giây |
| `last_error_code` | `text` | `nullable` | Mã lỗi an toàn (nếu có lỗi) |
| `consecutive_failures`| `integer` | `not null`, `default 0`, `check (>= 0)` | Số lần thất bại liên tiếp |
| `last_success_at` | `timestamptz` | `nullable` | Thời điểm thành công gần nhất |
| `last_failure_at` | `timestamptz` | `nullable` | Thời điểm thất bại gần nhất |
| `updated_at` | `timestamptz` | `not null` | Thời điểm cập nhật dòng |

## 2. Invariant Singleton & Upsert Semantics
- Khi chạy thành công (`last_status = 'success'`): `consecutive_failures` được reset về 0, `last_success_at` được cập nhật thời gian máy chủ, `last_error_code` bị xóa null.
- Khi chạy thất bại (`last_status = 'failure'`): `consecutive_failures` tăng thêm 1, `last_failure_at` được cập nhật, `last_error_code` ghi nhận mã lỗi tương ứng.

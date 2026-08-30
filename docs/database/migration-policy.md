# Chính sách & Quy chuẩn Quản lý Migration CSDL (Migration Policy)

- **Mã tài liệu:** `DB-POLICY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Quy tắc Đặt tên File Migration (Naming Conventions)

Mọi file migration phải tuân thủ nghiêm ngặt định dạng do Supabase CLI sinh tự động:
$$\text{YYYYMMDDHHMMSS\_<action>\_<entity>\_<purpose>.sql}$$

### Quy định cụ thể:
1. **Timestamp:** 14 chữ số thời gian UTC (`YYYYMMDDHHMMSS`). Tuyệt đối không tự sửa timestamp bằng tay.
2. **Hậu tố mô tả:** Dùng chữ thường viết nối bằng dấu gạch dưới (`snake_case`), nêu rõ hành động và đối tượng tác động.
3. **Cấm đặt tên chung chung:** Tuyệt đối cấm đặt tên như `update.sql`, `changes.sql`, `fix.sql`, `migration1.sql`.
4. **Ví dụ hợp lệ:**
   - `20260829152230_p06_initialize_supabase_foundation.sql`
   - `20260830090000_p07_create_core_tables.sql`
   - `20260831140000_p08_enable_tree_rls_policies.sql`
   - `20260901100000_p12_add_person_partial_dates.sql`

---

## 2. Nguyên tắc Tính Bất biến (Immutability Rules)

1. **Không sửa Migration đã áp dụng:** Một khi file migration đã được merge vào `master` hoặc áp dụng lên môi trường chia sẻ (`genviet-dev` / `production`), **tuyệt đối không được chỉnh sửa nội dung file đó**.
2. **Khắc phục bằng Forward-Fix:** Mọi thay đổi, bổ sung hoặc sửa lỗi schema đều phải được thực hiện bằng cách tạo một file migration mới tiếp theo.
3. **Không xóa file Migration:** Cấm xóa các file migration cũ trong thư mục `supabase/migrations/` để đảm bảo chuỗi tái lập lịch sử schema từ đầu (`deterministic schema replay`).

---

## 3. Quy chuẩn Viết Mã SQL Migration

1. **Tính Idempotent & An toàn:**
   - Luôn sử dụng cú pháp an toàn khi tạo bảng hoặc extensions: `CREATE TABLE IF NOT EXISTS`, `CREATE EXTENSION IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`.
2. **Comment và Metadata:**
   - Mỗi file migration phải có header comment nêu rõ: Phase ID, Task ID, Tác giả, Mục đích và Ranh giới nghiệp vụ.
3. **Tuyệt đối Không chứa Secret / Dữ liệu Cá nhân:**
   - Cấm ghi API keys, token, mật khẩu hoặc dữ liệu họ tên người thật vào migration SQL.
4. **Không kết hợp tùy tiện DDL và DML nặng:**
   - Thay đổi cấu trúc bảng (DDL) và nạp dữ liệu chuyển đổi lớn (Data backfill) nên được tách biệt thành các bước độc lập khi áp dụng môi trường production.

---

## 4. Quy tắc Đồng bộ File Triển khai Hợp nhất (`supabase/full_schema.sql`)

1. **Bắt buộc luôn đồng bộ 100%:** File `supabase/full_schema.sql` là bản hợp nhất toàn diện phục vụ triển khai toàn bộ CSDL trong một lần duy nhất. **Bất kỳ khi nào tạo mới, sửa đổi hoặc cập nhật bất kỳ file SQL migration con nào trong `supabase/migrations/`, BẮT BUỘC phải chạy lệnh tái tạo bundle:**
   ```bash
   npm run supabase:schema:bundle
   ```
2. **Kiểm tra tự động bắt buộc (CI/CD Quality Gate):**
   - Script `npm run supabase:migrations:check` tự động so khớp nội dung của `supabase/full_schema.sql` với toàn bộ chuỗi migration con.
   - Nếu `full_schema.sql` bị cũ (stale) hoặc thiếu bất kỳ câu lệnh nào từ các file migration con, quy trình kiểm tra CI/CD sẽ báo lỗi và chặn build ngay lập tức.


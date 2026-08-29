# Danh sách Hạng mục Tạm hoãn: Phase P09 (Deferred Items)

- **Mã Phase:** `P09`
- **Ngày đối soát:** 2026-08-29
- **Trạng thái:** `1 Deferred Item ghi nhận theo phạm vi MoSCoW P01`

---

## Danh sách Hạng mục Tạm hoãn:

1. **`DEFERRED-ITEM-P09-01` (Kích hoạt Google OAuth Provider trên Production):**
   - *Mô tả:* Tích hợp nhà cung cấp xác thực Google OAuth (`signInWithOAuth({ provider: 'google' })`).
   - *Trạng thái P09:* Đã ban hành hướng dẫn kỹ thuật chi tiết tại [`docs/operations/google-oauth-configuration.md`](../../operations/google-oauth-configuration.md). Chờ chủ dự án tạo Google Cloud OAuth Client ID/Secret và kích hoạt trên Hosted Supabase Dashboard.

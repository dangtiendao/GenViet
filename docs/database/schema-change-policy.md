# Chính sách Cấm Thay đổi Schema Thủ công (Schema Change Policy)

- **Mã tài liệu:** `DB-SCHEMA-POLICY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Quy định Tuyệt đối (Mandatory Rules)

1. **Git Repository là Nguồn Sự thật Duy nhất:**
   - Mọi cấu trúc bảng, cột, khóa ngoại, chỉ mục (index), trigger, function và RLS policy của PostgreSQL **bắt buộc phải được định nghĩa dưới dạng file SQL Migration trong thư mục `supabase/migrations/`**.
2. **Cấm Sửa Bằng Supabase Dashboard:**
   - Tuyệt đối cấm sử dụng Table Editor hoặc SQL Editor trên Supabase Dashboard (Cloud / Staging / Production) để tạo mới hoặc thay đổi schema CSDL ngoài quy trình migration.
3. **Xử lý Tình huống Khẩn cấp (Hotfix Protocol):**
   - Trong trường hợp sự cố production nghiêm trọng buộc phải can thiệp trực tiếp bằng SQL:
     1. Phải ghi nhận nhật ký sự cố (Incident Log) kèm câu lệnh SQL chính xác đã chạy.
     2. Ngay sau khi giải tỏa sự cố, kỹ sư phụ trách phải backfill câu lệnh đó thành một file migration mới trong Git repository.
     3. Tiến hành kiểm tra và đồng bộ lại để triệt tiêu hiện tượng lệch pha schema (Schema Drift).
4. **Cấm AI Tự ý Chạy Production Migration:**
   - Mọi thao tác đẩy migration lên môi trường Production phải do Kỹ sư/Quản trị viên con người trực tiếp phê duyệt và kích hoạt theo đúng [Production Migration Runbook](./production-migration-runbook.md).

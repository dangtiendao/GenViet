# Chính sách Sao lưu Bắt buộc trước Migration (Backup Before Migration Policy)

- **Mã tài liệu:** `DB-BACKUP-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Nguyên tắc An toàn Dữ liệu Tuyệt đối

1. **Không có Backup = Không có Migration:** Tuyệt đối không được phép thực thi bất kỳ câu lệnh migration nào trên môi trường Production nếu chưa hoàn tất một bản sao lưu (logical backup / SQL dump) có thể khôi phục được.
2. **Không Ảo tưởng vào Free Tier Backup:** Supabase Free Tier không cung cấp Point-in-Time Recovery (PITR). Đội ngũ kỹ thuật phải chủ động trích xuất bản sao lưu schema & dữ liệu trước mỗi lần triển khai.
3. **Phân tách Rõ ràng Database và Media Storage:** Bản sao lưu CSDL PostgreSQL chỉ bao gồm dữ liệu bảng và quan hệ; các tệp tin hình ảnh chân dung trong Supabase Storage Bucket phải có quy trình đồng bộ/sao lưu riêng biệt.
4. **Bảo mật Dữ liệu Sao lưu:** File backup chứa dữ liệu gia phả cá nhân của người dùng; tuyệt đối không commit file backup vào Git repository (đã chặn trong `.gitignore` tại thư mục `.backups/`).

---

## 2. Quy trình Thực hiện Sao lưu CSDL Trước Migration

```bash
# 1. Chạy script tạo metadata sao lưu
npm run supabase:backup

# 2. Xuất dữ liệu CSDL đầy đủ ra tệp tin được mã hóa
supabase db dump --db-url "$DATABASE_URL" -f ".backups/db_dump_production_$(date +%Y%m%d_%H%M%S).sql"

# 3. Xác minh tệp tin sao lưu tồn tại và có dung lượng > 0 bytes
ls -lh .backups/
```

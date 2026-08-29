# Checklist Phát hành Phiên bản: [vX.Y.Z]

- **Phiên bản phát hành:** `vX.Y.Z` *(Ví dụ: v0.1.0-mvp)*
- **Ngày phát hành dự kiến:** YYYY-MM-DD
- **Người phụ trách phát hành:** [Lead Maintainer - Con người]
- **Nhánh phát hành:** `main`

---

## 1. Tóm tắt Phạm vi Phát hành (Release Scope Summary)
*Mô tả ngắn gọn các tính năng chính và cải tiến trong bản release này.*

---

## 2. Kiểm tra trước Phát hành (Pre-Release Checklist)

### 2.1. Đảm bảo Chất lượng & Kiểm thử (Quality & Tests)
- [ ] 100% Unit tests và Integration tests đã pass trên nhánh `main`.
- [ ] TypeScript type-check pass không có lỗi (`tsc --noEmit`).
- [ ] Linter & Formatter pass 100%.
- [ ] Kiểm tra trên môi trường Staging/Preview hoạt động ổn định.

### 2.2. Bảo mật & An toàn (Security Checks)
- [ ] Quét mã nguồn và diff: Đảm bảo không chứa bất kỳ secret, API key hay private token nào.
- [ ] Kiểm tra chính sách RLS trên tất cả bảng dữ liệu đang hoạt động chính xác.
- [ ] Biến môi trường trên Production đã được cấu hình đúng giá trị bảo mật.

### 2.3. Cơ sở dữ liệu (Database Migrations)
- [ ] Toàn bộ migration đã được áp dụng thành công trên staging database.
- [ ] Có đầy đủ script SQL Rollback trong trường hợp khẩn cấp.
- [ ] Đã tạo bản sao lưu (Backup snapshot) của database production trước giờ phát hành.

### 2.4. Tài liệu & Truyền thông (Documentation)
- [ ] File `CHANGELOG.md` đã được cập nhật đầy đủ các mục `Added`, `Changed`, `Fixed`.
- [ ] Tài liệu hướng dẫn sử dụng và API Docs (nếu có) đã được cập nhật.

---

## 3. Các bước Thực hiện Phát hành (Execution Steps - Con người thực hiện)

```bash
# 1. Chuyển sang nhánh main đã được cập nhật
git checkout main
git pull origin main

# 2. Tạo Git Tag cục bộ có chú thích (Annotated Tag)
git tag -a vX.Y.Z -m "Release vX.Y.Z: [Tóm tắt ngắn gọn]"

# 3. Đẩy tag lên GitHub (CHỈ CON NGƯỜI THỰC HIỆN)
git push origin vX.Y.Z
```

- [ ] Vercel tự động kích hoạt Production Deployment từ nhánh `main`.
- [ ] Xác nhận Production Deployment đã ở trạng thái `READY` (Xanh).

---

## 4. Kiểm tra Nhanh sau Phát hành (Post-Release Sanity Checks)
- [ ] Truy cập URL Production: Trang web tải mượt mà.
- [ ] Kiểm tra luồng Đăng nhập / Đăng xuất hoạt động tốt.
- [ ] Thao tác tạo thử một cây gia phả mẫu thành công.
- [ ] Kiểm tra dashboard giám sát lỗi (Monitoring / Log) không phát sinh lỗi bất thường.

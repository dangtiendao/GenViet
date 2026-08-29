# Kế hoạch Hoàn tác & Phục hồi: Phase [PXX] / Release [vX.Y.Z]

- **Mã Kế hoạch:** `[ROLLBACK-PXX]`
- **Phiên bản / Phase áp dụng:** `[PXX / vX.Y.Z]`
- **Người lập kế hoạch:** [Tech Lead / DevOps]
- **Người có quyền kích hoạt:** Project Owner / Lead Maintainer

---

## 1. Điều kiện Kích hoạt Rollback (Trigger Conditions)
*Hoàn tác khẩn cấp khi xảy ra một trong các điều kiện sau:*
1. Phát hiện lỗi nghiêm trọng mức `P0` hoặc `CRITICAL` gây rò rỉ dữ liệu gia tộc giữa các tài khoản.
2. Ứng dụng sập hoàn toàn (Crash Loop / 500 Internal Server Error) trên production sau khi deploy.
3. Database migration làm hỏng cấu trúc dữ liệu cũ và không thể ghi dữ liệu mới.

---

## 2. Kiểm tra trước khi Rollback (Pre-Rollback Checklist)
- [ ] Xác nhận đã dừng toàn bộ tiến trình ghi đè (pause background jobs nếu có).
- [ ] Tạo snapshot/backup khẩn cấp của cơ sở dữ liệu hiện tại trước khi can thiệp.
- [ ] Thông báo cho các bên liên quan về việc thực hiện rollback.

---

## 3. Các bước Rollback chi tiết (Execution Steps)

### Bước 1: Rollback Mã nguồn (Git Revert)
```bash
# Hoàn tác commit gây lỗi trên nhánh chính (thực hiện bởi Maintainer)
git checkout main
git pull origin main
git revert <commit-hash-gây-lỗi> -m "revert(PXX): emergency rollback due to critical issue"
git push origin main
```

### Bước 2: Rollback Cơ sở Dữ liệu (Database Rollback)
```bash
# Chạy file SQL rollback đã được chuẩn bị trong phase
supabase db execute --file ./supabase/migrations/rollback/<timestamp>_rollback_phase_pxx.sql
```

### Bước 3: Rollback Hạ tầng / Hosting (Vercel / CDN)
- Truy cập Vercel Dashboard $\rightarrow$ Deployments $\rightarrow$ Chọn bản deploy ổn định liền trước $\rightarrow$ Nhấn **Promote to Production (Instant Rollback)**.
- Xóa cache trên Cloudflare nếu cần thiết.

---

## 4. Xác minh sau Rollback (Post-Rollback Verification)
- [ ] Truy cập trang chủ và kiểm tra trạng thái hoạt động (Health Check 200 OK).
- [ ] Đăng nhập và xác minh dữ liệu cây gia phả mẫu hiển thị bình thường.
- [ ] Kiểm tra error log không còn ghi nhận exception mới.

---

## 5. Báo cáo Sự cố (Incident Post-Mortem Reference)
- Ghi nhận nguyên nhân vào Incident Log và bổ sung bài học kinh nghiệm vào Risk Register.

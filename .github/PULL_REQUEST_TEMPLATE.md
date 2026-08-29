## 1. Thông tin chung
- **Mã Phase / Task:** `[Ví dụ: P00 / P00-T05]`
- **Tiêu đề PR:** `[Tóm tắt ngắn gọn thay đổi]`
- **Loại thay đổi:** `[Docs | Feature | Bugfix | Refactor | Security | Chore]`

---

## 2. Mục tiêu & Bối cảnh
- **Mục tiêu:** [Mô tả mục tiêu chính của Pull Request này]
- **Vấn đề giải quyết:** [Nêu ngắn gọn lý do thay đổi hoặc liên kết Issue #ID]

---

## 3. Phạm vi thay đổi

### Trong phạm vi (In Scope):
- [Mục 1: Tạo tài liệu X]
- [Mục 2: Chỉnh sửa component Y]

### Ngoài phạm vi (Out of Scope):
- [Những việc không thuộc PR này hoặc được hoãn sang phase sau]

---

## 4. Danh sách file thay đổi chính
- `[NEW] path/to/new-file.md`
- `[MODIFY] path/to/modified-file.ts`
- `[DELETE] path/to/deleted-file.ts`

---

## 5. Kiểm thử & Đảm bảo chất lượng (Quality & Tests)
- [ ] Unit Tests / Integration Tests đã chạy và pass 100%.
- [ ] Type check (`tsc --noEmit`) thành công (nếu có TypeScript).
- [ ] Linter & Formatter (`eslint`, `prettier`) không có lỗi.
- [ ] Đã kiểm tra liên kết nội bộ Markdown không bị gãy (nếu là tài liệu).

---

## 6. Cơ sở dữ liệu & Migration (Nếu có)
- [ ] Không có thay đổi cơ sở dữ liệu.
- [ ] Có SQL Migration mới tại `supabase/migrations/`.
- [ ] Đã kiểm tra script migration trên local.
- [ ] Đã có kế hoạch và script Rollback tương ứng.

---

## 7. Bảo mật & Row Level Security (RLS)
- [ ] **Bảo mật Secret:** Đã rà soát diff, cam kết 100% KHÔNG chứa `.env`, API key, token, mật khẩu hay dữ liệu cá nhân thật.
- [ ] **Chính sách RLS:** Đã áp dụng/kiểm tra RLS trên tất cả bảng mới, đảm bảo không rò rỉ dữ liệu giữa các cây gia phả (Multi-tenant isolation).

---

## 8. Ảnh chụp màn hình / Giao diện (UI Proof - Nếu có thay đổi giao diện)
*(Dán ảnh chụp màn hình hoặc GIF demo luồng UI tại đây nếu áp dụng)*

---

## 9. Kế hoạch Rollback (Rollback Plan)
- **Phương án hoàn tác:** [Ví dụ: `git revert <commit-hash>` hoặc chạy script `rollback-schema.sql`]
- **Rủi ro khi rollback:** [Không / Thấp / Có thể mất dữ liệu tạm thời]

---

## 10. Checklist của người mở PR (PR Author Responsibilities)
- [ ] Tôi đã đọc kỹ [Contributing Guide](../CONTRIBUTING.md) và [Git Workflow](../docs/git-workflow.md).
- [ ] Thay đổi tuân thủ đầy đủ [Definition of Done](../docs/definition-of-done.md).
- [ ] Tôi hiểu rằng AI không được phép tự động push/merge và tôi (con người) chịu trách nhiệm kiểm tra, đẩy nhánh và merge PR này vào `main`.

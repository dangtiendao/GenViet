# Quy trình Tự động Sinh TypeScript Types (Database Type Generation)

- **Mã tài liệu:** `DB-TYPES-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Nguyên tắc Cốt lõi
1. **Nguồn Sự thật duy nhất:** CSDL PostgreSQL (qua Supabase CLI local) là nguồn sự thật để sinh ra file định nghĩa kiểu `src/lib/supabase/database.types.ts`.
2. **Không sửa tay:** File `database.types.ts` hoàn toàn do máy sinh, tuyệt đối không chỉnh sửa thủ công.
3. **Đồng bộ Commit:** Mọi migration có thay đổi schema bảng bắt buộc phải chạy lệnh sinh lại types và commit chung trong cùng một commit Git.
4. **Kiểm tra Stale Types trong CI:** Quy trình CI sẽ chạy script `npm run supabase:types:check` để đảm bảo định nghĩa type luôn đồng bộ và hợp lệ.

---

## 2. Quy trình Thực thi

### Lệnh sinh types từ CSDL Local:
```bash
npm run supabase:types
```
Lệnh này tương đương với:
```bash
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

### Lệnh kiểm tra tính hợp lệ của Generated Types:
```bash
npm run supabase:types:check
```
Lệnh này gọi script `scripts/supabase/verify-generated-types.mjs` để xác minh header và sự hiện diện của export `type Database`.

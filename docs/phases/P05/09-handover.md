# Tài liệu Bàn giao Kỹ thuật: Phase P05 sang Phase P06 (Handover - Cổng G7)

- **Phase Bàn giao:** `P05: Khởi tạo mã nguồn (Source Bootstrap & Project Scaffolding)` - Trạng thái: `IMPLEMENTATION_COMPLETE`
- **Phase Tiếp nhận:** `P06: Thiết lập Supabase & Môi trường Ban đầu`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Frontend Engineer & DevEx Lead (P05)

---

## 1. Tóm tắt Hiện trạng Kỹ thuật Bàn giao cho Phase P06

1. **Môi trường & Package Manager:**
   - Node.js: `v24.19.0` (Khuyến nghị $\ge 20.0.0$ theo `.nvmrc`).
   - Package Manager: `npm@12.0.2` với `package-lock.json` chuẩn hóa.
   - Thư viện Supabase đã cài đặt sẵn: `@supabase/supabase-js@^2.112.4` và `@supabase/ssr@^0.12.5`.
2. **Cấu trúc Module Supabase:**
   - Tệp tin `src/lib/supabase/index.ts` chứa client factory placeholder.
   - Tệp tin `src/lib/env/index.ts` chứa Zod schema đã sẵn sàng nhận diện `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. **Chất lượng Mã nguồn:**
   - TypeScript strict mode, ESLint 9 Flat Config, Prettier formatting và Vitest test runner đã hoạt động hoàn hảo.
   - Route Handler `/api/health` đã được kiểm thử trả về HTTP 200 JSON.

---

## 2. Các Lệnh Kỹ thuật Phase P06 Nên Chạy Đầu Tiên

```bash
# 1. Cài đặt các gói phụ thuộc bằng frozen lockfile
npm ci

# 2. Chạy chuỗi kiểm tra chất lượng tổng thể
npm run check

# 3. Khởi động máy chủ phát triển
npm run dev
```

---

## 3. Những Việc Phase P06 Được Phép & Không Được Phép Làm

### Được phép làm trong Phase P06:
- Khởi tạo Supabase Local Development Stack (`supabase init`, `supabase start`).
- Cấu hình biến môi trường Supabase Local vào `.env.local`.
- Triển khai browser client và server client helper hoàn chỉnh trong `src/lib/supabase/` theo `@supabase/ssr` (ADR-0004).
- Thiết lập kịch bản kết nối CSDL và kiểm tra storage bucket ban đầu.

### KHÔNG ĐƯỢC Giả định Đã Hoàn thành:
- ❌ KHÔNG giả định CSDL đã có bảng dữ liệu (Bảng `trees`, `persons`, `relationships` sẽ được tạo trong Phase P07).
- ❌ KHÔNG giả định RLS đã được cấu hình (RLS policies chi tiết sẽ được viết trong Phase P08).
- ❌ KHÔNG commit file `.env.local` chứa secret vào Git.

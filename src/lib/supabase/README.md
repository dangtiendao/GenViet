# Supabase Client Infrastructure & Trust Boundaries

Module này quản lý các client kết nối Supabase theo kiến trúc App Router và ranh giới bảo mật:

---

## 1. Phân định Ranh giới Client (Trust Boundaries)

| Module | Runtime | RLS Enforced | Dữ liệu nhạy cảm / Secret | Mục đích sử dụng |
| :--- | :--- | :---: | :---: | :--- |
| **`client.ts`** | Browser / RCC | Có (Bắt buộc) | ❌ Tuyệt đối KHÔNG | Client Components tương tác UI trực tiếp |
| **`server.ts`** | Server / RSC / Actions | Có (Bắt buộc) | ❌ Không dùng Service Role | Server Components, Server Actions, Route Handlers |
| **`admin.ts`** | Server Only (`server-only`) | ⚠️ BYPASS | `SUPABASE_SERVICE_ROLE_KEY` | Tác vụ background, cron, migration seeding |

---

## 2. Quy tắc Bắt buộc
1. Không bao giờ import `server.ts` hoặc `admin.ts` vào Client Components (`'use client'`).
2. Không sử dụng `admin.ts` cho các luồng nghiệp vụ thông thường của người dùng cuối.

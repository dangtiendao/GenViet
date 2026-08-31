# Ma Trận Môi Trường & Cấu Hình Redirect URLs Phase P29

## 1. Ma Trận Môi Trường Ứng Dụng & Callback URLs
| Môi Trường | Application Origin | Callback URL Ứng Dụng | Supabase SITE_URL | Supabase Redirect URLs Allowlist |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | `http://localhost:3000` | `http://localhost:3000/auth/callback` | `http://localhost:3000` | `http://localhost:3000/**`, `http://127.0.0.1:3000/**` |
| **Vercel Preview** | `https://*.vercel.app` | `https://*.vercel.app/auth/callback` | `https://genviet.vn` | `https://*.vercel.app/**`, `https://genviet-*.vercel.app/**` |
| **Production** | `https://genviet.vn` | `https://genviet.vn/auth/callback` | `https://genviet.vn` | `https://genviet.vn/**` |

## 2. Cấu Hình Redirect URI Phía Google Cloud Console
Google OAuth Client ID yêu cầu cấu hình **Authorized redirect URIs** trỏ trực tiếp về Supabase Auth server (nơi nhận callback từ Google trước khi chuyển tiếp về ứng dụng):
- **Development / Local Supabase:** `http://127.0.0.1:54321/auth/v1/callback`
- **Staging / Production Supabase:** `https://<supabase-project-ref>.supabase.co/auth/v1/callback`

> [!IMPORTANT]
> Google Cloud Console KHÔNG chấp nhận wildcard trong Authorized Redirect URIs. Redirect URI chỉ trỏ về domain Supabase cố định. Supabase Auth sẽ thực hiện kiểm tra allowlist và chuyển tiếp người dùng về URL ứng dụng tương ứng (`Local`, `Preview`, hoặc `Production`).

## 3. Quản Lý Biến Môi Trường
| Tên Biến | Phạm Vi | Mục Đích |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Browser | URL endpoint kết nối Supabase API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Browser | Khóa anon/public cho client-side RLS |
| `NEXT_PUBLIC_APP_URL` | Public / Browser | Base URL ứng dụng phục vụ origin derivation |
| `GOOGLE_CLIENT_ID` | Supabase Dashboard | ID ứng dụng Google OAuth (Cấu hình trên Supabase) |
| `GOOGLE_CLIENT_SECRET` | Supabase Dashboard | Secret ứng dụng Google OAuth (Cấu hình trên Supabase) |

> [!WARNING]
> `GOOGLE_CLIENT_SECRET` chỉ lưu trong Supabase Dashboard Authentication Settings. Tuyệt đối không đặt biến này vào file `.env` hay biến môi trường của Next.js client/server.

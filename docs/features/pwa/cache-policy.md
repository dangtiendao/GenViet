# Ma Trận Chính Sách Cache (Cache Policy Matrix)

## 1. Ma Trận Chi Tiết

| Phân Loại Yêu Cầu | Mẫu Đường Dẫn (Pattern) | Độ Nhạy Cảm | Phương Thức | Chiến Lược (Strategy) | Tên Cache |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Offline Fallback HTML | `/offline` | Public | GET | Precache | `genviet-shell-v1` |
| PWA Icons & Manifest | `/icons/*`, `/manifest.webmanifest` | Public | GET | Precache | `genviet-shell-v1` |
| Next.js Static Assets | `/_next/static/*` | Public | GET | CacheFirst | `genviet-shell-v1` |
| App Navigation | `/*` (mode: navigate) | Private | GET | NetworkFirst | Fallback to `/offline` |
| Supabase Auth / Session | `/auth/*`, `/auth/v1/*` | Critical | ALL | NetworkOnly | Không cache |
| Tree Graph API | `/api/trees/[treeId]/graph` | Private | GET | NetworkOnly | Không cache |
| Person Search API | `/search`, `/api/search` | Private | GET | NetworkOnly | Không cache |
| Audit History | `*/history` | Private | GET | NetworkOnly | Không cache |
| Avatar Signed URLs | `*token=*`, `*signature=*` | Private | GET | NetworkOnly | Không cache |
| Backup Export / Import | `/api/trees/[treeId]/backup` | Private | ALL | NetworkOnly | Không cache |
| Mutations | POST, PUT, PATCH, DELETE | Private | NON_GET | NetworkOnly | Không cache |

# Bản Định Danh Bản Phát Hành Ứng Viên (Release Candidate Manifest - P26-T02)

- **Tên sản phẩm:** GenViet
- **Phiên bản:** `v0.1.0`
- **Nhãn phát hành ứng viên:** `v0.1.0-rc.1`
- **Nhánh Git:** `phase/p26-mvp-acceptance`
- **Môi trường nghiệm thu:** Node.js 20+, Supabase Local Stack, Chromium / WebKit
- **Ngày nghiệm thu:** 30/08/2026

---

## 1. Thông Tin Siêu Dữ Liệu Kỹ Thuật (Build & Runtime Metadata)

| Thuộc Tính | Giá Trị / Chi Tiết |
| :--- | :--- |
| **Commit Gốc (Base Commit)** | `f6150a4` (Merge PR #25) |
| **Node.js Runtime** | `>= 20.0.0` (Khuyến nghị v24 LTS) |
| **Package Manager** | `npm` v12.0.2 / `package-lock.json` lockfileVersion 3 |
| **Next.js Framework** | `16.3.3` (Turbopack, App Router) |
| **React Framework** | `19.0.0` |
| **PostgreSQL Database** | PostgreSQL 15+ (Supabase Local Stack) |
| **PostgreSQL Migrations** | 100% migrations từ P06 đến P21 |
| **Row Level Security (RLS)** | Bật 100% trên tất cả bảng nghiệp vụ (`family_trees`, `persons`, `relationships`, `unions`, `audit_logs`, `system_heartbeats`) |
| **Storage Security** | Supabase Storage Private Bucket (`avatars`), RLS Policies & Signed URLs (TTL 1h) |
| **Test Automation Tooling** | Vitest 3.2.7 (Unit/Integration) & Playwright 1.50.0 (E2E) |

---

## 2. Kiểm Tra Tính Bất Biến Của Bản Phát Hành (Release Immutability Checklist)
- [x] Không sử dụng mã SHA viết tắt (Luôn tham chiếu Full SHA).
- [x] Không tồn tại thay đổi chưa commit trên working tree khi đóng gói.
- [x] Không chứa bất kỳ API key, Secret Role Key, JWT token hay Signed URL nào.
- [x] Toàn bộ các cổng kiểm soát chất lượng (Format, Lint, Typecheck, Tests, Build) đều đạt 100%.

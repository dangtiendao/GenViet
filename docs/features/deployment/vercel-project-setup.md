# Hướng Dẫn Thiết Lập Dự Án Vercel (Vercel Project Setup - P24-T01)

## 1. Cấu Hình Cơ Bản Dự Án Vercel
- **Framework Preset:** `Next.js`
- **Root Directory:** `./` (Thư mục gốc của repository)
- **Build Command:** `npm run build` (Next.js Turbopack)
- **Output Directory:** `.next`
- **Install Command:** `npm ci` (Frozen lockfile)
- **Node.js Version:** `20.x` hoặc mới nhất theo tiêu chuẩn LTS

## 2. Production Branch & Preview Scope
- **Production Branch:** `master` (hoặc `main` tùy theo cấu hình repository).
- **Preview Deployments:** Tự động kích hoạt khi có Pull Request hoặc push nhánh tính năng (`phase/*`).

# Cấu trúc Mã nguồn Ứng dụng GenViet (Source Code Structure)

- **Mã tài liệu:** `ARCH-SOURCE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `ACCEPTED`
- **Ngày ban hành:** 2026-08-29

---

## 1. Sơ đồ Cây Thư mục Dự án (Directory Layout)

```text
genviet/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI Workflow
├── docs/                      # Toàn bộ tài liệu quản trị, sản phẩm, UX, kiến trúc
├── public/                    # Static public assets (Favicon, Logo, Fonts)
├── src/
│   ├── app/                   # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (auth)/            # Route group cho xác thực
│   │   ├── (dashboard)/       # Route group cho dashboard & cây
│   │   ├── api/
│   │   │   └── health/        # Endpoint health check (/api/health)
│   │   ├── globals.css        # Tailwind CSS root stylesheet
│   │   ├── layout.tsx         # Root HTML layout
│   │   └── page.tsx           # Trang chủ scaffold
│   ├── components/
│   │   ├── ui/                # Nguyên tử shadcn/ui components (Button, Input, Sheet...)
│   │   └── shared/            # Components dùng chung (Header, BottomNav, Dialogs)
│   ├── features/              # Vertical feature modules (Tách theo nghiệp vụ)
│   │   ├── auth/              # Xác thực & phiên làm việc
│   │   ├── family-trees/      # Cây gia phả & Cài đặt
│   │   ├── persons/           # Quản lý thành viên & tiểu sử
│   │   ├── relationships/     # Quan hệ huyết thống & hôn phối
│   │   ├── tree-view/         # Hiển thị Canvas React Flow & ELK Layout
│   │   ├── search/            # Tra cứu thành viên tiếng Việt
│   │   ├── media/             # Quản lý ảnh avatar
│   │   └── backups/           # Xuất dữ liệu sao lưu JSON
│   ├── lib/                   # Infrastructure utilities & client SDKs
│   │   ├── env/               # Zod environment validation
│   │   ├── supabase/          # Supabase client helpers
│   │   └── utils.ts           # Helper cn (clsx + twMerge)
│   ├── server/                # Server-Only Boundary (Không import ra Client)
│   │   ├── repositories/      # Data access layer (SQL query & RLS)
│   │   ├── services/          # Domain services (Use cases & DAG validation)
│   │   ├── actions/           # Server Actions (Form mutations)
│   │   └── adapters/          # Cloud adapters (Storage, Email)
│   ├── types/                 # Truly shared TypeScript interfaces
│   └── workers/               # Browser Web Workers (ELK layout)
├── tests/
│   ├── unit/                  # Vitest unit & schema tests
│   └── e2e/                   # Playwright end-to-end smoke tests
├── .env.example               # Mẫu biến môi trường an toàn
├── .nvmrc                     # Node.js version baseline (Node 24 LTS)
├── components.json            # Cấu hình shadcn/ui
├── eslint.config.mjs          # Cấu hình ESLint 9 Flat Config
├── next.config.mjs            # Cấu hình Next.js App Router
├── package.json               # Package manifest & NPM scripts
├── postcss.config.mjs         # Cấu hình Tailwind CSS PostCSS
├── tsconfig.json              # TypeScript strict configuration
└── vitest.config.ts           # Cấu hình Vitest runner
```

---

## 2. Quy tắc Định hướng Phụ thuộc (Dependency Direction Rules)

1. **`app` $\rightarrow$ `features` / `components` / `server`:** `app` là tầng ngoài cùng, định tuyến và kết nối các tính năng.
2. **`features` $\rightarrow$ `components/shared` / `lib`:** Features có thể sử dụng shared components và utilities.
3. **`components/shared` $\not\rightarrow$ `features`:** Shared components không được import ngược vào feature cụ thể (tránh circular dependency).
4. **`server` (Server-Only) $\not\rightarrow$ Client Components:** Toàn bộ code trong `src/server/` được bảo vệ bởi `import 'server-only'` và chỉ được gọi từ Server Components, Server Actions hoặc Route Handlers.

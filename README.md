# GenViet

> **Ứng dụng web quản lý và trực quan hóa cây gia phả dòng họ Việt Nam hiện đại, an toàn và bảo mật.**

---

## 1. Giới thiệu Dự án

**GenViet** là nền tảng số hóa phả hệ được xây dựng nhằm giúp các gia đình, dòng họ tại Việt Nam lưu trữ, kết nối và hiển thị cây gia phả nhiều thế hệ một cách trực quan, tôn trọng tối đa quyền riêng tư và bản sắc văn hóa phả hệ truyền thống.

### Định hướng Công nghệ:
- **Frontend Framework:** Next.js (App Router), React 19, TypeScript strict mode, Tailwind CSS v4, shadcn/ui.
- **Visualization Engine:** React Flow (`@xyflow/react`) kết hợp ELK.js (`elkjs`) tính toán phân tầng đồ thị tự động.
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage).
- **Testing & Quality Tooling:** ESLint 9 (Flat Config), Prettier, Vitest (Unit Tests), Playwright (E2E Smoke Tests).
- **Hạ tầng & Vận hành:** Vercel ban đầu (không phụ thuộc Vercel Blob/KV/Postgres), sẵn sàng chuyển dịch sang Cloudflare Workers và R2.

---

## 2. Hướng dẫn Thiết lập Môi trường Phát triển Cục bộ (Local Development)

### 2.1. Yêu cầu Hệ thống:
- **Node.js:** Phiên bản `v20.0.0` trở lên (Khuyến nghị **Node.js 24 LTS** theo `.nvmrc`).
- **Package Manager:** **`npm`** (Phiên bản `12.0.2` hoặc $\ge 10.x$).

### 2.2. Các Bước Cài đặt Nhanh:
```bash
# 1. Sao chép biến môi trường mẫu
cp .env.example .env.local

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi động máy chủ phát triển
npm run dev
```

Truy cập ứng dụng tại:
- **Trang chủ ứng dụng:** [http://localhost:3000](http://localhost:3000)
- **Health Check Endpoint:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 2.3. Các Lệnh Kiểm tra Chất lượng (Quality Commands):
```bash
npm run format:check   # Kiểm tra định dạng mã nguồn (Prettier)
npm run lint           # Phân tích tĩnh mã nguồn (ESLint)
npm run typecheck      # Kiểm tra kiểu dữ liệu nghiêm ngặt (TypeScript strict)
npm run test:run       # Chạy toàn bộ Unit test suite (Vitest non-watch)
npm run test:e2e       # Chạy bộ kiểm thử E2E (Playwright)
npm run build          # Đóng gói Next.js Production Build
npm run supabase:check # Kiểm tra tính hợp lệ của migration và types
npm run check          # Chạy toàn bộ chuỗi kiểm tra tổng thể (Quality + Supabase)
```

Chi tiết xem tại: 👉 **[`docs/development/local-setup.md`](./docs/development/local-setup.md)** và **[`docs/database/README.md`](./docs/database/README.md)**.

---

## 3. Trạng thái Dự án Hiện tại

- **Giai đoạn hiện tại:** `Phase P08: RLS và phân quyền (Row Level Security & Authorization)`
- **Trạng thái:** `ACCEPTED` (Đã hoàn tất 17 RLS policies, trigger chống đổi tree_id, least privilege grants, và 11 security test suites).
- **Phân hệ Kế tiếp:** `Phase P09: Thiết kế xác thực (Authentication System)`.
- **Cảnh báo phát triển:** Mã nguồn đang trong giai đoạn xây dựng nền tảng bảo mật CSDL; các chức năng nghiệp vụ phả hệ sẽ được thi công tuần tự từ Phase P09 đến P25.

---

## 4. Bản đồ Tài liệu Dự án

Toàn bộ tài liệu kiến trúc, quản trị và hướng dẫn kỹ thuật được quản lý tập trung trong thư mục [`docs/`](./docs/README.md):

- 📜 **[Hiến chương dự án (Project Charter)](./docs/project-charter.md):** Nắm rõ tầm nhìn, phạm vi MVP, nguyên tắc bảo mật và các quyết định đã khóa.
- 🔀 **[Quy trình Git & Phân nhánh](./docs/git-workflow.md):** Quy tắc tạo branch, commit Conventional Commits và an toàn Git.
- 🔄 **[Vòng đời Phase & Cổng kiểm soát](./docs/phase-lifecycle.md):** Quy chuẩn 8 cổng kiểm soát chất lượng (G0 - G7).
- 🏗️ **[Kiến trúc Hệ thống (System Architecture)](./docs/architecture/README.md):** Sơ đồ C4, ranh giới Server/Client, RLS, 4-tier graph, 16 ADRs.
- 🧱 **[Cấu trúc Mã nguồn (Source Structure)](./docs/architecture/source-structure.md):** Cấu trúc thư mục `src/app`, `features/`, `server/`, `lib/`.
- 🔒 **[Quy tắc Bảo mật & Quản lý Secret](./docs/security/project-security-rules.md):** Nguyên tắc bảo vệ khóa và dữ liệu riêng tư.
- 🤖 **[Thỏa thuận Làm việc với AI](./docs/ai-working-agreement.md):** Quy tắc và giới hạn an toàn khi AI tham gia phát triển.
- 📋 **[Sổ đăng ký Quyết định (Decision Log)](./docs/decisions/decision-log.md)** & **[Sổ Quản lý Rủi ro](./docs/risks/risk-register.md)**.
- 📂 **[Quản lý Hồ sơ các Phase](./docs/phases/README.md):** Chi tiết lộ trình từ P00 đến P25.

---

## 5. Hướng dẫn Đóng góp (Contributing)

Mọi đóng góp cho dự án (từ cả kỹ sư con người lẫn AI Agents) đều phải tuân thủ nghiêm ngặt các quy định tại:
👉 **[HƯỚNG DẪN ĐÓNG GÓP (CONTRIBUTING.md)](./CONTRIBUTING.md)**

### Tóm tắt Quy tắc An toàn Git:
1. Mọi công việc phải diễn ra trên nhánh riêng: `phase/pXX-...` hoặc `feature/...`.
2. Commit message chuẩn Conventional Commits có scope phase: `<type>(PXX): <mô tả>`.
3. Tuyệt đối không commit file `.env.local`, API key, token hoặc dữ liệu cá nhân thật.
4. **AI Agents tuyệt đối KHÔNG push lên remote, KHÔNG merge và KHÔNG tạo Pull Request từ xa.**

---

## 6. Bản quyền & Giấy phép (License)

Quyết định về Giấy phép mã nguồn mở / Bản quyền chính thức đang được xem xét tại hạng mục mở `OPEN-DEC-01` và sẽ được công bố trước khi phát hành phiên bản MVP chính thức.

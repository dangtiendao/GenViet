# GenViet

> **Ứng dụng web quản lý và trực quan hóa cây gia phả dòng họ Việt Nam hiện đại, an toàn và bảo mật.**

---

## 1. Giới thiệu Dự án

**GenViet** là nền tảng số hóa phả hệ được xây dựng nhằm giúp các gia đình, dòng họ tại Việt Nam lưu trữ, kết nối và hiển thị cây gia phả nhiều thế hệ một cách trực quan, tôn trọng tối đa quyền riêng tư và bản sắc văn hóa phả hệ truyền thống.

### Điểm Nổi Bật Công Nghệ:
- **Frontend Framework:** Next.js 16 (App Router), React 19, TypeScript strict mode, Tailwind CSS v4, shadcn/ui.
- **Visualization Engine:** React Flow (`@xyflow/react`) kết hợp ELK.js (`elkjs`) tính toán phân tầng đồ thị ngầm trên Web Worker.
- **Backend & Database:** Supabase (PostgreSQL 15+, 100% Row Level Security, Supabase Auth, Private Storage Bucket).
- **Testing & Quality Tooling:** ESLint 9 (Flat Config), Prettier, Vitest (92 suites, 357 unit/integration tests), Playwright (75 E2E tests).
- **Hạ tầng & Vận hành:** Tương thích triển khai Vercel Production, hệ thống Structured Logging gắn Request ID, Heartbeat giữ ấm và bộ 6 sổ tay xử lý sự cố.

---

## 2. Hướng dẫn Thiết lập Môi trường Phát triển Cục bộ (Local Development)

### 2.1. Yêu cầu Hệ thống:
- **Node.js:** Phiên bản `v20.0.0` trở lên (Khuyến nghị **Node.js 24 LTS** theo `.nvmrc`).
- **Package Manager:** **`npm`** (Phiên bản `12.0.2` hoặc $\ge 10.x$).

### 2.2. Các Bước Cài đặt Nhanh:
```bash
# 1. Sao chép biến môi trường mẫu
cp .env.example .env.local

# 2. Cài đặt các gói phụ thuộc (Frozen lockfile)
npm ci

# 3. Khởi động máy chủ phát triển
npm run dev
```

Truy cập ứng dụng tại:
- **Trang chủ ứng dụng:** [http://localhost:3000](http://localhost:3000)
- **Health Check Endpoint:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 2.3. Các Lệnh Kiểm tra Chất lượng (Quality Commands):
```bash
npm run format:check   # Kiểm tra định dạng mã nguồn (Prettier)
npm run lint           # Phân tích tĩnh mã nguồn (ESLint 9)
npm run typecheck      # Kiểm tra kiểu dữ liệu nghiêm ngặt (TypeScript strict)
npm run test:run       # Chạy toàn bộ Unit test suite (Vitest non-watch)
npm run test:e2e       # Chạy bộ kiểm thử E2E (Playwright)
npm run build          # Đóng gói Next.js Production Build
```

### 2.4. Các Lệnh Vận Hành & Sao Lưu (Operations Commands):
```bash
node scripts/operations/create-database-backup.mjs    # Tạo bản sao lưu PostgreSQL kèm Manifest SHA-256
node scripts/operations/verify-backup.mjs             # Kiểm tra tính toàn vẹn bản sao lưu
node scripts/operations/restore-backup-isolated.mjs   # Phục hồi thử nghiệm vào database cô lập
node scripts/operations/inspect-heartbeat.mjs         # Kiểm tra trạng thái System Heartbeat
```

---

## 3. Trạng thái Dự án Hiện tại

- **Giai đoạn hiện tại:** `Phase P26: Nghiệm thu MVP (Release Acceptance & Handover)`
- **Phiên bản:** `v0.1.0`
- **Trạng thái:** `ACCEPTED` (Hoàn thành 100% các phân hệ từ P00 đến P26, 0 lỗi P0/P1, 100% release gates đạt chuẩn).

---

## 4. Bản đồ Tài liệu Dự án

- 📖 **[Hướng Dẫn Sử Dụng Chi Tiết (User Guide)](./docs/user-guide/getting-started.md)**
- 📜 **[Ghi Chú Phát Hành v0.1.0 (Release Notes)](./docs/release/v0.1.0/release-notes.md)**
- 🔒 **[Danh Sách Hạn Chế Đã Biết (Known Limitations)](./docs/release/v0.1.0/known-limitations.md)**
- 🛠️ **[Sổ Tay Vận Hành & Ứng Cứu Sự Cố (Runbooks)](./docs/features/operations/runbooks/database-failure.md)**
- 📂 **[Hồ Sơ Các Phase Phát Triển (Phase Dossiers)](./docs/phases/README.md)**
- 📋 **[Sổ Đăng Ký Quyết Định Kiến Trúc (ADRs)](./docs/decisions/decision-log.md)**

---

## 5. Hướng dẫn Đóng góp (Contributing) & Bản quyền

Mọi đóng góp cho dự án đều phải tuân thủ nghiêm ngặt các quy định tại:
👉 **[HƯỚNG DẪN ĐÓNG GÓP (CONTRIBUTING.md)](./CONTRIBUTING.md)**

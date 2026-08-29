# GenViet

> **Ứng dụng web quản lý và trực quan hóa cây gia phả dòng họ Việt Nam hiện đại, an toàn và bảo mật.**

---

## 1. Giới thiệu Dự án

**GenViet** là nền tảng số hóa phả hệ được xây dựng nhằm giúp các gia đình, dòng họ tại Việt Nam lưu trữ, kết nối và hiển thị cây gia phả nhiều thế hệ một cách trực quan, tôn trọng tối đa quyền riêng tư và bản sắc văn hóa phả hệ truyền thống.

### Định hướng Công nghệ:
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Dựng hình Cây gia phả (Visualization Engine):** React Flow kết hợp ELK.js (Eclipse Layout Kernel) tính toán phân tầng đồ thị tự động.
- **Backend & Cơ sở Dữ liệu:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage).
- **Hạ tầng & Vận hành:** Vercel (môi trường MVP cá nhân) kết hợp Cloudflare DNS, thiết kế trung lập sẵn sàng chuyển đổi hosting khi mở rộng.

---

## 2. Trạng thái Dự án Hiện tại

- **Giai đoạn hiện tại:** `Phase P00: Quản trị dự án (Project Governance)`
- **Trạng thái:** `ACCEPTED` (Đã hoàn tất thiết lập khung quản trị, chuẩn bị bàn giao sang Phase P01).
- **Cảnh báo phát triển:** Mã nguồn ứng dụng đang trong quá trình thiết lập nền tảng và **chưa sẵn sàng cho môi trường Production**.

---

## 3. Bản đồ Tài liệu Dự án

Toàn bộ tài liệu kiến trúc, quản trị và hướng dẫn kỹ thuật được quản lý tập trung trong thư mục [`docs/`](./docs/README.md):

- 📜 **[Hiến chương dự án (Project Charter)](./docs/project-charter.md):** Nắm rõ tầm nhìn, phạm vi MVP, nguyên tắc bảo mật và các quyết định đã khóa.
- 🔀 **[Quy trình Git & Phân nhánh](./docs/git-workflow.md):** Quy tắc tạo branch, commit Conventional Commits và an toàn Git.
- 🔄 **[Vòng đời Phase & Cổng kiểm soát](./docs/phase-lifecycle.md):** Quy chuẩn 8 cổng kiểm soát chất lượng (G0 - G7).
- ✅ **[Definition of Ready (DoR)](./docs/definition-of-ready.md)** & **[Definition of Done (DoD)](./docs/definition-of-done.md):** Tiêu chuẩn bắt đầu và nghiệm thu task/phase.
- 🔒 **[Quy tắc Bảo mật & Quản lý Secret](./docs/security/project-security-rules.md):** Nguyên tắc bảo vệ khóa và dữ liệu riêng tư.
- 🤖 **[Thỏa thuận Làm việc với AI](./docs/ai-working-agreement.md):** Quy tắc và giới hạn an toàn khi AI tham gia phát triển.
- 📋 **[Sổ đăng ký Quyết định (Decision Log)](./docs/decisions/decision-log.md)** & **[Sổ Quản lý Rủi ro](./docs/risks/risk-register.md)**.
- 📂 **[Quản lý Hồ sơ các Phase](./docs/phases/README.md):** Chi tiết lộ trình từ P00 đến P08.

---

## 4. Hướng dẫn Đóng góp (Contributing)

Mọi đóng góp cho dự án (từ cả kỹ sư con người lẫn AI Agents) đều phải tuân thủ nghiêm ngặt các quy định tại:
👉 **[HƯỚNG DẪN ĐÓNG GÓP (CONTRIBUTING.md)](./CONTRIBUTING.md)**

### Tóm tắt Quy tắc An toàn Git:
1. Mọi công việc phải diễn ra trên nhánh riêng: `phase/pXX-...` hoặc `feature/...`.
2. Commit message chuẩn Conventional Commits có scope phase: `<type>(PXX): <mô tả>`.
3. Tuyệt đối không commit file `.env`, API key, token hoặc dữ liệu cá nhân thật.
4. **AI Agents tuyệt đối KHÔNG push lên remote, KHÔNG merge và KHÔNG tạo Pull Request từ xa.**

---

## 5. Bản quyền & Giấy phép (License)

Quyết định về Giấy phép mã nguồn mở / Bản quyền chính thức đang được xem xét tại hạng mục mở `OPEN-DEC-01` và sẽ được công bố trước khi phát hành phiên bản MVP chính thức.

# Nhật ký Quyết định Kỹ thuật: Phase P05 (Phase Decisions)

Tài liệu này ghi nhận các quyết định kỹ thuật phát sinh trong quá trình khởi tạo mã nguồn và thiết lập môi trường phát triển cho Phase P05.

---

## 1. Danh sách Quyết định Kỹ thuật Phase P05

| Mã Quyết định | Tiêu đề Quyết định | Trạng thái | Tóm tắt Nội dung |
| :--- | :--- | :---: | :--- |
| **`P05-DEC-001`** | **Lựa chọn Package Manager `npm` làm Tiêu chuẩn:** | `ACCEPTED` | Sử dụng `npm` v12 native đi kèm Node.js 24 LTS, tạo 1 lockfile `package-lock.json` duy nhất; không sử dụng Corepack pnpm để tránh lỗi phân quyền `EPERM` trên Windows. |
| **`P05-DEC-002`** | **Cấu hình TypeScript Strict Mode:** | `ACCEPTED` | Bật `"strict": true`, `"noEmit": true` trong `tsconfig.json`; thiết lập script `npm run typecheck` độc lập. |
| **`P05-DEC-003`** | **Sử dụng ESLint 9 Flat Config (`eslint.config.mjs`):** | `ACCEPTED` | Sử dụng cấu hình Flat Config mở rộng `next/core-web-vitals` và `next/typescript` tương thích hoàn hảo với Next.js 16. |
| **`P05-DEC-004`** | **Tạm hoãn Cài đặt TanStack Query (`DEFERRED`):** | `ACCEPTED` | Tuân thủ quyết định kiến trúc P04: Giai đoạn v0.1 ưu tiên Server-First SSR và React Flow client state; chưa cài TanStack Query để tránh phình to bundle không cần thiết. |
| **`P05-DEC-005`** | **Thiết lập Zod Schema Validation Biến Môi trường An toàn:** | `ACCEPTED` | Phân tách `publicEnvSchema` (trình duyệt) và `serverEnvSchema` (máy chủ); hỗ trợ trường hợp local scaffold chưa điền key Supabase mà không gây crash ứng dụng. |
| **`P05-DEC-006`** | **Tách Biệt Rạch ròi Endpoint Health Check `/api/health`:** | `ACCEPTED` | Endpoint `/api/health` phục vụ kiểm tra trạng thái hoạt động của tiến trình web; không nhầm lẫn với tác vụ Heartbeat CSDL trong Phase P21. |

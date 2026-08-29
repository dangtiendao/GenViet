# Chính sách Độc lập Nền tảng & Chống Khóa Dịch vụ Vercel (Platform Portability Policy)

- **Mã tài liệu:** `ARCH-PORTABILITY-01`
- **Mã Kiến trúc liên quan:** `AR-010`, `ADR-0014`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên ngôn Không Khóa vào Dịch vụ Dữ liệu Độc quyền của Vercel

> **Vercel** chỉ được sử dụng làm **Nền tảng Triển khai Hosting Ban Đầu** cho ứng dụng Next.js.
> Hệ thống GenViet **nghiêm cấm tuyệt đối** việc sử dụng các dịch vụ lưu trữ dữ liệu độc quyền của Vercel (bao gồm `Vercel Blob`, `Vercel KV`, `Vercel Postgres`, `Vercel Edge Config`) trong toàn bộ mã nguồn nghiệp vụ.

---

## 2. Bảng Phân loại Sự Phụ thuộc Công nghệ (Dependency Classification)

| Phân loại Phụ thuộc | Danh sách Công nghệ | Lý do Kiến trúc | Chiến lược Thay thế khi Chuyển dịch |
| :--- | :--- | :--- | :--- |
| **Phụ thuộc Chiến lược Được Chấp nhận (Acceptable)** | • **Next.js App Router**<br>• **Supabase (Postgres & Auth)** | Cung cấp đầy đủ SSR, RLS, Identity cần thiết cho MVP. | Next.js hỗ trợ OpenNext trên Cloudflare; Supabase tiếp tục hoạt động độc lập. |
| **Phụ thuộc Hạ tầng Có thể Thay thế (Replaceable)** | • **Vercel Serverless Compute**<br>• **Supabase Storage** | Môi trường host web ban đầu và nơi lưu ảnh MVP. | Chuyển sang **Cloudflare Workers** và **Cloudflare R2** thông qua Adapter. |
| **Dịch vụ Độc quyền BỊ CẤM (Avoided / Prohibited)** | • **Vercel Blob**<br>• **Vercel KV**<br>• **Vercel Postgres** | Gây khóa chặt mã nguồn vào hệ sinh thái Vercel, chi phí mở rộng cao. | Dùng Supabase Storage cho file, PostgreSQL cho dữ liệu, cấm import `@vercel/*`. |

---

## 3. Các Quy tắc Kiểm tra Tuân thủ Kiến trúc (Compliance Rules)

1. **Cấm Import Vercel SDK trong Domain/Service Layer:** Lõi nghiệp vụ (`src/services/`, `src/domain/`, `src/repositories/`) tuyệt đối không chứa bất kỳ dòng lệnh nào `import ... from '@vercel/...'`.
2. **Không Hard-code Tên miền Vercel:** URL hệ thống luôn được đọc từ biến môi trường chuẩn `NEXT_PUBLIC_APP_URL` (ví dụ: `https://genviet.app`), không gán cứng tên miền `*.vercel.app` vào logic nghiệp vụ hoặc callback link.
3. **Sử dụng GitHub Actions cho Tác vụ Giám sát:** Thay vì dùng Vercel Cron Jobs có phí và độc quyền, hệ thống sử dụng GitHub Actions workflow miễn phí để gửi request kiểm tra định kỳ (Heartbeat).

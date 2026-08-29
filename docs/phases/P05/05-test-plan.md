# Kế hoạch Kiểm thử & Xác minh Nền tảng: Phase P05 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng và kết quả thực thi kiểm thử cho Phase P05.

---

## 1. Kịch bản Kiểm thử Khởi tạo Nền tảng (Test Matrix)

### Nhóm 1: Kiểm thử Cài đặt & Package Manager (Installation & Lockfile)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **PKG-01** | Khởi tạo thành công `package-lock.json` duy nhất | 1 file `package-lock.json`, 0 lockfile thứ hai | `npm install` | `PASS` |
| **PKG-02** | Cài đặt bằng frozen lockfile | Cài đặt không thay đổi lockfile | `npm ci` | `PASS` |
| **PKG-03** | Khai báo `packageManager` và `engines` | Khai báo `npm@12.0.2` và `node >= 20.0.0` | Đối soát `package.json` | `PASS` |

### Nhóm 2: Kiểm thử Chất lượng Tĩnh (Static Quality Gates)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **STA-01** | Kiểm tra định dạng mã nguồn (Format Check) | 0 lỗi định dạng Prettier | `npm run format:check` | `PASS` |
| **STA-02** | Phân tích tĩnh mã nguồn (ESLint) | 0 lỗi lint (ESLint 9) | `npm run lint` | `PASS` |
| **STA-03** | Kiểm tra kiểu dữ liệu nghiêm ngặt (Typecheck) | 0 lỗi TypeScript strict mode | `npm run typecheck` | `PASS` |
| **STA-04** | Kiểm tra khoảng trắng và ký tự lạ Git | `git diff --check` sạch sẽ | `git diff --check` | `PASS` |

### Nhóm 3: Kiểm thử Đơn vị & Biến Môi trường (Unit Testing with Vitest)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **UNT-01** | Unit test Zod environment schema validation | Bắt lỗi invalid URL, parse đúng public & server | `npm run test:run` | `PASS` |
| **UNT-02** | Unit test hàm tiện ích `cn` (Tailwind Merge) | Hợp nhất class đúng, giải quyết xung đột CSS | `npm run test:run` | `PASS` |
| **UNT-03** | Unit test Route Handler `/api/health` | Trả về HTTP 200, status "ok", service "genviet" | `npm run test:run` | `PASS` |

### Nhóm 4: Kiểm thử Đóng gói Ứng dụng & Runtime (Build & Runtime Smoke)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **BLD-01** | Next.js Production Build | Tạo thành công bundle `.next/standalone` | `npm run build` | `PASS` |
| **BLD-02** | Khởi động máy chủ phát triển & trang chủ | HTTP 200, hiển thị "GenViet", smoke button hiển thị | Khởi động máy chủ | `PASS` |
| **BLD-03** | Endpoint Health Check `/api/health` | HTTP 200, JSON hợp lệ, không lộ secret | `curl http://localhost:3000/api/health` | `PASS` |

### Nhóm 5: Kiểm thử An ninh Dependency (Security Patch Audit)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Lệnh thực thi | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **SEC-01** | Quét lỗ hổng dependency tự động | 0 Critical, 0 High vulnerabilities | `npm audit` | `PASS` |
| **SEC-02** | Rà soát advisory Next.js 16 Active LTS | Bản vá `16.3.3` (2026-08-25) | Đối chiếu CVE Advisory | `PASS` |
| **SEC-03** | Rà soát `.env.example` và `.gitignore` | `.env.local` được ignore, `.env.example` an toàn | Kiểm tra git tracking | `PASS` |

---

## 2. Kết luận Kiểm thử
Toàn bộ các bài kiểm thử nền tảng đều đạt chuẩn **`PASS`**, đủ điều kiện nghiệm thu Phase P05.

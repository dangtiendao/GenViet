# Hướng dẫn Thiết lập & Chạy Dự án trên Môi trường Local (Local Development Setup)

Tài liệu này cung cấp hướng dẫn từng bước để cài đặt, thiết lập biến môi trường, chạy máy chủ phát triển và thực thi toàn bộ bộ kiểm thử chất lượng cho **GenViet**.

---

## 1. Yêu cầu Hệ thống (Prerequisites)

- **Node.js:** Phiên bản `v20.0.0` trở lên (Khuyến nghị **Node.js 24 LTS** theo `.nvmrc`).
- **Package Manager:** **`npm`** (Phiên bản $\ge 10.x$, mặc định đi kèm Node.js).
- **Hệ điều hành:** Windows 10/11, macOS hoặc Linux.

---

## 2. Các Bước Cài đặt Ban đầu (Step-by-Step Setup)

### Bước 1: Sao chép Mã nguồn (Clone Repository)
```bash
git clone https://github.com/dangtiendao/GenViet.git
cd GenViet
```

### Bước 2: Thiết lập Biến Môi trường (Environment Setup)
Sao chép tệp mẫu `.env.example` thành `.env.local`:
```bash
cp .env.example .env.local
```
*(Lưu ý: Không cần điền Supabase credentials thật để chạy trang scaffold trong Phase P05).*

### Bước 3: Cài đặt Gói Phụ thuộc (Install Dependencies)
```bash
npm install
```
Hoặc khi chạy trên môi trường CI / máy build:
```bash
npm ci
```

---

## 3. Khởi động Máy chủ Phát triển (Development Server)

Chạy lệnh:
```bash
npm run dev
```
Mở trình duyệt truy cập:
- **Trang chủ ứng dụng:** [http://localhost:3000](http://localhost:3000)
- **Health Check Endpoint:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 4. Các Lệnh Kiểm tra Chất lượng (Quality & Test Commands)

| Lệnh thực thi | Mục đích kiểm tra | Yêu cầu đạt |
| :--- | :--- | :--- |
| `npm run format:check` | Kiểm tra định dạng mã nguồn bằng Prettier | 0 lỗi định dạng |
| `npm run format` | Tự động format toàn bộ mã nguồn | Đã format |
| `npm run lint` | Phân tích tĩnh mã nguồn bằng ESLint 9 | 0 lỗi lint |
| `npm run typecheck` | Kiểm tra kiểu dữ liệu nghiêm ngặt (TypeScript strict) | 0 lỗi type |
| `npm run test:run` | Chạy toàn bộ Unit test suite bằng Vitest (Non-watch) | 100% tests PASS |
| `npm run test:e2e` | Chạy bộ kiểm thử Playwright End-to-End | 100% tests PASS |
| `npm run build` | Đóng gói Next.js Production Build | Build thành công |
| `npm run check` | Chạy chuỗi kiểm tra tổng thể (Format + Lint + Type + Test) | Toàn bộ PASS |

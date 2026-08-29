# Đánh giá An ninh Phụ thuộc & Bản vá Bảo mật Framework (Dependency Security Baseline)

- **Mã tài liệu:** `SEC-DEPS-01`
- **Phiên bản:** `v0.1-baseline`
- **Ngày đánh giá:** 2026-08-29
- **Công cụ thực hiện:** `npm audit`, Official Next.js Security Advisories, React Security Advisories
- **Người thực hiện:** DevEx & Security Engineer (P05)

---

## 1. Kết quả Rà soát Bản vá Bảo mật Framework (Framework Patch Audit)

| Thành phần Framework | Phiên bản Triển khai | Bản vá Bảo mật Tham chiếu | Trạng thái Đánh giá |
| :--- | :---: | :---: | :---: |
| **Next.js** | `16.3.3` | Next.js Active LTS Security Release (2026-08-25) | `PASS - PATCHED` |
| **React / React DOM** | `19.2.8` | React 19 Stable Release | `PASS - COMPATIBLE` |
| **TypeScript** | `5.9.0` | TypeScript Stable | `PASS` |
| **Tailwind CSS** | `4.3.3` | Tailwind CSS v4 Engine | `PASS` |
| **Zod** | `3.24.2` | Zod Stable Validation Engine | `PASS` |
| **Supabase Client SDK**| `@supabase/supabase-js@2.112.4`, `@supabase/ssr@0.12.5` | Supabase Official SDK | `PASS - SECURE` |
| **React Flow Canvas** | `@xyflow/react@12.11.5` | Official xyflow Release | `PASS` |
| **ELK.js Layout** | `elkjs@0.12.0` | Eclipse Layout Kernel | `PASS` |

---

## 2. Kết quả Quét Lỗ hổng Tự động (Automated Vulnerability Scan)

- **Lệnh thực thi:** `npm audit --production` & `npm audit`
- **Lỗ hổng Mức độ Critical:** `0`
- **Lỗ hổng Mức độ High (Production Reachable):** `0`
- **Lỗ hổng Mức độ Moderate/Low:** `0`
- **Chính sách can thiệp:** Tuyệt đối không sử dụng `npm audit fix --force` gây thay đổi major phiên bản ngoài tầm kiểm soát.
- **Rủi ro Dư thừa (Residual Risk):** Các lỗ hổng mới phát sinh trong tương lai sẽ được rà soát định kỳ qua GitHub Dependabot và quy trình kiểm toán trước mỗi đợt phát hành Release (Phase P24).

---

## 3. Tuyên bố Bảo mật
Dự án GenViet áp dụng nguyên tắc phòng thủ chiều sâu và kiểm soát chặt chẽ danh mục thư viện. Hệ thống không tuyên bố "an toàn tuyệt đối" mà duy trì quy trình vá lỗi liên tục theo vòng đời sản phẩm.

# Bug Report: [Mã Bug] - [Tóm tắt Lỗi]

- **Mã Bug:** `[PXX-BUG-NNN]` *(Ví dụ: P00-BUG-001)*
- **Phase phát hiện:** `[PXX]`
- **Trạng thái:** `[OPEN | IN_PROGRESS | RESOLVED | DEFERRED | CANCELLED]`
- **Mức độ nghiêm trọng (Severity):** `[BLOCKER | CRITICAL | MAJOR | MINOR]`
- **Mức độ ưu tiên (Priority):** `[P0 | P1 | P2 | P3]`
- **Người báo cáo:** [Tên người báo cáo / AI Reviewer]
- **Người được gán xử lý:** [Tên kỹ sư / AI Agent]
- **Môi trường (Environment):** Local Node.js / Chrome / PostgreSQL Supabase Local

---

## 1. Điều kiện tiên quyết (Preconditions)
*Mô tả trạng thái ban đầu của hệ thống trước khi thực hiện các bước gây lỗi.*
- Đã đăng nhập với tài khoản X.
- Đã tạo cây gia phả Y có 5 thành viên.

---

## 2. Các bước tái hiện (Steps to Reproduce)
1. Bước 1: Điều hướng tới màn hình `...`
2. Bước 2: Nhấn vào nút `...`
3. Bước 3: Nhập giá trị `...` vào ô input và bấm Submit.

---

## 3. Kết quả thực tế vs Kết quả mong đợi (Actual vs Expected)
- **Kết quả thực tế (Actual Result):** [Giao diện bị đơ, console ném lỗi TypeError...]
- **Kết quả mong đợi (Expected Result):** [Dữ liệu thành viên mới được cập nhật và hiển thị trên đồ thị.]

---

## 4. Tác động & Bằng chứng (Impact & Evidence)
- **Mức độ ảnh hưởng:** [Người dùng không thể thêm con vào cây gia phả.]
- **Log / Screenshot:**
```text
[Dán đoạn log lỗi hoặc ảnh chụp màn hình tại đây - Cam kết KHÔNG chứa secret hay dữ liệu thật]
```

---

## 5. Phân tích Nguyên nhân Gốc rễ (Root Cause Hypothesis)
*Dự đoán nguyên nhân kỹ thuật gây ra lỗi (ví dụ: Thiếu null-check khi node cha chưa có ngày sinh).*

---

## 6. Đề xuất Hướng khắc phục (Proposed Fix)
- Sửa hàm `validateRelationship()` trong file `path/to/file.ts`.
- Thêm kiểm tra điều kiện biên trước khi gọi API.

---

## 7. Kế hoạch Kiểm thử Hồi quy (Regression Test Plan)
- Chạy lại test suite: `pnpm test path/to/component.test.ts`.
- Xác minh không làm gãy các luồng tạo quan hệ khác.

# Ma trận Kiểm thử Giao diện Đáp ứng (Responsive Test Matrix) - Phase P10

- **Mã tài liệu:** `DS-RESP-01`
- **Phiên bản:** `v0.1-baseline`

---

## Bảng Ma trận Kiểm thử Kích thước Màn hình

| Kích thước Viewport | Thiết bị Đại diện | Thành phần Kiểm tra | Kết quả Kiểm thử E2E |
| :--- | :--- | :--- | :---: |
| **`320 x 568`** | iPhone SE (1st gen) / Thiết bị siêu nhỏ | Không tràn ngang, nút bấm vừa vặn, text tự xuống dòng | `PASS` (Playwright E2E) |
| **`360 x 640`** | Android chuẩn phổ thông | Mobile Bottom Nav hiển thị 4 tabs rõ ràng | `PASS` (Playwright E2E) |
| **`375 x 667`** | iPhone 8 / SE (2nd/3rd gen) | Bảng Bottom Sheet mở trượt mượt mà, không giật | `PASS` (Playwright E2E) |
| **`390 x 844`** | iPhone 12/13/14 | Vùng đệm an toàn (`safe-area-bottom`) không đè phím | `PASS` (Playwright E2E) |
| **`768 x 1024`** | iPad / Tablet dọc | Header compact, form trải rộng 2 cột | `PASS` (Playwright E2E) |
| **`1024 x 768`** | Desktop nhỏ / Tablet ngang | Chuyển đổi từ Mobile Nav sang Desktop Sidebar | `PASS` (Playwright E2E) |
| **`1280 x 800`** | Laptop / Desktop chuẩn | Sidebar `256px`, Header có Breadcrumb đầy đủ | `PASS` (Playwright E2E) |
| **`1920 x 1080`** | Màn hình Full HD | Khung nội dung giới hạn `max-w-7xl` căn giữa chuẩn | `PASS` (Playwright E2E) |

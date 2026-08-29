# Quản lý Khung Prompt Chuẩn cho AI (Prompt Engineering Templates)

Thư mục này chứa các mẫu prompt được chuẩn hóa theo từng giai đoạn trong vòng đời phase của dự án **GenViet**, giúp người điều phối dự án giao việc, kiểm thử và nghiệm thu bằng AI một cách nhất quán, chính xác và an toàn.

---

## 1. Danh sách Khung Prompt Chuẩn

| File Template | Mục đích sử dụng | Cổng tương ứng |
| :--- | :--- | :---: |
| **[phase-input-template.md](./phase-input-template.md)** | Khởi tạo phase, đánh giá đầu vào và kiểm tra DoR. | **G0** |
| **[phase-implementation-template.md](./phase-implementation-template.md)** | Giao việc thi công mã nguồn/tài liệu cho AI theo kế hoạch đã duyệt. | **G1 - G3** |
| **[phase-review-template.md](./phase-review-template.md)** | Kích hoạt phiên review độc lập hoặc self-review đánh giá chất lượng. | **G4 - G5** |
| **[phase-re-review-template.md](./phase-re-review-template.md)** | Đánh giá lại sau khi đã khắc phục các lỗi phát hiện trong review. | **G5** |
| **[phase-summary-template.md](./phase-summary-template.md)** | Yêu cầu AI tổng hợp báo cáo nghiệm thu và cập nhật changelog. | **G6** |
| **[phase-handover-template.md](./phase-handover-template.md)** | Đóng gói tài liệu bàn giao làm đầu vào cho phase tiếp theo. | **G7** |

---

## 2. Nguyên tắc sử dụng Prompt

1. **Sao chép và điền thông tin cụ thể:** Điền các biến trong dấu ngoặc vuông `[PXX]`, `[Tên phase]` bằng thông tin thực tế của phase trước khi gửi cho AI.
2. **Không đưa Secret vào Prompt:** Tuyệt đối không dán API key, mật khẩu, JWT token hay thông tin người thật vào prompt.
3. **Yêu cầu AI xác nhận ràng buộc an toàn Git:** Luôn nhắc nhở AI về lệnh cấm `git push`, `git merge` và tạo PR tự động.

# Tầm nhìn & Mục tiêu Sản phẩm GenViet (Product Vision & Goals)

- **Mã tài liệu:** `PROD-VISION-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29
- **Phạm vi áp dụng:** MVP v0.1

---

## 1. Tuyên bố Tầm nhìn Sản phẩm (Product Vision Statement)

> **"GenViet là ứng dụng web quản lý và trực quan hóa cây gia phả cá nhân hiện đại, giúp các gia đình Việt Nam dễ dàng số hóa, tra cứu và kết nối các thế hệ dòng họ một cách trực quan, tôn trọng quyền riêng tư tuyệt đối và hoạt động mượt mà trên mọi thiết bị."**

---

## 2. Mục tiêu Cốt lõi của Phiên bản MVP v0.1 (Product Objectives)

Trong giai đoạn đầu (v0.1 - Single-owner MVP), GenViet tập trung phục vụ nhu cầu quản trị gia phả cá nhân với 7 mục tiêu định lượng:

| Mã Mục tiêu | Tên mục tiêu | Kết quả người dùng đạt được | Chỉ dấu xác nhận (Success Signal) |
| :--- | :--- | :--- | :--- |
| **OBJ-001** | Quản trị Gia phả Riêng tư | Một cá nhân có thể tạo tài khoản và quản trị cây gia phả hoàn toàn riêng tư. | 100% dữ liệu được bảo vệ bằng RLS, không truy cập chéo giữa các cây. |
| **OBJ-002** | Nhập liệu Dần dần theo Thời gian | Người dùng có thể bổ sung từng thành viên và thiết lập quan hệ gia phả bất cứ lúc nào khi có thêm thông tin. | Tạo và cập nhật được các mối quan hệ Cha-Mẹ-Con, Vợ-Chồng mà không làm gãy cây. |
| **OBJ-003** | Mở rộng Tổ tiên Linh hoạt | Cho phép mở rộng tổ tiên (thêm cha/mẹ) phía trên bất kỳ nhân vật nào mà không ép buộc người đầu tiên phải là Thủy tổ. | Có thể thêm cha/mẹ cho node gốc bất kỳ lúc nào; đồ thị tự động tái phân tầng. |
| **OBJ-004** | Trải nghiệm Đa thiết bị (Responsive) | Xem và tương tác với cây gia phả mượt mà trên cả máy tính để bàn (Desktop) và điện thoại thông minh (Mobile). | Giao diện tự co giãn, hỗ trợ thao tác chạm (touch pan/zoom) và viewport từ 360px trở lên. |
| **OBJ-005** | Tra cứu & Xem Hồ sơ Nhanh chóng | Tìm kiếm thành viên theo tên (có dấu và không dấu) và định vị trực tiếp vị trí của họ trên cây gia phả. | Kết quả tìm kiếm hiển thị tức thì (< 300ms) và cho phép nhảy đến node trung tâm. |
| **OBJ-006** | Bảo toàn & Xuất Dữ liệu (Backup) | Người dùng có toàn quyền xuất bản sao lưu dữ liệu gia phả dạng file cấu trúc chuẩn để lưu trữ an toàn. | Xuất thành công file JSON chứa toàn bộ danh sách nhân vật và mối quan hệ. |
| **OBJ-007** | Kiểm soát Phạm vi Khả thi | Giữ phạm vi tính năng vừa đủ nhỏ gọn để có thể hoàn thiện v0.1 chất lượng cao trong khuôn khổ dự án cá nhân. | 100% tính năng Must được kiểm thử đầy đủ; không phát sinh nợ kỹ thuật nghiêm trọng. |

---

## 3. Nguyên tắc Phát triển MVP (Guiding Principles)

1. **Bảo mật & Quyền riêng tư là Mặc định (Privacy by Default):** Dữ liệu gia phả là thông tin riêng tư nhạy cảm; không công khai dữ liệu, không chia sẻ chéo, không dùng cho mục đích thương mại hay AI công cộng.
2. **Ưu tiên Tính đúng đắn của Đồ thị (Graph Correctness):** Đảm bảo quan hệ gia phả không có chu trình vòng lặp (Cycles) và không tự liên kết (Self-link).
3. **Mobile-Usable song hành cùng Desktop:** Không xem giao diện điện thoại là phiên bản rút gọn; các luồng nghiệp vụ cốt lõi phải thao tác được trơn tru trên màn hình cảm ứng.
4. **Chi phí Vận hành Thấp (Low-Cost / Zero-Cost):** Tận dụng tối đa tài nguyên Free Tier, thiết kế phi trạng thái, sẵn sàng di chuyển hạ tầng.

---

## 4. Mục tiêu KHÔNG thuộc Phạm vi MVP v0.1

- Trở thành mạng xã hội dòng họ công cộng.
- Cung cấp tính năng chat, bảng tin, đóng góp quỹ trực tuyến.
- Phân tích ADN, nhận diện khuôn mặt tự động bằng AI.
- Xây dựng ứng dụng di động native (iOS / Android binary) - v0.1 tập trung hoàn toàn vào Responsive Web App.
- Hỗ trợ in ấn phả đồ khổ lớn phức tạp hoặc xuất file PDF sách phả ký hoàn chỉnh.

---

## 5. Danh sách Giả định Sản phẩm (Assumptions)

- **ASM-001:** Người dùng ban đầu là cá nhân tự thu thập và nhập dữ liệu gia phả của gia đình mình, không đòi hỏi tính năng nhiều người cùng chỉnh sửa đồng thời trong v0.1.
- **ASM-002:** Dữ liệu gia phả ban đầu thường chắp vá, thiếu ngày tháng chính xác (chỉ biết năm sinh hoặc người đã khuất không nhớ rõ ngày mất); hệ thống phải chấp nhận thông tin bán cấu trúc.
- **ASM-003:** Trình duyệt hiện đại trên smartphone (Chrome Android, Safari iOS) hỗ trợ đầy đủ các API đồ họa CSS Transform và Touch Events để tương tác cây gia phả.

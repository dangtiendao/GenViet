# Tuyên bố Vấn đề Sản phẩm (Problem Statement & Product Hypothesis)

- **Mã tài liệu:** `PROD-PROBLEM-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Hiện trạng (Current State)

Tại Việt Nam, việc lưu trữ gia phả phần lớn vẫn diễn ra theo hình thức truyền thống:
- Ghi chép trên các cuốn sổ tay gia phả bằng giấy (dễ bị ố vàng, rách nát, thất lạc theo thời gian).
- Lưu tạm thời trên các file Word/Excel hoặc sơ đồ vẽ tay thủ công (rất khó xem trên điện thoại và cực kỳ khó khăn khi muốn chèn thêm một nhánh mới).
- Dữ liệu thu thập được thường không đầy đủ ngay từ đầu mà tích lũy qua từng năm thông qua lời kể của các cụ cao niên trong dòng họ.

---

## 2. Danh sách Vấn đề Cốt lõi (Core Problems)

| Mã Vấn đề | Tên vấn đề | Mô tả chi tiết | Tác động tiêu cực |
| :--- | :--- | :--- | :--- |
| **PROB-001** | Dữ liệu Chắp vá & Thu thập Dần dần | Người làm gia phả không có đủ thông tin từ đời Thủy tổ ngay từ đầu mà thường chỉ biết từ đời ông bà/cha mẹ của mình. | Không thể sử dụng các phần mềm bắt buộc phải nhập từ Đời 1 (Thủy tổ). |
| **PROB-002** | Ràng buộc Nhập liệu Cứng nhắc | Đa số công cụ vẽ cây chỉ cho phép vẽ từ trên xuống dưới (Top-down). Khi phát hiện thêm cụ tổ hoặc chi họ phía trên thì phải vẽ lại từ đầu. | Tốn nhiều công sức, gây ức chế và dễ bỏ cuộc giữa chừng. |
| **PROB-003** | Trải nghiệm Kém trên Điện thoại | Các phần mềm gia phả cũ hoặc sơ đồ ảnh lớn không hỗ trợ co giãn responsive; chữ bị bé li ti hoặc vỡ khung trên màn hình smartphone. | Người dùng không thể mở ra tra cứu nhanh khi đi đám giỗ hoặc gặp người thân. |
| **PROB-004** | Nguy cơ Rò rỉ Dữ liệu Riêng tư | Đưa cây gia phả lên các mạng xã hội hoặc dịch vụ mở dễ bị lộ ngày sinh, số điện thoại, nơi an táng của người thân cho người ngoài. | Xâm phạm quyền riêng tư nghiêm trọng của các thành viên dòng họ. |
| **PROB-005** | Nguy cơ Mất Dữ liệu & Khó Sao lưu | Nhiều ứng dụng khóa chặt dữ liệu trên hệ thống của họ (Vendor Lock-in), không cho phép xuất file dữ liệu thô để người dùng tự lưu trữ dự phòng. | Người dùng sợ mất toàn bộ công sức nhập liệu khi dịch vụ đóng cửa. |
| **PROB-006** | Chi phí Đắt đỏ & Giao diện Lỗi thời | Các phần mềm quản lý gia tộc chuyên nghiệp thường thu phí định kỳ cao, giao diện phức tạp khó dùng với người dùng phổ thông. | Rào cản lớn đối với nhu cầu cá nhân/gia đình nhỏ. |

---

## 3. Tuyên bố Vấn đề Ngắn gọn (Problem Statement)

> **"Những người muốn lưu giữ gia phả gia đình tại Việt Nam đang gặp khó khăn khi các công cụ hiện nay quá phức tạp, bắt buộc nhập từ Thủy tổ, hiển thị kém trên điện thoại và thiếu sự đảm bảo về quyền riêng tư. Họ cần một giải pháp web hiện đại, dễ dùng, cho phép nhập liệu dần từ bất kỳ thành viên nào, hiển thị đồ thị mượt mà trên di động và hoàn toàn bảo mật."**

---

## 4. Giả thuyết Sản phẩm (Product Hypothesis)

> **"Nếu chúng ta cung cấp một ứng dụng web gia phả cá nhân cho phép bắt đầu từ một người bất kỳ, hỗ trợ thêm cha mẹ/con cái linh hoạt theo thời gian, tự động tính toán layout phân tầng hiển thị mượt mà trên điện thoại và cho phép xuất bản sao lưu JSON riêng tư, thì người lập phả cá nhân sẽ có thể số hóa và duy trì cây gia phả gia đình một cách dễ dàng, lâu dài mà không tốn chi phí."**

---

## 5. Phạm vi Giải quyết trong Phiên bản MVP v0.1

### Vấn đề v0.1 SẼ giải quyết:
- `PROB-001` & `PROB-002`: Cho phép bắt đầu từ bất kỳ ai và bổ sung cha mẹ lên trên hoặc con cháu xuống dưới linh hoạt.
- `PROB-003`: Đồ thị cây gia phả tương tác mượt mà trên cả Desktop và Smartphone (Touch Pan/Zoom).
- `PROB-004`: Chính sách riêng tư mặc định (Private by Default), RLS bảo vệ dữ liệu tuyệt đối.
- `PROB-005`: Tính năng xuất bản sao lưu dữ liệu cốt lõi (JSON Backup).
- `PROB-006`: Ứng dụng web miễn phí trong giai đoạn cá nhân, giao diện tối giản với Tailwind CSS và shadcn/ui.

### Vấn đề TẠM HOÃN sang các phiên bản sau:
- Tự động đồng bộ nhiều người cùng chỉnh sửa.
- Thuật toán tự động ghép 2 cây gia phả độc lập thành một.
- Tự động số hóa gia phả từ ảnh chụp tài liệu Hán - Nôm bằng AI.

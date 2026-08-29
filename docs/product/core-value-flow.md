# Luồng Giá trị Cốt lõi của Sản phẩm (Core Value Flow)

- **Mã tài liệu:** `PROD-FLOW-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Sơ đồ Luồng Giá trị Cốt lõi (Core Value Flow Diagram)

```mermaid
flowchart TD
    Start([1. Bắt đầu: Đăng nhập]) --> CreateTree[2. Tạo Cây Gia phả mới]
    CreateTree --> FirstNode[3. Tạo Nhân vật Đầu tiên\n(Node bất kỳ)]
    FirstNode --> FirstVal{🎉 FIRST VALUE\nNhìn thấy cây có 1 node}
    FirstVal --> AddRel[4. Thêm Cha/Mẹ/Vợ/Con\n(Mở rộng đa chiều)]
    AddRel --> ViewGraph[5. Xem & Tương tác Cây\n(Pan/Zoom, Đổi người trung tâm)]
    ViewGraph --> EditSearch[6. Tìm kiếm & Chỉnh sửa Hồ sơ]
    EditSearch --> ExportBackup[7. Xuất Sao lưu JSON\n(Bảo toàn dữ liệu)]
    ExportBackup --> CoreVal{🏆 CORE VALUE\nCây hoàn chỉnh, trực quan, an toàn}
```

---

## 2. Định nghĩa Giá trị Sản phẩm (Value Milestones)

1. **First Value (Khoảnh khắc Nhận Giá trị Đầu tiên):**
   - *Thời điểm đạt được:* Ngay sau Bước 3, khi người dùng nhập xong thông tin người đầu tiên và màn hình đồ thị trực quan xuất hiện với 1 node trung tâm cùng các nút thao tác nhanh (+ Cha, + Mẹ, + Vợ/Chồng, + Con).
   - *Cảm xúc người dùng:* Thấy hệ thống trực quan, dễ hiểu, không bị rườm rà hay bắt buộc khai báo phức tạp.
2. **Core Value (Khoảnh khắc Đạt Giá trị Cốt lõi Toàn diện):**
   - *Thời điểm đạt được:* Sau khi người dùng đã thêm được 2-3 thế hệ (ông bà, cha mẹ, con cháu), cây tự động căn chỉnh vị trí đẹp mắt, người dùng tìm kiếm được thành viên và xuất thành công file sao lưu JSON về máy.
   - *Cảm xúc người dùng:* Yên tâm tuyệt đối vì dữ liệu gia đình đã được số hóa gọn gàng, xem được trên điện thoại và có bản sao lưu lưu trữ riêng tư.

---

## 3. Chi tiết Từng Bước trong Luồng Giá trị

| Bước | Hành động của người dùng | Kết quả hệ thống phản hồi | Giá trị mang lại |
| :---: | :--- | :--- | :--- |
| **1** | Đăng nhập tài khoản bằng Email/Mật khẩu | Chuyển thẳng đến Dashboard quản lý gia phả | Xác thực an toàn, mở phiên làm việc riêng tư. |
| **2** | Nhập tên cây gia phả (ví dụ: "Gia phả họ Nguyễn") | Tạo cây và chuyển ngay vào màn hình đồ thị | Khởi tạo không gian lưu trữ độc lập. |
| **3** | Nhập thông tin người đầu tiên (Họ tên, Giới tính) | Node xuất hiện trên nền Canvas React Flow | **Đạt First Value:** Thấy được hình hài cây gia phả. |
| **4** | Bấm "+ Thêm Cha", "+ Thêm Mẹ" hoặc "+ Thêm Con" | ELK.js tự động xếp tầng, nối đường dây liên kết | Mở rộng gia phả tự do không giới hạn chiều. |
| **5** | Chạm/kéo đồ thị, bấm vào node khác làm trung tâm | Cây tự động tái định vị trọng tâm quan sát | Dễ dàng theo dõi từng nhánh gia tộc. |
| **6** | Gõ tên vào thanh tìm kiếm, bấm vào kết quả | Đồ thị tự động căn giữa vào đúng nhân vật đó | Tra cứu thông tin người thân trong 2 giây. |
| **7** | Bấm "Sao lưu dữ liệu" trong menu | Tải file `.json` chứa toàn bộ dữ liệu về máy | **Đạt Core Value:** Bảo toàn dữ liệu 100%. |

---

## 4. Phân tích Nguy cơ Bỏ cuộc (Drop-off Risks) & Giải pháp

| Điểm rơi tiềm ẩn | Nguyên nhân chính | Giải pháp thiết kế trong MVP v0.1 |
| :--- | :--- | :--- |
| **Sau khi tạo cây:** Thấy màn hình trắng trơn không biết làm gì tiếp | Trạng thái rỗng (Empty state) thiếu hướng dẫn | Hiển thị nút bấm to, rõ ràng: `[+ Tạo thành viên đầu tiên]` kèm gợi ý ngắn gọn. |
| **Khi thêm cha mẹ:** Bị bắt buộc nhập ngày sinh chính xác | Người dùng không nhớ ngày tháng của cụ tổ | Cho phép bỏ trống ngày tháng, chỉ bắt buộc Họ tên và Giới tính. |
| **Trên màn hình điện thoại:** Bấm nhầm nút hoặc chữ quá bé | Giao diện không tối ưu cho cảm ứng | Thiết kế nút bấm tối thiểu 44x44px, hỗ trợ pinch-to-zoom và drawer xem hồ sơ từ đáy màn hình (Bottom Drawer). |

---

## 5. Nguyên tắc "Không Rào cản" (Zero-Friction Onboarding)

- Tuyệt đối **KHÔNG** bắt người dùng đi qua chuỗi tour hướng dẫn (Tutorial wizard) dài dòng trước khi bắt đầu.
- Cho phép người dùng chạm tay vào việc tạo node ngay trong 30 giây đầu tiên sau khi đăng nhập.

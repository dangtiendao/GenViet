# Luồng Trải nghiệm: Tạo Người Đầu Tiên trên Cây (Create Initial Person Flow)

- **Mã Flow:** `FLOW-SETUP-02`
- **Mã Màn hình liên quan:** `SCR-008` (Create Initial Person Dialog), `SCR-009` (Tree Canvas)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Khởi tạo Thành viên Đầu tiên (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Mở Cây Gia phả Rỗng]) --> OpenDialog[Tự động mở Hộp thoại\n'Thêm Thành viên Đầu tiên' - SCR-008]
    OpenDialog --> ShowExpl[Giải thích: 'Bạn có thể bắt đầu từ chính mình,\ncha mẹ hoặc bất kỳ cụ tổ nào']

    ShowExpl --> InputFields[Nhập Họ tên, Giới tính, Năm sinh]
    InputFields --> CheckLiving{Trạng thái sống?}
    CheckLiving -->|Còn sống| SetLivingTrue[is_living = true\nẨn ô ngày mất]
    CheckLiving -->|Đã mất| SetLivingFalse[is_living = false\nHiện ô nhập Năm mất tùy chọn]

    SetLivingFalse --> CheckDates{Kiểm tra logic Ngày}
    SetLivingTrue --> CheckDates

    CheckDates -->|Năm mất < Năm sinh| ShowDateErr[Báo lỗi: 'Năm mất không thể trước năm sinh']
    ShowDateErr --> InputFields

    CheckDates -->|Hợp lệ| Submit[Bấm nút 'Lưu & Bắt đầu vẽ cây']
    Submit --> SaveApi[Gửi API tạo Person tới Supabase]
    SaveApi --> SaveSuccess{Lưu thành công?}

    SaveSuccess -->|Thành công| OpenCanvas[Chuyển tới Canvas Cây Gia phả\nSCR-009]
    OpenCanvas --> FocusNode[Node mới xuất hiện ở trung tâm Canvas\nĐược đặt làm Center Person tạm thời]
    FocusNode --> ShowGuideTip[Hiển thị Tooltip hướng dẫn:\n'Bấm vào các dấu + quanh người này để thêm Cha, Mẹ, Vợ/Chồng hoặc Con']

    SaveSuccess -->|Lỗi| ShowSaveErr[Báo lỗi và cho phép thử lại]
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Các Nguyên tắc Thiết kế Cốt lõi
1. **Không Áp đặt Danh hiệu Thủy tổ (`INV-008`):** Tiêu đề form là *"Thêm thành viên đầu tiên"*, tuyệt đối không ghi *"Nhập cụ Thủy tổ dòng họ"*.
2. **Hỗ trợ Ngày tháng Mềm dẻo (`INV-010`):** Trường ngày sinh cho phép người dùng chỉ nhập năm (ví dụ: `1985`) hoặc chọn ngày đầy đủ nếu nhớ chính xác.
3. **Chuyển tiếp Vào Trạng thái Sẵn sàng Tương tác:** Sau khi lưu thành công, node vừa tạo xuất hiện ở chính giữa Canvas React Flow với 4 nút tắt tiện ích nhanh xung quanh:
   - `[ ↑ Thêm Cha / Mẹ ]` ở phía trên
   - `[ ↔ Thêm Vợ / Chồng ]` ở bên cạnh
   - `[ ↓ Thêm Con cái ]` ở phía dưới

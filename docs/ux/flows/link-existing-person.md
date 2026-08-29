# Luồng Trải nghiệm: Liên kết Người Đã Có trong Cây (Link Existing Person Flow)

- **Mã Flow:** `FLOW-REL-05`
- **Mã Màn hình liên quan:** `SCR-017` (Link Existing Person Modal / Sheet)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Tìm kiếm & Liên kết Thành viên (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Chuyển sang Tab 'Chọn người có sẵn']) --> OpenPicker[Mở Giao diện Tìm & Chọn Thành viên\nSCR-017]
    OpenPicker --> InputSearch[Gõ tên tìm kiếm - Hỗ trợ có dấu và không dấu]

    InputSearch --> DebounceSearch[Tìm kiếm trong danh sách thành viên cùng cây]
    DebounceSearch --> SearchResult{Có kết quả trùng khớp?}

    SearchResult -->|Không tìm thấy| ShowNoResult[Hiển thị: 'Không tìm thấy thành viên này'\nKèm nút: '+ Chuyển sang Tạo người mới']
    ShowNoResult --> ClickSwitch[Bấm '+ Tạo người mới' $\rightarrow$ Chuyển tab giữ nguyên tên đã gõ]

    SearchResult -->|Tìm thấy 1 hoặc nhiều người| ShowList[Hiển thị danh sách thẻ kết quả\nKèm thông tin phân biệt người trùng tên]
    ShowList --> SelectTarget[Người dùng chạm/chọn 1 Person B]

    SelectTarget --> ShowPreviewCard[Hiển thị Thẻ Xem Trước Quan hệ:\n'Person A và Person B sẽ được liên kết với vai trò [X]']
    ShowPreviewCard --> CheckDAG{Kiểm tra Bất biến DAG}

    CheckDAG -->|Tạo Chu trình hoặc Self-link| ShowBlockErr[Chặn nút Lưu & Hiển thị giải thích lý do cụ thể]
    CheckDAG -->|Cảnh báo Trùng vai trò / Niên đại| ShowWarnBadge[Hiển thị cảnh báo vàng cần xác nhận]
    CheckDAG -->|Hợp lệ| EnableSave[Kích hoạt nút 'Xác nhận Nối quan hệ']

    ShowWarnBadge --> ConfirmWarn{Người dùng xác nhận tiếp tục}
    ConfirmWarn -->|Xác nhận| EnableSave
    ConfirmWarn -->|Hủy| CancelLink([Hủy bỏ])

    EnableSave --> ClickSave[Bấm 'Xác nhận Nối quan hệ']
    ClickSave --> CallLinkApi[Gửi API tạo quan hệ trong cùng tree_id]
    CallLinkApi --> SuccessToast[Hiện Toast: 'Đã nối liên kết thành công' $\rightarrow$ Đóng Modal]
```

---

## 2. Đặc tả Chi tiết Trải nghiệm Thao tác

### 2.1. Thẻ Kết quả Phân biệt Người Trùng Tên
Khi người dùng tìm *"Nguyễn Văn A"*, hệ thống có thể trả về 3 người cùng tên. Mỗi dòng kết quả hiển thị thẻ phân biệt đa chiều:
```text
┌────────────────────────────────────────────────────────┐
│  👤 Nguyễn Văn A                                       │
│     • Sinh năm: 1950 (Đã mất 2010)                     │
│     • Con của: Cụ Nguyễn Văn X & Bà Trần Thị Y         │
│     • Vợ/Chồng: Bà Lê Thị M                            │
│     [ CHỌN NGƯỜI NÀY ]                                 │
└────────────────────────────────────────────────────────┘
```

### 2.2. Phân định Rạch ròi giữa Nối Quan hệ vs Gộp Hồ sơ
- **Liên kết Quan hệ (`Link`):** Chỉ tạo 1 bản ghi mới trong bảng quan hệ `relationships`. Cả Person A và Person B vẫn là 2 node riêng biệt trên cây.
- **Tuyệt đối Không Tự ý Gộp (`INV-012`):** Giao diện liên kết không làm hợp nhất dữ liệu họ tên hay ghi chú của 2 người.

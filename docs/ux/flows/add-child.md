# Luồng Trải nghiệm: Thêm Con cái (Add Child Flow)

- **Mã Flow:** `FLOW-REL-04`
- **Mã Màn hình liên quan:** `SCR-016` (Add Child Dialog / Sheet), `SCR-017` (Link Existing Person)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Thêm Con cái (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Chạm/Nhấp vào Node Person A]) --> OpenMenu[Mở Menu thao tác Node]
    OpenMenu --> ClickAddChild[Chọn '+ Thêm Con cái']

    ClickAddChild --> CheckSpouse{Person A có Vợ/Chồng\nđang liên kết không?}
    CheckSpouse -->|Có 1 Vợ/Chồng B| SuggestOtherParent[Gợi ý: 'Con chung với [Tên B]' - Có checkbox bỏ chọn]
    CheckSpouse -->|Có nhiều Vợ/Chồng| DropdownSpouse[Hiển thị danh sách chọn người Mẹ/Cha thứ hai]
    CheckSpouse -->|Chưa có Vợ/Chồng| SingleParent[Tạo con đơn thân với Person A]

    SuggestOtherParent --> OpenChildForm[Mở Form Thêm Con\nSCR-016]
    DropdownSpouse --> OpenChildForm
    SingleParent --> OpenChildForm

    OpenChildForm --> TabChoice{Chọn cách thêm}
    TabChoice -->|Tạo Con mới| InputNewChild[Nhập Họ tên, Giới tính, Năm sinh]
    TabChoice -->|Chọn Người có sẵn| SearchExistingChild[Chọn Con đã có trong cây]

    InputNewChild --> PreviewChild[Hiển thị Xem Trước Quan hệ:\n'Nguyễn Văn D là CON của Nguyễn Văn A (và Trần Thị C)']
    SearchExistingChild --> PreviewChild

    PreviewChild --> CheckInvariants{Kiểm tra Bất biến DAG & Niên đại}
    CheckInvariants -->|Chọn chính A làm con A| ShowSelfErr[Chặn ERR-001: Không thể tự làm con của chính mình]
    CheckInvariants -->|Chọn Cụ tổ làm con A| ShowCycleErr[Chặn ERR-002: Gây chu trình vòng lặp thế hệ]
    CheckInvariants -->|Khoảng cách tuổi < 12 hoặc > 80| ShowAgeWarn[Cảnh báo WARN-002: Khoảng cách tuổi bất thường]

    ShowAgeWarn --> ConfirmAge{Tiếp tục lưu?}
    ConfirmAge -->|Hủy| EndCancel([Hủy thao tác])
    ConfirmAge -->|Xác nhận| SubmitChild[Bấm 'Lưu Con cái']

    CheckInvariants -->|Hợp lệ| SubmitChild
    SubmitChild --> SaveApi[Gửi API tạo quan hệ Parent-Child]
    SaveApi --> TreeUpdate[Đồ thị cập nhật:\nNode Con xuất hiện ở HÀNG DƯỚI của Cha/Mẹ]
    TreeUpdate --> SuccessToast[Hiện Toast: 'Đã thêm Con thành công']
```

---

## 2. Đặc tả Chi tiết Trải nghiệm Thao tác

### 2.1. Tính Linh hoạt của Quan hệ Phụ Mẫu - Tử Tức
1. **Không Ép buộc Đủ 2 Cha Mẹ:** Hệ thống cho phép tạo Con chỉ với 1 người Cha (hoặc chỉ 1 người Mẹ) mà không bắt buộc phải tạo Dummy Person cho người còn lại (`UDR-001`).
2. **Gợi ý Người Phối ngẫu Thông minh:** Nếu Person A đang kết hôn với Person B, form tự động tích chọn *"Con chung với [Tên B]"*, người dùng có thể bỏ chọn nếu đây là con riêng của A.
3. **Vị trí Đồ thị Sau khi Thêm:** Node Con tự động xuất hiện ở **hàng ngang phía dưới**, nối đường huyết thống từ hộp quan hệ của Cha/Mẹ.

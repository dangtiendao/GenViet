# Luồng Trải nghiệm: Thêm Cha & Thêm Mẹ (Add Parent Flow)

- **Mã Flow:** `FLOW-REL-01` (Thêm Cha) & `FLOW-REL-02` (Thêm Mẹ)
- **Mã Màn hình liên quan:** `SCR-014` (Add Parent Dialog / Sheet), `SCR-017` (Link Existing Person)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Thêm Phụ Mẫu (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Chạm/Nhấp vào Node Person A]) --> OpenMenu[Mở Menu thao tác Node\nBottom Sheet / Popover]
    OpenMenu --> ClickAddParent[Chọn '+ Thêm Cha' hoặc '+ Thêm Mẹ']

    ClickAddParent --> CheckExistingBio{Person A đã có Cha/Mẹ ruột\nxác nhận chưa?}
    CheckExistingBio -->|Đã có| ShowBioWarn[Hiện cảnh báo WARN-001:\n'Người này đã có Cha/Mẹ ruột. Bạn muốn thay thế hay thêm dạng Chưa xác minh?']
    ShowBioWarn --> ChoiceBio{Lựa chọn}
    ChoiceBio -->|Hủy bỏ| EndCancel([Hủy thao tác an toàn])
    ChoiceBio -->|Tiếp tục| OpenParentForm[Mở Giao diện Thêm Phụ mẫu\nSCR-014]

    CheckExistingBio -->|Chưa có| OpenParentForm

    OpenParentForm --> TabChoice{Chọn cách thêm}
    TabChoice -->|Tab 1: Tạo Người mới| InputNewParent[Nhập Họ tên, Giới tính, Năm sinh]
    TabChoice -->|Tab 2: Nối Người có sẵn| SearchExisting[Mở Luồng Tìm & Nối Người Có Sẵn\nFLOW-REL-05]

    InputNewParent --> PreviewRel[Hiển thị Hộp Xem Trước Quan hệ:\n'Nguyễn Văn B sẽ là CHA của Nguyễn Văn A']
    SearchExisting --> PreviewRel

    PreviewRel --> InvariantCheck{Kiểm tra Bất biến DAG}
    InvariantCheck -->|Tự làm Cha A -> A| ShowSelfErr[Chặn ERR-001:\n'Một người không thể là cha/mẹ của chính mình']
    InvariantCheck -->|Tạo Chu trình B là con A| ShowCycleErr[Chặn ERR-002:\n'Không thể chọn người này vì họ đang là con/cháu của A']

    InvariantCheck -->|Hợp lệ| Submit[Bấm nút 'Xác nhận Thêm']
    Submit --> SaveApi[Gửi API tạo quan hệ Parent-Child]
    SaveApi --> TreeUpdate[Đồ thị tự động bố trí lại:\nNode Phụ mẫu xuất hiện ở tầng TRÊN của Person A]
    TreeUpdate --> SuccessToast[Hiện Toast: 'Đã thêm Cha/Mẹ thành công']
```

---

## 2. Đặc tả Chi tiết Trải nghiệm Thao tác

### 2.1. Hai Phương thức Thêm Phụ Mẫu
1. **Phương thức 1: Tạo Người Mới (Mặc định):**
   - Form điền nhanh Họ tên và Năm sinh.
   - Giới tính được tự động chọn trước theo hành động (`MALE` khi bấm Thêm Cha, `FEMALE` khi bấm Thêm Mẹ).
2. **Phương thức 2: Liên kết Người Đã Có trong Cây:**
   - Người dùng chuyển sang tab *"Chọn người có sẵn"*.
   - Nhập tên tìm kiếm và chọn từ danh sách hiển thị kèm năm sinh để đối chiếu.

### 2.2. Hành vi Bố trí Đồ thị Sau khi Thêm Tổ tiên
- **Mở rộng Đa chiều Tự nhiên:** Node Cha/Mẹ mới lập tức xuất hiện ở **hàng ngang phía trên** của Person A với đường nối huyết thống hướng xuống A.
- **Bảo toàn Khung nhìn (`UXR-008`):** Trọng tâm màn hình vẫn giữ nguyên quanh Person A, người dùng có thể nhấp vào Node Cha/Mẹ mới để tiếp tục bấm `+ Thêm Ông/Bà` lên cao hơn nữa.

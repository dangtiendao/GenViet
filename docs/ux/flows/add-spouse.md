# Luồng Trải nghiệm: Thêm Vợ / Chồng (Add Spouse Flow)

- **Mã Flow:** `FLOW-REL-03`
- **Mã Màn hình liên quan:** `SCR-015` (Add Spouse Dialog / Sheet), `SCR-017` (Link Existing Person)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Thêm Người Phối ngẫu (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Chạm/Nhấp vào Node Person A]) --> OpenMenu[Mở Menu thao tác Node]
    OpenMenu --> ClickAddSpouse[Chọn '+ Thêm Vợ / Chồng']

    ClickAddSpouse --> OpenSpouseForm[Mở Giao diện Thêm Hôn phối\nSCR-015]
    OpenSpouseForm --> TabChoice{Chọn cách thêm}

    TabChoice -->|Tạo Người mới| InputNewSpouse[Nhập Họ tên, Giới tính đối lập, Năm sinh]
    TabChoice -->|Chọn Người có sẵn| SearchExistingSpouse[Chọn Người có sẵn trong cây]

    InputNewSpouse --> PreviewSpouse[Hiển thị Xem Trước Quan hệ:\n'Nguyễn Văn A và Trần Thị C là VỢ CHỒNG']
    SearchExistingSpouse --> PreviewSpouse

    PreviewSpouse --> InvariantCheck{Kiểm tra Bất biến Hôn nhân}
    InvariantCheck -->|A kết hôn với chính A| ShowSelfSpouseErr[Chặn ERR-003:\n'Một người không thể tự kết hôn với chính mình']
    InvariantCheck -->|Đã có quan hệ hôn nhân với B đang Active| ShowDupSpouseErr[Chặn ERR-006:\n'Hai người này đã có quan hệ hôn nhân đang hoạt động']
    InvariantCheck -->|Trùng lặp khoảng thời gian hôn nhân| ShowOverlapWarn[Cảnh báo WARN-003:\n'Thành viên này đang có cuộc hôn nhân khác cùng hiệu lực']

    ShowOverlapWarn --> ConfirmOverlap{Xác nhận lưu?}
    ConfirmOverlap -->|Tiếp tục| SubmitSpouse[Bấm 'Xác nhận Hôn phối']
    ConfirmOverlap -->|Hủy bỏ| EndCancel([Hủy thao tác an toàn])

    InvariantCheck -->|Hợp lệ| SubmitSpouse
    SubmitSpouse --> SaveApi[Gửi API tạo quan hệ Marriage]
    SaveApi --> TreeUpdate[Đồ thị cập nhật:\nNode Vợ/Chồng xuất hiện ở CÙNG HÀNG NGANG với Person A]
    TreeUpdate --> SuccessToast[Hiện Toast: 'Đã thêm Vợ/Chồng thành công']
```

---

## 2. Đặc tả Chi tiết Trải nghiệm Thao tác

### 2.1. Hành vi Đồ thị và Dữ liệu
- **Bố trí Ngang Cùng Thế hệ:** Node Người phối ngẫu được xếp cạnh bên Person A, nối với nhau bằng đường liên kết hôn nhân ngang (`Marriage line`).
- **Không Tự động Gán Con Chung (`INV-016`):** Thêm vợ/chồng mới cho Person A không tự động gán các con riêng đã có của A thành con của người vợ/chồng mới này.
- **Hỗ trợ Nhiều lần Kết hôn:** Nếu Person A đã có vợ/chồng trước đó (đã ly hôn hoặc đã mất), giao diện hiển thị danh sách các người phối ngẫu theo thứ tự thời gian.

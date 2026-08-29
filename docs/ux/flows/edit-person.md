# Luồng Trải nghiệm: Chỉnh sửa Hồ sơ Thành viên (Edit Person Flow)

- **Mã Flow:** `FLOW-PERSON-01`
- **Mã Màn hình liên quan:** `SCR-011` (Person Profile), `SCR-013` (Edit Person Form)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Chỉnh sửa Hồ sơ (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Mở Chi tiết Hồ sơ Person A - SCR-011]) --> ClickEdit[Bấm nút 'Chỉnh sửa Hồ sơ']
    ClickEdit --> OpenForm[Mở Form Chỉnh sửa - SCR-013\nDesktop Dialog / Mobile Full Sheet]

    OpenForm --> LoadCurrentData[Hiển thị dữ liệu hiện tại:\nHọ tên, Giới tính, Ngày sinh, Ngày mất, Tiểu sử]
    LoadCurrentData --> UserEditing[Người dùng chỉnh sửa các trường]

    UserEditing --> CheckChanges{Có thay đổi gì không?}
    CheckChanges -->|Không thay đổi| ClickCancel[Bấm 'Hủy bỏ' $\rightarrow$ Đóng form ngay]
    CheckChanges -->|Có thay đổi| ClickCancelDirty[Bấm 'Hủy bỏ']

    ClickCancelDirty --> ShowUnsavedAlert[Cảnh báo CONF-001:\n'Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?']
    ShowUnsavedAlert -->|Hủy thoát| UserEditing
    ShowUnsavedAlert -->|Xác nhận thoát| CloseForm([Đóng form, không lưu thay đổi])

    UserEditing --> ClickSave[Bấm nút 'Lưu Thay đổi']
    ClickSave --> ValidateFields{Kiểm tra tính hợp lệ}
    ValidateFields -->|Năm mất < Năm sinh| ShowInlineErr[Báo lỗi đỏ ô ngày mất]
    ShowInlineErr --> UserEditing

    ValidateFields -->|Hợp lệ| SendSaveApi[Gửi API cập nhật Person tới Supabase]
    SendSaveApi --> SaveSuccess{Lưu thành công?}
    SaveSuccess -->|Thành công| UpdateViews[Cập nhật ngay lập tức:\n1. Thông tin trong Profile Panel\n2. Tên/Ảnh trên Node Đồ thị]
    UpdateViews --> ShowToast[Hiện Toast: 'Đã lưu thay đổi hồ sơ']

    SaveSuccess -->|Lỗi mạng / Server| ShowErrToast[Báo lỗi và giữ nguyên form cho người dùng sửa]
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Bảo toàn Ngữ cảnh Không Gian
- Khi chỉnh sửa tên hoặc ảnh của một người, vị trí của họ trên Canvas đồ thị và trọng tâm `Center Person` **hoàn toàn được giữ nguyên**, không gây xáo trộn đồ thị.
- Form phân nhóm gọn gàng:
  1. *Thông tin cơ bản:* Họ tên, Giới tính, Trạng thái còn sống/đã mất.
  2. *Niên đại:* Ngày sinh và Ngày mất (kèm bộ chọn cấp độ chính xác Date Precision).
  3. *Tiểu sử & Ghi chú:* Quê quán, nơi an táng, sự nghiệp.

# Luồng Trải nghiệm: Xóa Mềm Thành viên (Soft Delete Flow)

- **Mã Flow:** `FLOW-PERSON-02`
- **Mã Màn hình liên quan:** `SCR-011` (Profile), `SCR-018` (Dangerous Action Alert Dialog)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Xóa Mềm & Xem Trước Tác Động (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Mở Hồ sơ / Menu Node Person A]) --> ClickDelete[Bấm nút 'Xóa thành viên' ở cuối danh mục]
    ClickDelete --> OpenImpactDialog[Mở Hộp thoại Cảnh báo Tác động\nSCR-018 / CONF-002]

    OpenImpactDialog --> ShowImpactDetails[Hiển thị chi tiết ảnh hưởng kết nối:\n- Ngắt kết nối với 2 phụ mẫu\n- Ngắt kết nối với 1 người vợ\n- Ngắt kết nối với 3 người con]
    ShowImpactDetails --> ShowSafetyNote[Ghi rõ dòng cam kết:\n'🔒 Toàn bộ người thân của thành viên này vẫn được giữ nguyên vẹn trên cây']

    ShowSafetyNote --> CheckSpecialRole{Person A có giữ vai trò đặc biệt?}
    CheckSpecialRole -->|Đang là Center Person| WarnCenter[Thông báo: 'Hệ thống sẽ chuyển góc nhìn sang [Tên Cha/Vợ]']
    CheckSpecialRole -->|Đang là Generation Anchor| WarnAnchor[Thông báo: 'Số đời tạm ẩn cho đến khi chọn Mốc mới']
    CheckSpecialRole -->|Không| UserConfirm

    WarnCenter --> UserConfirm{Người dùng quyết định}
    WarnAnchor --> UserConfirm

    UserConfirm -->|Bấm 'Hủy bỏ' / Phím ESC| CancelAction([Đóng hộp thoại, giữ nguyên dữ liệu])
    UserConfirm -->|Bấm 'Xác nhận Xóa mềm'| SendDeleteApi[Gửi API đánh dấu is_deleted = true]

    SendDeleteApi --> DeleteSuccess{Kết quả API}
    DeleteSuccess -->|Thành công| RemoveFromView[Ẩn Node Person A khỏi Canvas đồ thị & Tìm kiếm]
    RemoveFromView --> ShiftCenterIfNeed[Nếu vừa xóa Center Person $\rightarrow$ Tự động chuyển trọng tâm sang fallback]
    ShiftCenterIfNeed --> ShowUndoToast[Hiện Toast có nút 'Hoàn tác (Undo)' trong 5 giây]

    DeleteSuccess -->|Lỗi| ShowErrToast[Báo lỗi và giữ nguyên node]
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Hộp thoại Xem Trước Tác Động (`SCR-018` - Impact Preview Alert)
```text
┌────────────────────────────────────────────────────────┐
│ ⚠️ XÁC NHẬN XÓA THÀNH VIÊN KHỎI CÂY                [X] │
├────────────────────────────────────────────────────────┤
│ Bạn có chắc chắn muốn xóa "Nguyễn Văn A" khỏi cây phả  │
│ hệ không?                                              │
│                                                        │
│ 📊 Tác động liên kết:                                  │
│ • Ngắt liên kết với 2 Phụ mẫu: Cụ Nguyễn Văn B & Bà C  │
│ • Ngắt liên kết với 1 Người phối ngẫu: Bà Lê Thị D     │
│ • Ngắt liên kết với 3 Người con                        │
│                                                        │
│ 🛡️ BẢO TOÀN DỮ LIỆU: Toàn bộ cha mẹ, vợ và con của     │
│ thành viên này VẪN TỒN TẠI NGUYÊN VẸN trên cây gia phả.│
├────────────────────────────────────────────────────────┤
│           [ HỦY BỎ ]     [ 🗑️ XÁC NHẬN XÓA MỀM ]       │
└────────────────────────────────────────────────────────┘
```

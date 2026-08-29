# Luồng Trải nghiệm: Tạo Cây Gia phả Mới (Create Family Tree Flow)

- **Mã Flow:** `FLOW-SETUP-01`
- **Mã Màn hình liên quan:** `SCR-005` (Dashboard), `SCR-006` (Empty State), `SCR-007` (Create Tree Modal)
- **Actor:** Người dùng mới đăng ký / Người quản trị cây
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Khởi tạo Cây Gia phả (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Đăng nhập lần đầu]) --> CheckTree{Đã có cây nào chưa?}
    CheckTree -->|Chưa có cây - trees=0| ShowEmpty[Hiển thị Màn hình Cây rỗng\nSCR-006]
    CheckTree -->|Đã có cây| ShowDash[Hiển thị Danh sách Cây / Dashboard\nSCR-005]

    ShowEmpty --> ClickCreateNew[Bấm nút '+ Tạo cây gia phả đầu tiên']
    ShowDash --> ClickAddTree[Bấm '+ Tạo thêm cây mới']

    ClickCreateNew --> OpenTreeModal[Mở Hộp thoại Tạo Cây Gia phả\nSCR-007]
    ClickAddTree --> OpenTreeModal

    OpenTreeModal --> InputForm[Người dùng nhập Tên Cây & Mô tả tùy chọn]
    InputForm --> CheckName{Tên cây có hợp lệ?}
    CheckName -->|Để trống tên| ShowInlineErr[Báo lỗi: 'Vui lòng nhập tên cây gia phả']
    ShowInlineErr --> InputForm

    CheckName -->|Hợp lệ| ClickSubmit[Bấm 'Khởi tạo cây gia phả']
    ClickSubmit --> LockButton[Khóa nút bấm & Hiện Spinner tránh duplicate]
    LockButton --> CallApi[Gửi lệnh tạo cây tới Supabase]

    CallApi --> ApiResult{Kết quả tạo cây}
    ApiResult -->|Thành công| ToastSuccess[Hiện Toast: 'Đã khởi tạo cây gia phả thành công']
    ToastSuccess --> TransitionInitial[Tự động mở Luồng Tạo Người Đầu Tiên\nFLOW-SETUP-02 / SCR-008]

    ApiResult -->|Thất bại| ShowErrToast[Báo lỗi: 'Không thể tạo cây. Vui lòng thử lại']
    ShowErrToast --> OpenTreeModal
```

---

## 2. Đặc tả Chi tiết Các Bước Tương tác

### 2.1. Các Trường Thông tin Form Tạo Cây (`SCR-007`)
- **Tên Cây Gia phả (Bắt buộc):** Ví dụ: *"Gia phả họ Nguyễn (Chi phái Nam Định)"* (Giới hạn tối đa 100 ký tự).
- **Mô tả / Ghi chú (Tùy chọn):** Ghi chú nguồn gốc, quê quán hoặc chi nhánh dòng họ.
- **Quyền Riêng tư (Cố định mặc định):** Gắn nhãn *"Riêng tư (Chỉ tài khoản của bạn có quyền xem & chỉnh sửa)"*.

### 2.2. Hành vi Chuyển tiếp Sau khi Tạo Cây
- **Chuyển tiếp Tự nhiên (Zero-friction Onboarding):** Ngay sau khi bấm tạo cây thành công, hệ thống không để người dùng rơi vào màn hình canvas trống trơn mà **tự động mở ngay hộp thoại Tạo Người Đầu Tiên (`FLOW-SETUP-02`)** với thông điệp:
  > *"Cây gia phả đã sẵn sàng! Hãy bắt đầu bằng cách nhập thành viên đầu tiên (có thể là bạn, cha mẹ hoặc cụ tổ dòng họ)."*

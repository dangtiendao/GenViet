# Luồng Trải nghiệm: Sao lưu Dữ liệu Gia phả (Backup Flow)

- **Mã Flow:** `FLOW-BACKUP-01`
- **Mã Màn hình liên quan:** `SCR-019` (Settings), `SCR-020` (Backup Modal / Card)
- **Actor:** Người quản trị cây gia phả
- **Mức độ Ưu tiên:** `MUST` (với Export) & `SHOULD` (với Import / Restore)

---

## 1. Sơ đồ Luồng Xuất Sao lưu Dữ liệu JSON (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Mở Cài đặt Gia phả - SCR-019]) --> ClickBackupTab[Chọn mục 'Sao lưu & Dữ liệu' - SCR-020]
    ClickBackupTab --> ShowBackupCard[Hiển thị Thẻ Xuất Sao lưu Dữ liệu]

    ShowBackupCard --> ReadPrivacyNotice[Đọc cảnh báo bảo mật:\n'File sao lưu chứa toàn bộ thông tin riêng tư của dòng họ']
    ReadPrivacyNotice --> ClickExport[Bấm nút 'Tạo & Tải file Sao lưu (.json)']

    ClickExport --> ShowProgress[Hiển thị Spinner & Trạng thái: 'Đang đóng gói dữ liệu...']
    ShowProgress --> CallExportApi[Hệ thống tạo file JSON chuẩn phả hệ]

    CallExportApi --> ExportSuccess{Xuất thành công?}
    ExportSuccess -->|Thành công| TriggerDownload[Trình duyệt tự động tải file:\nGenViet_Backup_[TenCay]_[YYYYMMDD].json]
    TriggerDownload --> ShowSuccessToast[Hiện Toast: 'Đã xuất file sao lưu thành công! Hãy lưu trữ nơi an toàn']

    ExportSuccess -->|Thất bại / Timeout| ShowExportErr[Hiện lỗi: 'Không thể tạo file sao lưu. Vui lòng thử lại']
    ShowExportErr --> ShowRetryBtn[Hiển thị nút 'Thử lại']
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Đảm bảo Tính Riêng tư Khi Xuất Dữ liệu
- Trước khi tải file, giao diện luôn hiển thị ghi chú:
  > *"🔒 **Lưu ý bảo mật:** File sao lưu JSON chứa đầy đủ danh sách thành viên, ngày sinh và mối quan hệ gia đình. Hãy cất giữ file này tại thiết bị cá nhân an toàn hoặc dịch vụ lưu trữ tin cậy."*

### 2.2. Nhập Dữ liệu / Phục hồi (Import / Restore - Post-MVP / Should)
- Trong phiên bản v0.1, tính năng Nhập JSON được gắn nhãn `Sắp ra mắt (Coming Soon / Post-MVP)`.
- Khi thiết kế ở giai đoạn sau, luồng nhập bắt buộc có bước **Xem trước dữ liệu (Preview & Schema Validation)** và **tuyệt đối không tự ý ghi đè lên cây đang hoạt động**.

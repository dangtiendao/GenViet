# Wireframe Low-Fidelity: Trạng thái & Hộp thoại Cảnh báo (States & Dialogs Wireframes)

- **Mã tài liệu:** `WF-DIALOGS-01`
- **Màn hình liên quan:** `SCR-018` (Alerts), `SCR-025` (Error Toast/Banners)

---

## 1. Wireframe Hộp thoại Chặn Lỗi Chu trình (`ERR-002` Blocking Modal)

```text
┌────────────────────────────────────────────────────────┐
│  🚫 KHÔNG THỂ NỐI QUAN HỆ NÀY                      [X] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [ Biểu tượng Vòng lặp gạch chéo ]                     │
│                                                        │
│  Không thể thiết lập "Nguyễn Văn B" làm con của        │
│  "Nguyễn Văn A" vì hiện tại "Nguyễn Văn A" đang là     │
│  hậu duệ (con/cháu) của "Nguyễn Văn B".                │
│                                                        │
│  Hành động này sẽ tạo thành vòng lặp thế hệ phi lý.    │
│                                                        │
│  💡 Hướng giải quyết:                                  │
│  Vui lòng kiểm tra lại quan hệ phả hệ của Nguyễn       │
│  Văn B trước khi thiết lập liên kết mới.               │
│                                                        │
├────────────────────────────────────────────────────────┤
│                 [ ← QUAY LẠI CHỌN THÀNH VIÊN KHÁC ]    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Wireframe Toast Cảnh báo & Hoàn tác (Undo Toast Notification)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  🗑️ Đã xóa "Nguyễn Văn A" khỏi cây phả hệ.    [ ↩️ HOÀN TÁC (5s) ]    [X]   │
└────────────────────────────────────────────────────────────────────────────┘
```

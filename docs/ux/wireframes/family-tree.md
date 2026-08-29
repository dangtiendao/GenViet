# Wireframe Low-Fidelity: Cây Gia phả Tương tác (Family Tree Canvas Wireframes)

- **Mã tài liệu:** `WF-TREE-01`
- **Màn hình liên quan:** `SCR-009` (Family Tree Interactive Canvas)

---

## 1. Wireframe Cấu trúc Đồ thị Canvas Phân tầng

```text
                                [ CỤ TỔ (Đời 1) ]
                                1890 - 1965 (Thọ 75)
                                        │
                         ┌──────────────┴──────────────┐
                         │                             │
                  [ ÔNG B (Đời 2) ]              [ BÀ C (Đời 2) ]
                  1920 - 1995                    1925 - 2005
                         │
             ┌───────────┴───────────┐
             │                       │
      ★ [ NGUYỄN VĂN A (Đời 3) ] ═════ [ VỢ: LÊ THỊ D ]
        (🎯 Center Person)                  1955 - Nay
             │
      ┌──────┴──────┐
      │             │
  [ CON E ]     [ CON F ]
  (Đời 4)       (Đời 4)
```

---

## 2. Các Loại Đường Nối Đồ thị (Edge Types)
- **Đường Nối Huyết thống Trực hệ (Solid line):** Đường kẻ dọc nét liền nối từ hộp phụ mẫu xuống đỉnh node con cái.
- **Đường Nối Hôn phối (Horizontal double line):** Đường kẻ đôi hoặc nét liền ngang nối giữa 2 người phối ngẫu.
- **Đường Nối Chưa Xác minh (Dashed line):** Đường nét đứt màu xám cam thể hiện quan hệ phỏng đoán cần kiểm chứng.

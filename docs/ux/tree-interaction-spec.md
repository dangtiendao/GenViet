# Đặc tả Tương tác Khung nhìn Cây Gia phả (Tree Interaction Specification)

- **Mã tài liệu:** `UX-TREEINTERACTION-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Các Thao tác Điều khiển Canvas Đồ thị

```mermaid
graph TD
    UserAction[Tương tác Người dùng trên Canvas] --> NavMove[1. Di chuyển Khung nhìn - Pan]
    UserAction --> Zoom[2. Phóng to / Thu nhỏ - Zoom]
    UserAction --> SelectNode[3. Chọn & Tương tác Node]
    UserAction --> ExpandBranch[4. Thu gọn / Mở rộng Nhánh]

    NavMove --> M1[Mobile: Kéo ngón tay trên màn hình]
    NavMove --> D1[Desktop: Kéo chuột / Giữ Phím cách + Kéo]

    Zoom --> M2[Mobile: Véo 2 ngón / Nút [+] [-]]
    Zoom --> D2[Desktop: Cuộn bánh xe chuột / Nút [+] [-]]

    SelectNode --> OpenAction[Chạm vào Node $\rightarrow$ Mở Menu Thao tác]
    ExpandBranch --> ToggleSubtree[Chạm vào nút số lượng con $\rightarrow$ Ẩn/Hiện nhánh con]
```

---

## 2. Thanh Công cụ Điều khiển Nổi (Floating Canvas Controls)

Ở góc dưới bên trái màn hình luôn có thanh công cụ nổi 4 nút:
1. `[ + ] (Phóng to):` Tăng tỷ lệ hiển thị thêm $+25\%$.
2. `[ - ] (Thu nhỏ):` Giảm tỷ lệ hiển thị $-25\%$.
3. `[ ⛶ ] (Fit View):` Căn chỉnh toàn bộ các nhánh đang mở vừa vặn trong màn hình.
4. `[ 🎯 ] (Về Trung tâm):` Di chuyển mượt mà đưa `Center Person` về chính giữa khung nhìn.

---

## 3. Cơ chế Thu gọn & Mở rộng Nhánh (Branch Expansion & Collapse)
- Để bảo vệ hiệu năng mượt mà trên di động ($\ge 45\text{ FPS}$): Các nhánh có trên 5 người con có thể có nút tròn nhỏ `[ ▾ 5 ]` ở phía dưới node cha/mẹ.
- Người dùng có thể chạm vào nút này để thu gọn hoặc bung nhánh con ra mà không làm chậm đồ thị.

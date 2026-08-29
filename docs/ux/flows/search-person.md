# Luồng Trải nghiệm: Tra cứu & Tìm kiếm Thành viên (Search Person Flow)

- **Mã Flow:** `FLOW-SEARCH-01`
- **Mã Màn hình liên quan:** `SCR-010` (Search Modal / Page), `SCR-009` (Tree Canvas Focus)
- **Actor:** Người dùng tra cứu gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Tìm kiếm Thành viên (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Bấm nút Tìm kiếm / Phím tắt Ctrl+K]) --> OpenSearch[Mở Thanh Tìm kiếm Toàn diện - SCR-010]
    OpenSearch --> InputQuery[Gõ tên thành viên - Tiếng Việt có dấu hoặc không dấu]

    InputQuery --> DebounceSearch[Xử lý tìm kiếm tức thì - Debounce 250ms]
    DebounceSearch --> ResultCheck{Có kết quả trùng khớp?}

    ResultCheck -->|Không tìm thấy| ShowEmptySearch[Hiển thị: 'Không tìm thấy thành viên phù hợp với từ khóa']
    ResultCheck -->|Tìm thấy| ShowResults[Hiển thị Danh sách Kết quả kèm thông tin phân biệt:\n- Tên, Năm sinh, Đời\n- Tên Cha/Mẹ hoặc Vợ/Chồng]

    ShowResults --> UserAction{Người dùng chọn}
    UserAction -->|Bấm 'Xem trên cây'| CenterOnTree[1. Đóng Modal Tìm kiếm\n2. Đặt người này làm Center Person\n3. Di chuyển Canvas tới vị trí node và hiệu ứng nhấp nháy làm nổi bật]
    UserAction -->|Bấm 'Xem hồ sơ'| OpenProfile[Mở Side Panel / Bottom Sheet chi tiết của người đó]
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Tìm kiếm Tiếng Việt Linh hoạt
- Hệ thống hỗ trợ tìm kiếm cả tiếng Việt có dấu (`Nguyễn Văn Nam`) và không dấu (`nguyen van nam`), không phân biệt chữ hoa / chữ thường.
- Kết quả tra cứu hiển thị tức thì với độ trễ phản hồi $\le 100\text{ms}$.
- Khi chọn *"Xem trên cây"*, Canvas mượt mà di chuyển (Smooth Pan) đưa nhân vật được chọn vào đúng giữa màn hình với hiệu ứng sáng viền trong 2 giây.

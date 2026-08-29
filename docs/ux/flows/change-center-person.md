# Luồng Trải nghiệm: Đổi Người Trung tâm Khung nhìn (Change Center Person Flow)

- **Mã Flow:** `FLOW-TREE-01`
- **Mã Màn hình liên quan:** `SCR-009` (Tree Canvas Viewport)
- **Actor:** Người dùng duyệt cây gia phả
- **Mức độ Ưu tiên:** `MUST`

---

## 1. Sơ đồ Luồng Chuyển đổi Trọng tâm Quan sát (Mermaid Flowchart)

```mermaid
flowchart TD
    Start([1. Người dùng muốn đổi trọng tâm quan sát sang Person B]) --> TriggerEntry{Điểm kích hoạt}

    TriggerEntry -->|Từ Menu Node| ClickMenuCenter[Bấm '🎯 Đặt làm người trung tâm']
    TriggerEntry -->|Từ Tìm kiếm| ClickSearchTree[Bấm 'Xem trên cây' từ kết quả tra cứu]
    TriggerEntry -->|Từ Hồ sơ| ClickProfileCenter[Bấm 'Đặt làm trung tâm' trong Profile]
    TriggerEntry -->|Nhấp đúp vào Node| DoubleClickNode[Nhấp đúp chuột vào Node B trên Desktop]

    ClickMenuCenter --> AnimateViewport[Kích hoạt hiệu ứng Smooth Pan Canvas:\nDi chuyển tọa độ (X,Y) của B vào chính giữa màn hình]
    ClickSearchTree --> AnimateViewport
    ClickProfileCenter --> AnimateViewport
    DoubleClickNode --> AnimateViewport

    AnimateViewport --> HighlightNode[Node B nhận nhãn 'CENTER PERSON' và viền màu xanh đậm]
    HighlightNode --> ExpandImmediate[Tự động mở rộng và hiển thị các nhánh lân cận của B:\n- Cha Mẹ phía trên\n- Vợ/Chồng cùng hàng\n- Con cái phía dưới]

    ExpandImmediate --> CheckMobile{Môi trường thiết bị?}
    CheckMobile -->|Mobile| CollapseSheet[Tự động thu gọn Bottom Sheet xuống dạng Peek bar để lộ Canvas]
    CheckMobile -->|Desktop| KeepSidePanel[Cập nhật Side panel theo Person B mới]

    KeepSidePanel --> Ready([Sẵn sàng thao tác tiếp theo])
    CollapseSheet --> Ready
```

---

## 2. Đặc tả Chi tiết Trải nghiệm

### 2.1. Độc lập Hoàn toàn giữa Trọng tâm Quan sát và Huyết thống (`INV-007`)
- Việc đổi `Center Person` chỉ là **thay đổi góc nhìn của phiên làm việc hiện tại**, tuyệt đối không làm thay đổi hay xáo trộn bất kỳ mối quan hệ huyết thống nào trong CSDL.
- **Nút "Quay về Mặc định":** Góc dưới màn hình luôn có nút nổi `[ 🏠 Về người mốc / Tôi ]` giúp người dùng lập tức quay trở lại vị trí gốc nếu lỡ duyệt quá sâu vào các nhánh xa.

# Deferred Items: Phase P13

## 1. P13-T12: Thêm Người Giám Hộ (Guardian Flow)
- **Trạng thái:** DEFERRED.
- **Lý do kỹ thuật:** Enum `relationship_kind_type` trong PostgreSQL core schema P07 chỉ có các giá trị `('biological', 'adoptive', 'step', 'foster')`, chưa có `guardian`.
- **Ranh giới:** Không giả lập guardian thành `adoptive`, không nhồi nhét vào `biography`.
- **Kế hoạch:** Sẽ bổ sung giá trị `guardian` trong migration mở rộng schema giai đoạn sau khi nghiệp vụ pháp lý/giám hộ được chuẩn hóa.

## 2. P13-T08: Audit Foundation
- **Trạng thái:** DEFERRED_AUDIT.
- **Lý do:** Bảng `audit_logs` đầy đủ thuộc phạm vi triển khai của Phase P18 (System Audit).
- **Ranh giới:** Ghi nhận hợp đồng sự kiện `DEFERRED_AUDIT`, không tạo bảng tạm trái P18, không dùng `console.log` thay thế audit.

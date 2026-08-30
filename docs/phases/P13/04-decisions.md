# Quyết Định Kiến Trúc: Phase P13

## 1. DEC-P13-001: Phát Hiện Chu Trình Trực Tiếp Tại Cơ Sở Dữ Liệu
- **Quyết định:** Sử dụng hàm đệ quy PostgreSQL `_system.check_parent_child_cycle` trong schema `_system` chạy với `SECURITY DEFINER` và `SET search_path = public, _system, pg_temp;`.
- **Lý do:** Bảo vệ tính bất biến đồ thị không chu trình (DAG) ở mức dữ liệu cốt lõi, ngăn ngừa hoàn toàn tình trạng chu trình do lỗi client hoặc gọi API ngoài.

## 2. DEC-P13-002: Hoãn Lại Field Guardian (`P13-T12`)
- **Quyết định:** Ghi nhận `P13-T12` là `DEFERRED` do enum `relationship_kind_type` của P07 chưa có giá trị `guardian`.
- **Lý do:** Giữ nguyên vẹn tính nhất quán của schema migration P07.

## 3. DEC-P13-003: Phân Tách Union và Quan Hệ Huyết Thống
- **Quyết định:** Không suy diễn con cái từ Union và không gộp bảng `unions` vào `parent_child_relationships`.
- **Lý do:** Phù hợp với thực tế phả hệ Việt Nam (quan hệ con nuôi, con riêng, con ngoài giá thú, nhiều đời vợ).

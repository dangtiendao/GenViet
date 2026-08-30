# Báo Cáo Nghiệm Thu Mở Rộng Tổ Tiên Từ Node Bất Kỳ (Ancestor Expansion Report - P26-T13)

- **Mục tiêu:** Xác minh chức năng mở rộng tổ tiên (Expand Ancestors) hoạt động chính xác từ bất kỳ node nào đang hiển thị trên đồ thị chứ không chỉ từ Center Person.
- **Trạng thái:** `PASS`

---

## 1. Kết Quả Kiểm Thử Chi Tiết
1. **Mở Rộng Từ Center Node:** Tải thêm các tầng tổ tiên phía trên người trung tâm và cập nhật đồ thị mượt mà.
2. **Mở Rộng Từ Node Nhánh (Parent/Ancestor Node):** Chọn một node cha/mẹ ở rìa đồ thị và nhấn "Mở rộng tổ tiên", hệ thống gửi yêu cầu với `centerPersonId` tương ứng và nạp thêm thế hệ phía trên mà không làm đổi người trung tâm chính ngoài ý muốn.
3. **Chống Trùng Lặp & Giữ Viewport:**
   - Dữ liệu mới nạp được hợp nhất (merge) vào đồ thị hiện tại mà không tạo node/cạnh trùng lặp.
   - Giữ nguyên vị trí cuộn canvas (Viewport Anchor), không bị giật hay nhảy vị trí bất ngờ.

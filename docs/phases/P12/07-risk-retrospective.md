# Đánh Giá Rủi Ro & Bài Học Kinh Nghiệm (Retrospective): Phase P12

## 1. Rủi Ro Đã Nhận Diện & Biện Pháp Kiểm Soát
1. **Rủi ro tạo ngày giả 01/01 (Vi phạm INV-002):**
   - *Kiểm soát:* Tách biệt trường `birth_date` và `birth_year` ở tầng DB, DAL và Form. Khi precision là `year`, `birth_date` luôn là `NULL`.
2. **Rủi ro xung đột ghi đè đồng thời:**
   - *Kiểm soát:* Ép buộc `expectedVersion` trong câu lệnh UPDATE và RPC restore. Giao diện có thông báo lỗi và nút tải lại dữ liệu tức thời.
3. **Rủi ro xóa nhầm Generation Anchor của cây gia phả:**
   - *Kiểm soát:* Service layer kiểm tra `generation_anchor_person_id` trên `family_trees` trước khi cho phép xóa mềm.

## 2. Bài Học Cho Phase P13
- Phase P13 sẽ chịu trách nhiệm thiết lập các liên kết quan hệ (`parent_child_relationships`, `unions`, `union_members`) và kiểm tra chu trình (Cycle Detection). Cần bảo đảm validation cùng Tree ID chặt chẽ và không cho phép một người tự làm cha/mẹ của chính mình.

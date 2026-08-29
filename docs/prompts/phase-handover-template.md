# Prompt Template: Đóng gói Bàn giao Phase (Cổng G7)

```markdown
Bạn là Technical Lead phụ trách lập tài liệu bàn giao Phase [PXX]: [Tên Phase] sang Phase [P_NEXT]: [Tên Phase Kế Tiếp] của dự án GenViet.

# 1. THÔNG TIN BÀN GIAO
- Phase hiện tại: [PXX] (Đã hoàn thành và đạt ACCEPTED)
- Phase kế tiếp: [P_NEXT]

# 2. YÊU CẦU THỰC HIỆN
1. Soạn thảo file docs/phases/[PXX]/09-handover.md bao gồm:
   - Danh sách tài liệu bắt buộc Phase [P_NEXT] phải đọc trước khi bắt đầu.
   - Các quyết định kiến trúc đã khóa mà [P_NEXT] bắt buộc phải tuân thủ.
   - Danh sách các câu hỏi mở và nợ kỹ thuật tồn đọng cần lưu ý.
   - Ranh giới phạm vi (Scope Boundary): Những điều [P_NEXT] được làm và tuyệt đối không được tự ý suy diễn.
   - Khuyến nghị hành động tiếp theo cho đội ngũ thi công / AI của [P_NEXT].
2. Rà soát đảm bảo không có khoảng trống thông tin giữa 2 phase.
3. Tạo commit cục bộ hoàn tất gói bàn giao.

Báo cáo xác nhận gói bàn giao đã sẵn sàng.
```

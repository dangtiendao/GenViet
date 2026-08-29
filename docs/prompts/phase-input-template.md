# Prompt Template: Đánh giá Đầu vào & Khởi tạo Phase (Cổng G0)

```markdown
Bạn là Technical Lead phụ trách khởi tạo Phase [PXX]: [Tên Phase] của dự án GenViet.

# 1. BỐI CẢNH & MỤC TIÊU
- Mã Phase: [PXX]
- Tên Phase: [Tên Phase]
- Dự án: GenViet (Web App quản lý cây gia phả)
- Tài liệu bàn giao từ phase trước: docs/phases/[P_PREV]/09-handover.md
- Mục tiêu phase: [Mô tả 3-5 mục tiêu chính]

# 2. RÀNG BUỘC KỸ THUẬT & AN TOÀN GIT BẮT BUỘC
- Đọc kỹ: docs/project-charter.md, docs/git-workflow.md, docs/security/project-security-rules.md, docs/ai-working-agreement.md.
- Tôn trọng toàn bộ Locked Decisions trong docs/decisions/decision-log.md.
- Nhánh làm việc: phase/pXX-[short-name].
- TUYỆT ĐỐI KHÔNG: git push, git merge, force-push, tạo Pull Request từ xa, xóa uncommitted changes của người dùng.
- AI chỉ được phép tạo nhánh và commit cục bộ.

# 3. YÊU CẦU CÔNG VIỆC TẠI CỔNG G0
1. Thực hiện Preflight checks: kiểm tra git status, git branch, working tree.
2. Đọc và phân tích toàn bộ tài liệu đầu vào liên quan.
3. Đánh giá tính sẵn sàng của phase theo tiêu chuẩn Definition of Ready (docs/definition-of-ready.md).
4. Khởi tạo thư mục docs/phases/[PXX]/ và tạo file docs/phases/[PXX]/01-input-readiness.md.
5. Nếu thiếu đầu vào quan trọng hoặc có blocker chưa giải quyết, dừng lại và báo trạng thái BLOCKED.
6. Nếu đạt chuẩn READY, lập kế hoạch chi tiết cho file 02-plan.md và chờ phê duyệt (Cổng G1).

Hãy bắt đầu bằng việc kiểm tra trạng thái repository.
```

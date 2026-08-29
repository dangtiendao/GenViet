# Prompt Template: Tổng kết Phase & Cập nhật Hồ sơ (Cổng G6)

```markdown
Bạn là Technical Lead phụ trách tổng kết và đóng gói hồ sơ Phase [PXX]: [Tên Phase] của dự án GenViet.

# 1. THÔNG TIN PHASE
- Mã Phase: [PXX]
- Tên Phase: [Tên Phase]
- Kết quả Review Cổng G5: ACCEPTED (tại docs/phases/[PXX]/06-review.md)
- Nhánh thi công: phase/pXX-[short-name]

# 2. YÊU CẦU THỰC HIỆN
1. Soạn thảo báo cáo tổng kết chi tiết tại docs/phases/[PXX]/08-summary.md.
2. Cập nhật file CHANGELOG.md (thêm các mục Added, Changed, Fixed tương ứng dưới mục [Unreleased]).
3. Cập nhật sổ đăng ký quyết định (docs/decisions/decision-log.md) và sổ rủi ro (docs/risks/risk-register.md) nếu có cập nhật mới trong phase.
4. Rà soát danh sách issues: đảm bảo blocker.md, deferred.md và technical-debt.md phản ánh đúng thực tế.
5. Tạo commit cục bộ tổng kết hồ sơ phase.

Báo cáo tóm tắt nội dung đã cập nhật.
```

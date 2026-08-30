# Hồ Sơ Nghiệm Thu Phase P14: API Vùng Cây (Tree Graph API)

## 1. Thông Tin Chung
- **Mã Phase:** `P14`
- **Tên Phase:** API vùng cây (Tree Graph API / Bounded Graph Slice API)
- **Dự Án:** GenViet (Responsive Web App Quản lý Cây Gia Phả v0.1)
- **Trạng Thái Nghiệm Thu:** **ACCEPTED**
- **Nhánh Thi Công:** `phase/p14-tree-graph-api`

---

## 2. Mục Tiêu Phase
1. Xây dựng phân hệ API truy vấn lát cắt đồ thị phả hệ xung quanh nhân vật trung tâm (**Center Person**).
2. Duyệt tổ tiên (**Ancestors**) và hậu duệ (**Descendants**) hai chiều theo độ sâu (`depth = 0..5`).
3. Truy vấn phối ngẫu và các liên kết hôn nhân (**Unions**) chính xác.
4. Cung cấp **Expansion Metadata** (`hasMoreAncestors`, `hasMoreDescendants`, `canAddFather`, `canAddMother`).
5. Áp dụng giới hạn an toàn (**Graph Budgets**): Tối đa 250 Persons, 500 Relationships, 150 Unions.
6. Bảo đảm tính độc lập hoàn toàn với React Flow và ELK.js (Không chứa tọa độ `x, y`).
7. Thiết lập tiêu chuẩn Cache Key tất định và ma trận Invalidation.
8. Hoàn tất bộ kiểm thử tự động (Unit, Integration, E2E, pgTAP) đạt tỷ lệ vượt qua 100%.

---

## 3. Danh Sách Tài Liệu Giai Đoạn
1. [`00-overview.md`](file:///e:/Project/GenViet/docs/phases/P14/00-overview.md): Tổng quan giai đoạn P14.
2. [`01-input-readiness.md`](file:///e:/Project/GenViet/docs/phases/P14/01-input-readiness.md): Đánh giá sẵn sàng đầu vào.
3. [`02-plan.md`](file:///e:/Project/GenViet/docs/phases/P14/02-plan.md): Kế hoạch thi công chi tiết.
4. [`03-task-breakdown.md`](file:///e:/Project/GenViet/docs/phases/P14/03-task-breakdown.md): Bảng phân rã task P14-T01 đến P14-T20.
5. [`04-decisions.md`](file:///e:/Project/GenViet/docs/phases/P14/04-decisions.md): Các quyết định kỹ thuật đã chốt.
6. [`05-test-plan.md`](file:///e:/Project/GenViet/docs/phases/P14/05-test-plan.md): Kế hoạch và kết quả kiểm thử.
7. [`06-review.md`](file:///e:/Project/GenViet/docs/phases/P14/06-review.md): Báo cáo đánh giá độc lập.
8. [`07-re-review.md`](file:///e:/Project/GenViet/docs/phases/P14/07-re-review.md): Báo cáo tái đánh giá chất lượng.
9. [`08-summary.md`](file:///e:/Project/GenViet/docs/phases/P14/08-summary.md): Báo cáo tổng kết hoàn thành phase.
10. [`09-handover.md`](file:///e:/Project/GenViet/docs/phases/P14/09-handover.md): Bàn giao sang Phase P15.
11. [`issues/deferred.md`](file:///e:/Project/GenViet/docs/phases/P14/issues/deferred.md): Các vấn đề hoãn lại cho các phase sau.

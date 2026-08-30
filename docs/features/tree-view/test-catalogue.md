# Test Catalogue: Tree Visualization (Phase P15)

## 1. Unit & Component Test Suites (Vitest)

| File Test | Nội Dung Kiểm Thử | Số lượng test | Kết quả |
| :--- | :--- | :---: | :---: |
| `tests/unit/tree-view/projection.test.ts` | Chuyển đổi DTO sang Layout Graph, đa hôn nhân, thiếu cha/mẹ, thu gọn nhánh | 4 | **PASS** |
| `tests/unit/tree-view/elk-adapter.test.ts` | Bố cục ELK: đơn nhân vật, phân tầng Cha trên - Con dưới, không overlap anh em, cây sâu 5 đời | 4 | **PASS** |
| `tests/unit/tree-view/presentation-mapper.test.ts` | Ánh xạ sang React Flow Nodes & Edges, gán Center và Selection | 1 | **PASS** |
| `tests/unit/tree-view/viewport-anchor.test.ts` | Tính toán neo giữ vị trí Center Person khi cấu trúc cây thay đổi | 2 | **PASS** |
| `tests/unit/tree-view/fingerprint.test.ts` | Layout fingerprint giữ nguyên khi chỉ đổi selection / mở detail | 2 | **PASS** |
| `tests/unit/tree-view/person-node.test.tsx` | Render họ tên, năm sinh, huy hiệu Tâm điểm, nút mở rộng tổ tiên / hậu duệ | 3 | **PASS** |
| `tests/unit/tree-view/tree-controls.test.tsx` | Render các nút Zoom In, Zoom Out, Fit View, Fullscreen | 2 | **PASS** |

## 2. Playwright E2E Test Suites

| File Test | Nội Dung Kiểm Thử | Số lượng test | Kết quả |
| :--- | :--- | :---: | :---: |
| `tests/e2e/tree-view.spec.ts` | Chặn truy cập chưa đăng nhập (/login redirect), kiểm tra responsive không tràn ngang (375x667, 320x568) | 2 | **PASS** |

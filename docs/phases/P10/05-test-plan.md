# Kế hoạch Kiểm thử Hệ thống Giao diện: Phase P10 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các kịch bản kiểm thử cho các UI components và responsive shell trong Phase P10.

---

## 1. Ma trận Kịch bản Kiểm thử

### Nhóm 1: UI Component Primitives (Unit Tests)
- **TEST-01:** `Button` render đúng variant, size, loading indicator, disabled state và `asChild` composition $\rightarrow$ `PASS` (`tests/unit/ui/button.test.tsx`).
- **TEST-02:** `Input` render đúng standard styling, error state với `aria-invalid`, disabled state $\rightarrow$ `PASS` (`tests/unit/ui/input.test.tsx`).
- **TEST-03:** `PartialDateInput` chuyển đổi precision an toàn, không tạo ngày 01/01 giả, hỗ trợ cờ ước tính $\rightarrow$ `PASS` (`tests/unit/ui/partial-date-input.test.tsx`).
- **TEST-04:** `Navigation` cấu hình số lượng tab $\le 5$ trên mobile, label tiếng Việt rõ ràng $\rightarrow$ `PASS` (`tests/unit/ui/navigation.test.ts`).
- **TEST-05:** `EmptyState` và `ErrorState` render đầy đủ CTA buttons và error codes $\rightarrow$ `PASS` (`tests/unit/ui/feedback-states.test.tsx`).

### Nhóm 2: Responsive Shell & Overlays (Playwright E2E Tests)
- **TEST-06:** Desktop Viewport (1280x800) hiển thị Sidebar và ẩn Mobile Navigation $\rightarrow$ `PASS` (`tests/e2e/responsive-shell.spec.ts`).
- **TEST-07:** Dialog modal mở, bẫy tiêu điểm (Focus trap) và đóng bằng phím `Escape` $\rightarrow$ `PASS`.
- **TEST-08:** Toast notification kích hoạt và tự động đóng $\rightarrow$ `PASS`.
- **TEST-09:** Mobile Viewports (375x667 và 320x568) không bị tràn ngang (`scrollWidth <= innerWidth`) $\rightarrow$ `PASS`.
- **TEST-10:** Mobile Bottom Sheet mở trượt và đóng bằng nút bấm rõ ràng $\rightarrow$ `PASS`.

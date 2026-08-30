# Phase Overview: P10 - Khung Giao diện Responsive (Responsive UI Shell)

- **Mã Phase:** `P10`
- **Tên Phase:** Khung giao diện responsive (Responsive UI Shell & Design System)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p10-responsive-ui-shell`
- **Starting Commit:** `f804c0e` (Merge PR #9 for P09)
- **Vai trò thi công:** Principal UI Engineer, Design System Engineer, Responsive Web Engineer & Accessibility Reviewer
- **Thời gian thực hiện:** 2026-08-30

---

## 1. Mục tiêu của Phase P10

1. Xây dựng nền tảng Design Tokens thống nhất (Màu sắc Semantic, Typography Scale, Spacing Scale, Breakpoints).
2. Xây dựng bộ UI Primitives có tính tái sử dụng cao (`Button`, `Input`, `Select`, `Dialog`, `Drawer`, `BottomSheet`, `Toast`, `Skeleton`).
3. Xây dựng bộ điều khiển chuyên dụng cho phả hệ `PartialDateInput` hỗ trợ dữ liệu ngày không đầy đủ (chỉ biết năm, tháng/năm, không rõ).
4. Xây dựng các trạng thái phản hồi `EmptyState`, `ErrorState` và hệ thống thông báo `Toast`.
5. Xây dựng khung giao diện `AppShell` đáp ứng: Desktop Sidebar ($\ge 1024\text{px}$) và Mobile Bottom Navigation ($< 1024\text{px}$).
6. Tích hợp `AppHeader` và thanh điều hướng `AppBreadcrumb`.
7. Đảm bảo toàn diện khả năng tiếp cận WCAG 2.2 AA (Keyboard Tab navigation, Focus Trap, Focus Rings, Touch Targets $\ge 44\times 44\text{px}$).
8. Chuẩn bị sẵn sàng bộ component UI để bàn giao cho các phase nghiệp vụ tiếp theo (`P11: Quản trị Cây gia phả`, `P12: Quản trị Nhân vật`).

---

## 2. Ranh giới Nghiêm ngặt

- ❌ **Không triển khai nghiệp vụ Family Tree CRUD, Person CRUD hay Relationship CRUD** (Thuộc Phase P11 - P13).
- ❌ **Không triển khai Canvas đồ thị React Flow hay ELK layout** (Thuộc Phase P15).
- ❌ **Không thay đổi CSDL, không tạo migration mới, không thay đổi RLS.**
- ❌ **Không thay đổi Auth logic P09.**
- ❌ **Không push Git remote, không merge và không tạo Pull Request.**

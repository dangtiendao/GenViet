# ADR-0008: Sử dụng React Flow làm Thư viện Trình bày Đồ thị Tương tác

- **Mã Quyết định:** `ADR-0008`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Sử dụng thư viện **React Flow (xyflow)** làm công cụ hiển thị đồ thị tương tác trên máy khách (Client Component).
- **Ranh giới:** React Flow **chỉ đóng vai trò là tầng Trình bày (Presentation Layer)**, nhận danh sách Node và Edge đã có sẵn tọa độ `(x, y)` từ thuật toán ELK để vẽ lên màn hình.
- **Quy tắc:** React Flow không phải nguồn dữ liệu phả hệ. Thao tác kéo thả trên canvas không tự ý thay đổi quan hệ cha mẹ trong CSDL nếu không qua Server Action. Cung cấp màn hình Tìm kiếm/Danh sách (`SCR-010`) làm phương án thay thế cho Accessibility (Screen Readers).

## 2. Hệ quả
- **Tích cực:** Tận dụng hệ sinh thái phong phú của React Flow (Custom Nodes, Smooth Pan/Zoom, Viewport management, Touch gestures).
- **Tiêu cực:** React Flow là thư viện Client-only, phải bọc trong Client Component và tối ưu hóa re-render khi số lượng node tăng lên.

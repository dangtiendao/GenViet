# Accessibility (a11y) & Alternative Pathways

## 1. Hỗ Trợ Tiếp Cận Trên Canvas
- `PersonNode` có `tabIndex={0}`, `role="button"`, và `aria-label` chứa thông tin tên và năm sinh/mất.
- Hỗ trợ phím `Enter` và `Space` để chọn node.
- Các nút điều khiển Viewport (Phóng to, Thu nhỏ, Toàn cảnh, Toàn màn hình) đều có `aria-label` và `title` rõ ràng.

## 2. Lối Đi Thay Thế Cho Trình Đọc Màn Hình (Screen Reader Alternative)
- Do sơ đồ không gian 2D trên Canvas có độ phức tạp cao đối với Screen Reader, GenViet cung cấp song song liên kết trực tiếp tới **Danh sách nhân vật (`/trees/[treeId]/people`)** và **Trang cá nhân (`/trees/[treeId]/people/[personId]`)** cho phép duyệt tuần tự thế hệ một cách tường minh và đầy đủ.

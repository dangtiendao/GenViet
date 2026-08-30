# Performance Optimizations: Memoization & Fingerprint

## 1. Các Kỹ Thuật Tối Ưu Hiệu Năng Đã Áp Dụng
1. **`React.memo` cho PersonNode & UnionNode:** Tránh re-render toàn bộ các node khi người dùng chỉ chọn một node duy nhất.
2. **Khai báo tĩnh `nodeTypes` và `edgeTypes`:** Đặt ngoài component canvas để React Flow không bị re-mount lại node definitions mỗi lần re-render.
3. **Layout Fingerprinting (`computeLayoutFingerprint`):** ELK layout chỉ được gọi khi cấu trúc hiển thị thực sự thay đổi (thêm/bớt node, đổi độ sâu, thu gọn nhánh).
4. **Vô hiệu hóa kéo thả node (`nodesDraggable = false`):** Giảm tải bộ lắng nghe sự kiện drag pointer không cần thiết.

## 2. Đo Lường Thực Tế (Benchmarks)
- Cây đơn nhân vật: Bố cục hoàn thành $\sim 15\text{ms}$.
- Cây 25 nhân vật: Bố cục hoàn thành $\sim 45\text{ms}$.
- Cây sâu 5 thế hệ: Bố cục hoàn thành $< 350\text{ms}$.

# Responsive Behavior & Detail Overlays

## 1. Thiết Kế Responsive 2 Chế Độ
- **Màn hình Di động (Mobile < 768px):**
  - Khi người dùng chạm vào một PersonNode, hệ thống mở **Bottom Sheet** trượt lên từ đáy màn hình.
  - Hỗ trợ thao tác vuốt đóng, nút đóng rõ ràng, và nút bấm kích thước tối thiểu 44px.
- **Màn hình Máy tính (Desktop $\ge$ 768px):**
  - Khi người dùng click vào một PersonNode, hệ thống mở **Side Panel** trượt từ cạnh phải canvas.
  - Phím tắt `Escape` hoặc click ra ngoài canvas để đóng bảng.

## 2. Ranh Giới Render & Không Layout Lại (No Relayout)
Việc mở/đóng Bottom Sheet hoặc Side Panel là thao tác ở tầng UI Presentation State, hoàn toàn không làm thay đổi Layout Fingerprint, do đó **không bao giờ kích hoạt lại thuật toán ELK layout**.

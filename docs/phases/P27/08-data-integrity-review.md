# Đánh Giá Toàn Vẹn Dữ Liệu Phase P27 (Data Integrity Review)

## 1. Kết Quả Rà Soát Toàn Vẹn Dữ Liệu
- **Bảo Toàn Bất Biến Phả Hệ (Invariants):** Không tạo chu trình (Acyclic Graph Trigger), không tự làm cha/mẹ chính mình.
- **Gộp Hồ Sơ An Toàn:** Kiểm tra phiên bản lạc quan (Optimistic Concurrency), chuyển toàn bộ quan hệ/sự kiện/ảnh nguyên tử, xóa mềm (tombstone) hồ sơ bị gộp và ghi nhận nhật ký kiểm toán.
- **Bảo Toàn Tệp Gốc Media:** Quy trình di chuyển sang R2 không bao giờ xóa tệp gốc tại Supabase Storage.

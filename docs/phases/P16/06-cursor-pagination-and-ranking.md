# Phase P16: Phân Trang Cursor & Xếp Hạng Kết Quả (Cursor Pagination & Ranking)

## 1. Cơ Chế Mã Hóa Cursor
- Token dạng Base64 URL-safe, bao gồm các thành phần:
  - `rankTier`: 1 đến 5.
  - `similarity`: Độ tương đồng trigram (làm tròn 4 số thập phân).
  - `normalizedName`: Tên đã chuẩn hóa.
  - `birthYear`: Năm sinh (hoặc `null`).
  - `id`: UUID của nhân vật.

---

## 2. Ưu Điểm So Với Offset Pagination
1. Không bị trùng lặp bản ghi giữa các trang khi dữ liệu gia phả được cập nhật.
2. Tận dụng tối đa Composite Indexes, không tốn tài nguyên quét bỏ qua `OFFSET N`.
3. An toàn, không lộ chi tiết truy vấn nội bộ ra ngoài URL.

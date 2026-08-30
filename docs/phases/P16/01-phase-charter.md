# Phase P16: Điều Lệ Phase Tìm Kiếm (Phase Charter)

## 1. Thông Tin Chung
- **Mã Phase:** P16
- **Tên Phase:** Tìm kiếm
- **Dự Án:** GenViet (Responsive Web App Quản Lý Gia Phả)
- **Phiên Bản Mục Tiêu:** v0.1
- **Phạm Vi:** Tìm kiếm Person không dấu, bộ lọc nâng cao, chỉ mục PostgreSQL, phân trang cursor, highlight an toàn và ngữ cảnh cha mẹ.

---

## 2. Mục Tiêu Cốt Lõi
1. Cung cấp chức năng tìm kiếm hồ sơ nhân vật theo họ tên tiếng Việt có dấu và không dấu chính xác tuyệt đối.
2. Xây dựng các chỉ mục GIN Trigram và B-Tree tối ưu cho phép tra cứu tức thì dưới 10ms.
3. Hỗ trợ lọc theo năm sinh, trạng thái sống và hồ sơ thiếu thông tin.
4. Triển khai phân trang deterministic bằng cursor mã hóa an toàn.
5. Hiển thị ngữ cảnh Cha Mẹ để phân biệt người trùng tên trong cùng dòng họ.
6. Liên kết liền mạch với chi tiết hồ sơ P12 và sơ đồ cây tương tác P15.

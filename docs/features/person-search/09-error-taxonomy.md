# 09 - Bảng Phân Loại Mã Lỗi (Error Taxonomy Section 46)

## 1. Danh Mục Mã Lỗi Tìm Kiếm Nhân Vật

| Mã Lỗi | Mô tả | Có thể thử lại (Retryable) |
| :--- | :--- | :---: |
| `PERSON_SEARCH_TREE_INVALID` | Mã cây gia phả không hợp lệ | Không |
| `PERSON_SEARCH_FORBIDDEN` | Bạn không có quyền tìm kiếm trong cây gia phả này | Không |
| `PERSON_SEARCH_QUERY_INVALID` | Từ khóa tìm kiếm không hợp lệ | Không |
| `PERSON_SEARCH_QUERY_TOO_SHORT` | Từ khóa tìm kiếm quá ngắn | Không |
| `PERSON_SEARCH_BIRTH_YEAR_INVALID` | Năm sinh tìm kiếm không hợp lệ (100 - 2500) | Không |
| `PERSON_SEARCH_LIVING_STATUS_INVALID` | Trạng thái sống không hợp lệ | Không |
| `PERSON_SEARCH_FILTER_INVALID` | Bộ lọc tìm kiếm không hợp lệ | Không |
| `PERSON_SEARCH_CURSOR_INVALID` | Dấu phân trang (cursor) không hợp lệ hoặc đã hết hạn | Có |
| `PERSON_SEARCH_LIMIT_EXCEEDED` | Số lượng kết quả yêu cầu vượt quá giới hạn cho phép | Không |
| `PERSON_SEARCH_EXTENSION_UNAVAILABLE` | Tiện ích mở rộng unaccent/pg_trgm chưa sẵn sàng trên CSDL | Có |
| `PERSON_SEARCH_QUERY_FAILED` | Không thể thực thi tìm kiếm lúc này | Có |
| `PERSON_SEARCH_TIMEOUT` | Thời gian xử lý tìm kiếm quá lâu | Có |
| `PERSON_SEARCH_UNKNOWN_ERROR` | Đã xảy ra lỗi không xác định khi tìm kiếm | Có |

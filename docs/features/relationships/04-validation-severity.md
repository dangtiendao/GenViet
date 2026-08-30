# Validation Severity & Error Taxonomy

## 1. Phân Loại Mức Độ Nghiêm Trọng

### 1.1. Lỗi Chặn Tuyệt Đối (Blocking Errors - Không Thể Override)
Các trường hợp vi phạm bất biến dữ liệu, an ninh, hoặc logic toán học của đồ thị:
- `RELATIONSHIP_CYCLE`: Tạo chu trình thế hệ trong đồ thị.
- `RELATIONSHIP_SELF_LINK`: Tự làm cha/mẹ/con của chính mình.
- `UNION_SELF_LINK`: Tự kết hôn với chính mình.
- `RELATIONSHIP_TREE_MISMATCH`: Liên kết nhân vật thuộc cây gia phả khác.
- `RELATIONSHIP_DUPLICATE`: Trùng lặp chính xác quan hệ đang active.
- `RELATIONSHIP_FORBIDDEN`: Không có quyền ghi (Viewer hoặc Outsider).
- `RELATIONSHIP_VERSION_CONFLICT`: Xung đột ghi đè phiên bản.

### 1.2. Cảnh Báo Cần Xác Nhận (Warning Requires Confirmation)
Các trường hợp có thể đúng trong thực tế nhưng bất thường hoặc cần người dùng xác nhận rõ ràng:
- `RELATIONSHIP_EXISTING_VERIFIED_FATHER`: Đã có cha ruột được xác minh.
- `RELATIONSHIP_EXISTING_VERIFIED_MOTHER`: Đã có mẹ ruột được xác minh.
- `UNION_OVERLAP_WARNING`: Trùng lặp khoảng thời gian hôn nhân.

### 1.3. Thông Tin Bổ Sung (Information)
- Nhân vật mới chưa có ngày sinh/mất đầy đủ.
- Quan hệ được lưu ở trạng thái chưa xác minh (`unverified`).

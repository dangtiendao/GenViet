# Bộ Mẫu Giao diện Cảnh báo & Lỗi Quan hệ (Relationship Warning UX Patterns)

- **Mã tài liệu:** `UX-PATTERNS-REL-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Trình bày Lỗi & Cảnh báo Quan hệ

1. **Không Dùng Màu Sắc Làm Tín hiệu Duy nhất (`UXR-007`, `A11Y-005`):** Mọi cảnh báo đều đi kèm Biểu tượng đặc thù (`Icon`) và Văn bản giải thích rõ ràng.
2. **Ngôn ngữ Dân dã, Dễ hiểu:** Tuyệt đối không dùng thuật ngữ toán học hay đồ thị như *"Cycle detected"*, *"DAG violation"*, *"Foreign key conflict"*.
3. **Luôn Cung cấp Lối thoát & Hướng xử lý:** Nếu bị chặn, giải thích cụ thể người dùng cần quay lại sửa ở đâu.

---

## 2. Danh mục Mẫu Giao diện theo Cấp độ Nghiêm trọng

### 2.1. Nhóm Lỗi Bắt buộc Chặn (BLOCKING_ERROR - Nền đỏ / Icon Khiên cấm 🚫)
*Hành động vi phạm bất biến phả học. Nút Lưu bị vô hiệu hóa hoàn toàn, hiển thị thẻ thông báo lỗi.*

```text
┌────────────────────────────────────────────────────────┐
│ 🚫 KHÔNG THỂ THIẾT LẬP QUAN HỆ NÀY                     │
├────────────────────────────────────────────────────────┤
│ [ERR-002] Nguyễn Văn A đang là con/cháu của Nguyễn     │
│ Văn B. Thiết lập B làm con của A sẽ tạo thành vòng     │
│ lặp thế hệ phi lý trong gia phả.                       │
│                                                        │
│ 💡 Gợi ý xử lý: Vui lòng kiểm tra lại quan hệ hiện có │
│ của Nguyễn Văn B trước khi nối.                       │
├────────────────────────────────────────────────────────┤
│                     [ ← QUAY LẠI CHỌN NGƯỜI KHÁC ]     │
└────────────────────────────────────────────────────────┘
```

| Mã Lỗi | Tình huống Nghiệp vụ | Thông báo Người dùng Hiển thị trên Giao diện |
| :--- | :--- | :--- |
| **`ERR-001`** | Tự làm Cha/Mẹ của chính mình | *"Một người không thể là cha hoặc mẹ của chính bản thân mình."* |
| **`ERR-002`** | Chu trình vòng lặp thế hệ | *"Không thể tạo quan hệ này vì [Tên A] sẽ đồng thời trở thành tổ tiên và con cháu của chính mình."* |
| **`ERR-003`** | Tự kết hôn với chính mình | *"Một người không thể tự thiết lập quan hệ hôn nhân với chính mình."* |
| **`ERR-004`** | Liên kết chéo cây gia phả | *"Không thể liên kết thành viên thuộc hai cây gia phả khác nhau."* |
| **`ERR-005`** | Ngày mất trước ngày sinh | *"Năm mất ([Năm mất]) không thể diễn ra trước năm sinh ([Năm sinh])."* |
| **`ERR-006`** | Quan hệ hôn nhân trùng lặp | *"Hai thành viên này đã có quan hệ hôn nhân đang hoạt động trong cây."* |

---

### 2.2. Nhóm Cảnh báo Cần Xác nhận (WARNING_REQUIRES_CONFIRMATION - Nền vàng cam / Icon Tam giác ⚠️)
*Dữ liệu có dấu hiệu bất thường hoặc có khả năng tranh chấp lịch sử. Hệ thống yêu cầu đọc và xác nhận.*

```text
┌────────────────────────────────────────────────────────┐
│ ⚠️ CẦN XÁC NHẬN THÔNG TIN QUAN HỆ                      │
├────────────────────────────────────────────────────────┤
│ [WARN-001] Nguyễn Văn A đã có Cha ruột là "Cụ Nguyễn   │
│ Văn B".                                                │
│                                                        │
│ Bạn đang chọn thêm "Cụ Nguyễn Văn C" làm Cha ruột.     │
│                                                        │
│ Hãy chọn cách xử lý:                                   │
│ (•) Lưu "Cụ C" dưới dạng Chưa xác minh (UNVERIFIED)    │
│ ( ) Thay thế "Cụ B" bằng "Cụ C" làm Cha ruột chính thức│
├────────────────────────────────────────────────────────┤
│         [ Hủy bỏ ]   [ XÁC NHẬN VÀ LƯU THAY ĐỔI ]      │
└────────────────────────────────────────────────────────┘
```

| Mã Cảnh báo | Tình huống Nghiệp vụ | Thông báo & Lựa chọn Người dùng |
| :--- | :--- | :--- |
| **`WARN-001`** | Thêm Cha/Mẹ ruột thứ 2 | *"Thành viên này đã có Cha/Mẹ ruột đã xác nhận. Bạn muốn lưu ở dạng Chưa xác minh hay Thay thế phụ mẫu cũ?"* |
| **`WARN-002`** | Khoảng cách tuổi bất thường | *"Khoảng cách tuổi giữa phụ mẫu và con là [X] năm (bất thường). Bạn có chắc chắn thông tin này chính xác?"* |
| **`WARN-003`** | Hôn nhân chồng lấn thời gian | *"Thành viên này đang có nhiều cuộc hôn nhân cùng có hiệu lực. Bạn có muốn tiếp tục ghi nhận?"* |
| **`WARN-005`** | Phát hiện hồ sơ trùng tên/tuổi | *"Tìm thấy hồ sơ [Tên người] có năm sinh và phụ mẫu tương đồng. Bạn muốn tạo người mới hay liên kết hồ sơ có sẵn?"* |

---

### 2.3. Nhóm Thông tin Hướng dẫn (INFORMATION - Nền xanh lam / Icon Chữ i ℹ️)
- **`INFO-001` (Thành viên chưa có phụ mẫu):** Hiển thị nút bấm viền nét đứt mờ `[ + Thêm Cha ]`, `[ + Thêm Mẹ ]`.
- **`INFO-002` (Số đời chưa xác định):** Hiển thị nhãn mờ `Đời: Chưa nối mốc` kèm tooltip giải thích.

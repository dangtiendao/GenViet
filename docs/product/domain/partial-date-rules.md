# Quy tắc Xử lý Ngày tháng Không đầy đủ & Ước tính (Partial & Estimated Date Rules)

- **Mã tài liệu:** `DOM-DATE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Các Cấp độ Chính xác của Ngày tháng (Date Precision Levels)

Trong gia phả học, việc chỉ nhớ năm sinh (ví dụ: "Cụ sinh năm 1920") hoặc khoảng thời gian (ví dụ: "Mất khoảng trước năm 1945") là cực kỳ phổ biến. Hệ thống quy định 7 cấp độ chính xác:

| Cấp độ chính xác | Mã Precision Enum | Ví dụ Dữ liệu | Cách hiển thị trên UI |
| :--- | :---: | :--- | :--- |
| **Ngày Chính xác** | `EXACT` | `1954-10-10` | `10/10/1954` |
| **Tháng và Năm** | `MONTH_YEAR` | `1954-10` | `10/1954` |
| **Chỉ có Năm** | `YEAR_ONLY` | `1954` | `1954` |
| **Ước tính / Khoảng năm** | `APPROXIMATE` | `~1950` | `Khoảng 1950` (hoặc `Thập niên 1950s`) |
| **Trước một Mốc** | `BEFORE_YEAR` | `<1945` | `Trước năm 1945` |
| **Sau một Mốc** | `AFTER_YEAR` | `>1975` | `Sau năm 1975` |
| **Hoàn toàn Không rõ** | `UNKNOWN` | `NULL` | *(Để trống hoặc hiển thị "-")* |

---

## 2. Các Quy tắc Xử lý Ngày tháng Cốt lõi

### `PDR-001`: Cấm Tự động Điền Ngày Giả (No Fake Date Auto-fill)
- **Mức độ:** `MUST` (Invariant `INV-010`)
- **Định nghĩa:** Khi người dùng chỉ nhập năm sinh là `1930`, hệ thống **tuyệt đối không được tự động gán ngày là `1930-01-01`** trong CSDL hay khi xuất dữ liệu sao lưu.
- **Lý do:** Tránh việc biến một dữ liệu ước chừng thành một "sự thật lịch sử giả" làm người dùng hiểu nhầm rằng cụ sinh đúng ngày 1 tháng 1.

### `PDR-002`: Bảo toàn Độ chính xác Gốc (Preserve User Precision)
- **Mức độ:** `MUST`
- **Định nghĩa:** Hệ thống lưu trữ đồng thời 2 trường: Giá trị năm/tháng nhập vào và Mã cấp độ chính xác (`precision`). Khi xuất JSON Backup hoặc hiển thị trên thẻ hồ sơ, phải giữ nguyên vẹn định dạng người dùng đã nhập.

### `PDR-003`: Xử lý Trạng thái Đã Mất nhưng Không Rõ Ngày Mất - `P02-T17`
- **Mức độ:** `MUST`
- **Định nghĩa:**
  - Một Person có thể có cờ `is_living = false` (Đã mất) trong khi trường `death_date` hoàn toàn để trống (`UNKNOWN`).
  - **Thiếu ngày mất KHÔNG đồng nghĩa với việc còn sống**. Rất nhiều cụ tổ đời xưa đã mất hàng trăm năm nhưng con cháu không còn nhớ ngày mất chính xác.

### `PDR-004`: Quy tắc Chặn Nghịch lý Sinh - Tử (Death Before Birth Validation)
- **Mức độ:** `MUST`
- **Định nghĩa:**
  - Nếu cả ngày sinh và ngày mất đều là ngày chính xác (`EXACT`): **Nếu `death_date < birth_date` $\rightarrow$ Chặn đứng thao tác lưu (`BLOCKING_ERROR: ERR-005`)**.
  - Nếu một trong hai ngày là ngày ước tính hoặc chỉ biết năm: Nếu Năm mất < Năm sinh $\rightarrow$ Chặn (`ERR-005`). Nếu cùng năm nhưng khác độ chính xác $\rightarrow$ Cảnh báo `WARN-004: Cần kiểm tra lại ngày sinh và ngày mất`.

### `PDR-005`: Phép So sánh Tuổi Mềm dẻo (Tolerant Age Validation) - `P02-T18`
- **Mức độ:** `MUST`
- **Định nghĩa:** Khi tính toán khoảng cách tuổi giữa Cha/Mẹ và Con (ví dụ: kiểm tra cha mẹ có sinh con khi $< 12$ tuổi hay không), nếu ngày tháng ở mức `YEAR_ONLY` hoặc `APPROXIMATE`, hệ thống áp dụng biên sai số $\pm 1$ đến $\pm 3$ năm trước khi đưa ra cảnh báo `WARN-002`.

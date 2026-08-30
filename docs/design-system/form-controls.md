# Quy chuẩn Biểu mẫu & Nhập liệu Ngày Phả hệ (Form Controls) - Phase P10

- **Mã tài liệu:** `DS-FORM-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Quy chuẩn Nhập liệu Ngày không đầy đủ (Partial Date Input)

Theo yêu cầu nghiệp vụ phân tích tại Phase P02 và CSDL Phase P07:
1. **Tuyệt đối không ép ngày giả `01/01`:** Khi người dùng chỉ nhớ năm sinh (ví dụ "1945"), hệ thống lưu trữ `precision = 'year'`, `year = 1945`, `month = null`, `day = null`.
2. **Hỗ trợ 4 chế độ chính xác:**
   - `exact`: Ngày đầy đủ (DD/MM/YYYY).
   - `month`: Chỉ biết Tháng và Năm (MM/YYYY).
   - `year`: Chỉ biết Năm (YYYY).
   - `unknown`: Không rõ ngày tháng năm (tất cả là `null`).
3. **Cờ Ước tính (`isEstimated`):** Cho phép người dùng đánh dấu ngày/năm chưa hoàn toàn chắc chắn.

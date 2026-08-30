# Quy Trình Xác Thực Nhập Dữ Liệu Đa Tầng (Import Validation)

## 1. Các Lớp Xác Thực
1. **Lớp 1 - File:** Giới hạn dung lượng tối đa 10 MB, mã hóa UTF-8, định dạng JSON.
2. **Lớp 2 - Syntax & An Toàn:** Parse JSON an toàn, chống Prototype Pollution (`__proto__`).
3. **Lớp 3 - Schema Version:** Phát hiện và kiểm tra tính tương thích của `schemaVersion`.
4. **Lớp 4 - Cấu Trúc JSON Schema & Zod:** Kiểm tra kiểu dữ liệu, bắt buộc các trường bắt buộc, giới hạn độ dài chuỗi và số lượng phần tử.
5. **Lớp 5 - Ràng Buộc Nghiệp Vụ (Semantic & Reference Invariants):**
   - Không trùng lặp sourceId trong cùng một tệp.
   - Toàn bộ parentId, childId, unionId, personId tham chiếu hợp lệ.
   - Chống quan hệ tự liên kết (Self-link).
   - Kiểm tra chu trình phả hệ tổ tiên - hậu duệ (Kahn's Cycle Detection).
   - Kiểm tra tính hợp lệ của ngày tháng (năm mất $\ge$ năm sinh).
   - Đối soát số lượng thực tế với `manifest`.
   - Quét khử nhiễm secret, token, signed URL.

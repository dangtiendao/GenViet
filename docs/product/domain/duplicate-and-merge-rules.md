# Quy tắc Phát hiện Trùng lặp & Invariants khi Gộp Hồ sơ (Duplicate & Merge Rules)

- **Mã tài liệu:** `DOM-DUPMERGE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Quy tắc Phát hiện Hồ sơ Trùng lặp (Duplicate Detection Rules) - `P02-T21`

Trong quá trình nhập liệu nhiều nguồn, người dùng có thể vô tình tạo 2 hồ sơ cho cùng một người (ví dụ: tạo "Cụ Nguyễn Văn A" ở nhánh 1 và sau đó lại tạo "Cụ A" ở nhánh 2).

### 1.1. Các Mức độ Trùng lặp Khái niệm:
| Mức độ | Định nghĩa | Dấu hiệu nhận biết | Xử lý trên UI |
| :--- | :--- | :--- | :--- |
| **Trùng lặp Tuyệt đối (Exact Duplicate)** | Cùng `person_id` hoặc cùng một liên kết quan hệ đã tồn tại. | Trùng khóa chính hoặc cùng cặp `(A, B, type)`. | ❌ **CHẶN ĐỨNG** (`BLOCKING_ERROR: ERR-006`). |
| **Khả năng Trùng rất cao (Likely Duplicate)** | Trùng họ tên + Trùng năm sinh + Trùng ít nhất 1 phụ mẫu. | Họ tên giống $\ge 90\%$, năm sinh trùng, cha/mẹ cùng tên. | ⚠️ **CẢNH BÁO MẠNH** (`WARN-005` kèm bảng đối chiếu). |
| **Nghi vấn Trùng (Possible Duplicate)** | Trùng họ tên + Cùng thế hệ nhưng chưa rõ năm sinh. | Họ tên giống nhau trong cùng 1 nhánh họ. | ℹ️ **GỢI Ý NHẸ** (Hiển thị link "Xem hồ sơ có sẵn"). |

### 1.2. Các Quy tắc Phát hiện Trùng:
1. **`DUP-001` (Không Chỉ Dựa vào Họ Tên):** Trong văn hóa Việt Nam, việc nhiều người trong cùng họ trùng tên nhau (ví dụ: chú cháu cùng tên Nguyễn Văn Nam) là bình thường. Hệ thống **tuyệt đối không chặn tạo mới chỉ vì trùng họ tên**.
2. **`DUP-002` (Không Tự ý Gộp):** Hệ thống không bao giờ tự động gộp hai hồ sơ nếu không có sự xác nhận chủ động từ người dùng.
3. **`DUP-003` (Cho phép Bỏ qua Cảnh báo):** Người dùng có quyền bấm "Đây là hai người khác nhau" để tiếp tục lưu hồ sơ mới.

---

## 2. Các Bất biến Nghiệp vụ khi Gộp Hồ sơ (Merge Invariants) - `P02-T22`

*(Lưu ý: Tính năng Gộp hồ sơ nâng cao thuộc nhóm `v0.2+ / Post-MVP`. Tuy nhiên, các bất biến toán học dưới đây được khóa cứng để chuẩn bị cho kiến trúc CSDL).*

```mermaid
graph LR
    P_Src[Hồ sơ Nguồn A\nNguyễn Văn A] -->|Gộp vào| P_Tgt[Hồ sơ Đích B\nNguyễn Văn A (Giữ lại)]
    Rel_A[Các quan hệ của A] -->|Chuyển hướng an toàn| P_Tgt
    P_Src -->|Đánh dấu gộp| Archive[(Lưu trữ / Xóa mềm A)]
```

### Các Bất biến Bắt buộc khi Gộp:
1. **`MRG-001` (Chống Self-link sau Gộp - Invariant `INV-012`):** Nếu việc gộp Person A vào Person B dẫn đến tình huống Person B trở thành cha/mẹ hoặc vợ/chồng của chính mình $\rightarrow$ **CHẶN HOÀN TOÀN THAO TÁC GỘP (`ERR-007`)**.
2. **`MRG-002` (Chống Chu trình sau Gộp - Invariant `INV-012`):** Nếu việc hợp nhất hai đồ thị làm phát sinh chu trình tổ tiên - hậu duệ $\rightarrow$ **CHẶN HOÀN TOÀN THAO TÁC GỘP (`ERR-008`)**.
3. **`MRG-003` (Không Tự ý Xóa Trường Mâu thuẫn):** Nếu Hồ sơ A ghi sinh năm 1940 và Hồ sơ B ghi sinh năm 1942, giao diện bắt buộc yêu cầu người dùng chọn trường nào làm giá trị chính thức trước khi gộp.
4. **`MRG-004` (Khả năng Truy vết / Hoàn tác):** Hồ sơ bị gộp không bị xóa vật lý ngay lập tức mà được đánh dấu `is_merged = true`, trỏ tới `merged_into_person_id = B` để phục vụ truy vết lịch sử.

# Ma trận Tương thích Quan hệ Phả hệ (Relationship Matrix)

- **Mã tài liệu:** `DOM-RELMATRIX-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Ma trận Khả năng Thiết lập Quan hệ Đồng thời giữa 2 Person

Bảng ma trận này xác định tính hợp lệ khi người dùng cố gắng thiết lập đồng thời nhiều loại quan hệ khác nhau giữa cùng một cặp `(Person A, Person B)`:

| Quan hệ hiện tại của A với B | Thiết lập thêm: Cha/Mẹ ruột của B | Thiết lập thêm: Cha/Mẹ nuôi của B | Thiết lập thêm: Vợ/Chồng của B | Thiết lập thêm: Giám hộ của B |
| :--- | :---: | :---: | :---: | :---: |
| **A là Cha/Mẹ ruột của B** | ❌ `CHẶN` *(Trùng loại)* | ❌ `CHẶN` *(Đã là ruột)* | ❌ `CHẶN` *(Vi phạm luân lý & Invariant)* | ⚠️ `CẢNH BÁO` *(Thừa vai trò)* |
| **A là Cha/Mẹ nuôi của B** | ❌ `CHẶN` *(Đã là nuôi)* | ❌ `CHẶN` *(Trùng loại)* | ❌ `CHẶN` *(Vi phạm luân lý)* | ℹ️ `CHO PHÉP` |
| **A là Vợ/Chồng của B** | ❌ `CHẶN` *(Hôn phối không thể là Phụ mẫu)* | ❌ `CHẶN` *(Hôn phối không thể là Phụ mẫu)* | ❌ `CHẶN` *(Trùng hôn nhân)* | ℹ️ `CHO PHÉP` |
| **A là Con ruột của B** | ❌ `CHẶN` *(Tạo chu trình A->B->A)* | ❌ `CHẶN` *(Tạo chu trình)* | ❌ `CHẶN` *(Con không thể là Vợ/Chồng)* | ❌ `CHẶN` |
| **A là Anh/Chị/Em ruột của B** | ❌ `CHẶN` *(Tạo chu trình thế hệ)* | ⚠️ `CẢNH BÁO` *(Nuôi anh em)* | ❌ `CHẶN` *(Hôn nhân cận huyết)* | ℹ️ `CHO PHÉP` |

---

## 2. Quy tắc Đọc Ma trận Tương thích

1. **❌ `CHẶN (BLOCKING_ERROR)`:** Hệ thống phát hiện vi phạm bất biến toán học (chu trình vòng lặp thế hệ) hoặc vi phạm nghiêm trọng tính logic của đồ thị. Không cho phép lưu vào CSDL dưới mọi hình thức.
2. **⚠️ `CẢNH BÁO (WARNING_REQUIRES_CONFIRMATION)`:** Trường hợp đặc biệt trong thực tế lịch sử (ví dụ: anh nuôi em, cô chú nhận cháu làm con nuôi). Hệ thống hiển thị hộp thoại cảnh báo người dùng xác nhận trước khi lưu.
3. **ℹ️ `CHO PHÉP (ALLOWED)`:** Hoàn toàn hợp lệ về mặt cấu trúc đồ thị và logic phả học.

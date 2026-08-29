# Ranh giới Giao dịch & Tính Toàn vẹn Dữ liệu (Transaction Boundaries)

- **Mã tài liệu:** `ARCH-TX-01`
- **Mã Kiến trúc liên quan:** `AR-008`, `CMP-007`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Danh mục Các Thao tác Bắt buộc Nguyên tử (Atomic Operations)

Trong CSDL PostgreSQL, các thao tác nghiệp vụ dưới đây bắt buộc phải được thực thi trọn vẹn trong **một Database Transaction duy nhất (`BEGIN ... COMMIT`)**. Nếu bất kỳ bước nào thất bại, toàn bộ giao dịch phải được tự động hoàn tác (`ROLLBACK`):

| Thao tác Nghiệp vụ | Các Bước Thực thi trong Cùng 1 Transaction | Mục tiêu Đảm bảo Toàn vẹn |
| :--- | :--- | :--- |
| **1. Khởi tạo Cây Gia phả** | 1. `INSERT INTO trees`<br>2. `INSERT INTO memberships (role='OWNER')`<br>3. `INSERT INTO audit_logs` | Đảm bảo cây luôn có chủ sở hữu, không có cây vô chủ. |
| **2. Thêm Cha/Mẹ (Tạo người mới)** | 1. `INSERT INTO persons (Phụ mẫu mới)`<br>2. `INSERT INTO relationships (parent_id, child_id)`<br>3. `INSERT INTO audit_logs` | **Chống Person mồ côi (`UDR-001`)**: Nếu tạo quan hệ lỗi, person mới bị hủy ngay. |
| **3. Thêm Vợ/Chồng (Tạo người mới)**| 1. `INSERT INTO persons (Hôn phối mới)`<br>2. `INSERT INTO marriages (person_a, person_b)`<br>3. `INSERT INTO audit_logs` | Đảm bảo người phối ngẫu luôn gắn liền với bản ghi hôn phối. |
| **4. Thêm Con cái (Tạo người mới)** | 1. `INSERT INTO persons (Con mới)`<br>2. `INSERT INTO relationships (parent_id, child_id)`<br>3. `INSERT INTO audit_logs` | Đảm bảo con cái luôn được nối chính xác vào cha/mẹ. |
| **5. Xóa Mềm Thành viên (`INV-015`)**| 1. `UPDATE persons SET is_deleted=true`<br>2. `UPDATE relationships SET is_active=false`<br>3. `INSERT INTO audit_logs` | Đảm bảo trạng thái xóa của person và quan hệ luôn đồng bộ. |
| **6. Đổi Mốc Số Đời (`Anchor`)** | 1. `UPDATE trees SET generation_anchor_id = :newId`<br>2. `INSERT INTO audit_logs` | Ghi nhận mốc đánh số đời mới và lưu vết lịch sử. |

---

## 2. Chiến lược Bù trừ cho Thao tác Bất đồng bộ với Storage (Compensation Strategy)

Vì việc upload tệp tin nhị phân lên Object Storage và ghi bản ghi vào PostgreSQL nằm trên 2 hệ thống độc lập, không thể gộp thành 1 transaction phân tán:
1. **Bước 1 (Upload):** Người dùng upload ảnh lên Storage $\rightarrow$ File được ghi vào Storage với trạng thái `PENDING`.
2. **Bước 2 (Confirm DB Transaction):** Server Action thực hiện cập nhật `persons.avatar_key` và ghi `media_metadata`.
3. **Cơ chế Bù trừ (Compensation):**
   - Nếu Bước 2 thành công $\rightarrow$ Hoàn tất.
   - Nếu Bước 2 thất bại $\rightarrow$ Giao diện thông báo lỗi. File trên Storage vẫn ở trạng thái `PENDING` và sẽ được **Tác vụ Dọn dẹp Rác (Orphan Cleanup Cron)** tự động xóa sau 24h mà không để lại rác trong CSDL.

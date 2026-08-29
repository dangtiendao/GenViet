# Technical Debt Item: [Mã Nợ] - [Tiêu đề Nợ Kỹ thuật]

- **Mã Nợ kỹ thuật:** `[PXX-DEBT-NNN]` *(Ví dụ: P00-DEBT-001)*
- **Phase phát sinh:** `[PXX]`
- **Trạng thái:** `[OPEN | IN_PROGRESS | RESOLVED | ACCEPTED_RISK]`
- **Mức độ ưu tiên:** `[P1 | P2 | P3]`
- **Phase dự kiến giải quyết:** `[PYY]` *(Ví dụ: P06 hoặc Post-MVP)*
- **Người ghi nhận:** [Tên người phát hiện / AI Reviewer]

---

## 1. Nguồn gốc phát sinh (Origin & Context)
*Mô tả lý do tại sao khoản nợ kỹ thuật này phát sinh (ví dụ: Cần ra mắt nhanh MVP nên hardcode layout config, hoặc chưa áp dụng caching phức tạp).*

---

## 2. Lý do chưa xử lý ngay (Rationale for Deferral)
*Giải thích tại sao chưa giải quyết trong phase hiện tại (ví dụ: Không thuộc phạm vi MVP, chi phí tối ưu hóa quá lớn so với giá trị hiện thời).*

---

## 3. Tác động & Rủi ro tiềm ẩn (Impact & Risks)
- **Tác động hiện tại:** [Code có thể khó đọc hoặc hiệu năng giảm nhẹ khi số lượng bản ghi lớn.]
- **Rủi ro lâu dài:** [Nếu không xử lý trước khi có 10,000 người dùng, database query có thể bị nghẽn.]

---

## 4. Phạm vi bị ảnh hưởng (Affected Scope)
- Các file/module liên quan: `path/to/module/`, `supabase/migrations/...`

---

## 5. Đề xuất Giải pháp Xử lý (Proposed Resolution)
*Mô tả phương án kỹ thuật chuẩn mực để tái cấu trúc hoặc khắc phục khoản nợ này.*

---

## 6. Điều kiện Kích hoạt Xử lý (Trigger Condition)
*Xác định khi nào bắt buộc phải giải quyết khoản nợ này (ví dụ: Khi bắt đầu Phase P06, hoặc khi thời gian load trang vượt quá 2 giây).*

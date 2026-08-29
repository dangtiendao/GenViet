# Quy chuẩn Đánh giá Chất lượng & Review (Review Guidelines)

Tài liệu này xác lập các nguyên tắc, quy trình và tiêu chí đánh giá chất lượng sản phẩm bàn giao (Mã nguồn, Tài liệu, Thiết kế) cho từng Phase trong dự án **GenViet**.

---

## 1. Nguyên tắc Review cốt lõi

1. **Tính độc lập (Independent Review):** Người đánh giá (Reviewer) nên độc lập với người thi công để giữ góc nhìn khách quan.
2. **Không mặc định đầu ra là đúng (Zero Trust):** Không giả định mã nguồn hoặc tài liệu là hoàn hảo chỉ vì nó được tạo bởi AI hoặc Senior Engineer. Phải đối soát từng tiêu chí.
3. **Ưu tiên Bảo mật & Toàn vẹn Dữ liệu (Security & Data First):** Các lỗi về lộ secret, lỏng lẻo chính sách RLS hoặc mất dữ liệu gia tộc luôn được ưu tiên kiểm tra hàng đầu.
4. **Minh bạch Self-Review:** Nếu cùng một AI vừa thực hiện thi công vừa tiến hành kiểm tra, tài liệu phải ghi rõ đây là **Self-Review** và khuyến nghị Maintainer thực hiện Human Review trước khi merge.
5. **Không sửa mã nguồn trong phiên Review độc lập:** Reviewer chỉ ghi nhận phát hiện (Findings) và yêu cầu người thi công sửa đổi, không tự ý sửa code làm xáo trộn ngữ cảnh.

---

## 2. Phân loại Mức độ Nghiêm trọng (Finding Severity Classification)

Mọi phát hiện trong quá trình review bắt buộc phải được gắn một trong 5 mức độ sau:

| Mức độ | Ý nghĩa & Tiêu chuẩn đánh giá | Hành động bắt buộc |
| :--- | :--- | :--- |
| **`BLOCKER`** | Lỗi làm sập hệ thống, gãy hoàn toàn quy trình Git, hoặc sai lệch hoàn toàn mục tiêu cốt lõi của phase. | Bắt buộc sửa ngay lập tức. Phase bị `BLOCKED`, không thể nghiệm thu. |
| **`CRITICAL`** | Lỗi bảo mật nghiêm trọng (lộ API key/secret, vi phạm RLS, rò rỉ dữ liệu giữa các gia phả, mất mát dữ liệu). | Bắt buộc sửa ngay lập tức trước khi đóng phase. Không được phép hoãn (`DEFERRED`). |
| **`MAJOR`** | Một yêu cầu chức năng hoặc tài liệu quan trọng trong Acceptance Criteria không được đáp ứng hoặc bị lỗi. | Phải sửa trong phase hiện tại, hoặc phải có văn bản phê duyệt hoãn (`DEFERRED`) từ Project Owner. |
| **`MINOR`** | Lỗi nhỏ về định dạng, lỗi chính tả, sai đường dẫn tương đối không trọng yếu, format chưa đồng nhất. | Nên sửa trong phase hiện tại. Có thể nghiệm thu có điều kiện (`ACCEPTED_WITH_MINOR_FIXES`). |
| **`SUGGESTION`** | Góp ý tối ưu hóa code, cải thiện hiệu năng tương lai, gợi ý kiến trúc tốt hơn cho các phase sau. | Ghi nhận vào Backlog hoặc Nợ kỹ thuật (`technical-debt.md`), không chặn nghiệm thu. |

---

## 3. Quy chuẩn Định danh Issue & Ghi nhận Bằng chứng

### 3.1. Quy tắc mã định danh:
- **Review Issue:** `PXX-R01`, `PXX-R02`, ...
- **Bug phát sinh:** `PXX-BUG-001`, `PXX-BUG-002`, ...
- **Nợ kỹ thuật:** `PXX-DEBT-001`, `PXX-DEBT-002`, ...

### 3.2. Cấu trúc ghi nhận một Finding chuẩn:
Mỗi finding ghi trong biên bản review (`docs/phases/PXX/06-review.md`) phải có đủ các thông tin:
- **ID:** `[PXX-R01]`
- **Mức độ:** `[BLOCKER | CRITICAL | MAJOR | MINOR | SUGGESTION]`
- **Vị trí file:** `[path/to/file.ts#L45-L50]`
- **Mô tả vấn đề:** Giải thích rõ tại sao đoạn code/tài liệu này bị coi là lỗi.
- **Bằng chứng / Cách tái hiện:** Đoạn code lỗi, log lỗi hoặc các bước gây lỗi.
- **Đề xuất khắc phục:** Hướng xử lý cụ thể.
- **Trạng thái:** `[OPEN | RESOLVED | DEFERRED]`

---

## 4. Kết luận Đánh giá Review (Final Review Decision)

Sau khi kiểm tra toàn diện, Reviewer đưa ra một trong 4 kết luận:

1. **`ACCEPTED` (Nghiệm thu hoàn toàn):**
   - 0 Blocker, 0 Critical, 0 Major.
   - 100% Acceptance Criteria đạt PASS.
   - Đủ điều kiện chuyển sang cổng G6/G7 để bàn giao.
2. **`ACCEPTED_WITH_MINOR_FIXES` (Nghiệm thu có điều kiện):**
   - Chỉ còn một số lỗi `MINOR` hoặc `SUGGESTION`.
   - Cho phép người thi công commit sửa lỗi trực tiếp mà không cần mở phiên Re-review đầy đủ.
3. **`NEEDS_FIX` (Yêu cầu sửa lỗi & Re-Review):**
   - Có ít nhất một lỗi `MAJOR`, `CRITICAL` hoặc `BLOCKER`.
   - Người thi công phải sửa toàn bộ lỗi và kích hoạt phiên Re-review ghi nhận vào `docs/phases/PXX/07-re-review.md`.
4. **`REJECTED` (Từ chối nghiệm thu):**
   - Kết quả thi công lệch hoàn toàn so với mục tiêu phase hoặc vi phạm nghiêm trọng các quy tắc an toàn.
   - Hủy bỏ nhánh hoặc yêu cầu lập lại kế hoạch từ Cổng G1.

---

## 5. Quy trình Re-Review (Đánh giá lại)

Khi phase có trạng thái `NEEDS_FIX`:
1. Người thi công tiến hành sửa các lỗi được liệt kê trong biên bản review.
2. Tạo commit sửa lỗi với message chuẩn: `fix(PXX): resolve review findings PXX-R01, PXX-R02`.
3. Mở file `docs/phases/PXX/07-re-review.md` để ghi nhận lại kết quả kiểm tra từng finding:
   - Đối chiếu lại bằng chứng.
   - Đánh dấu `RESOLVED` cho từng mục.
   - Cập nhật kết luận cuối cùng thành `ACCEPTED`.
4. Nếu phase không phát sinh lỗi nào cần sửa, file `07-re-review.md` được ghi nhận trạng thái `NOT_REQUIRED`.

# Biên bản Đánh giá & Nghiệm thu: Phase [PXX]

- **Mã Phase:** `[PXX]` *(Ví dụ: P00)*
- **Tên Phase:** `[Tên giai đoạn]`
- **Loại hình đánh giá:** `[Self-Review | Independent Review | Human Lead Review]`
- **Người / Agent đánh giá:** [Tên người review]
- **Ngày đánh giá:** YYYY-MM-DD
- **Nhánh kiểm tra:** `phase/pXX-short-name`
- **Commit hash kiểm tra:** `[abcdef1]`

---

## 1. Kết luận Review Tổng thể (Final Review Status)

**Trạng thái:** `[ACCEPTED | ACCEPTED_WITH_MINOR_FIXES | NEEDS_FIX | REJECTED]`

### Tóm tắt số lượng phát hiện (Findings Count):
- **`BLOCKER`:** 0
- **`CRITICAL`:** 0
- **`MAJOR`:** 0
- **`MINOR`:** 0
- **`SUGGESTION`:** 0

---

## 2. Đối chiếu Acceptance Criteria (AC Verification)

| Mã AC | Mô tả tiêu chí | Kết quả | Ghi chú / Bằng chứng |
| :--- | :--- | :---: | :--- |
| **AC-PXX-001** | [Mô tả tiêu chí 1] | `PASS` / `FAIL` | Đã kiểm tra file `path/to/file` |
| **AC-PXX-002** | [Mô tả tiêu chí 2] | `PASS` / `FAIL` | Test suite chạy thành công |

---

## 3. Danh sách Phát hiện Chi tiết (Detailed Findings)

*(Nếu không có phát hiện nào, ghi rõ: "Không phát hiện lỗi tại thời điểm đóng review.")*

### Finding [PXX-R01]: [Tiêu đề phát hiện ngắn gọn]
- **Mức độ nghiêm trọng:** `[BLOCKER | CRITICAL | MAJOR | MINOR | SUGGESTION]`
- **Vị trí phát hiện:** `[path/to/file.md#L20]`
- **Mô tả vấn đề:** [Giải thích chi tiết lỗi]
- **Bằng chứng / Cách tái hiện:** [Đoạn mã lỗi hoặc log]
- **Đề xuất khắc phục:** [Hướng dẫn sửa lỗi]
- **Trạng thái:** `[OPEN | RESOLVED | DEFERRED]`

---

## 4. Kiểm tra An toàn & Bảo mật (Security & Git Safety Check)
- [ ] Working tree sạch, không có file thừa ngoài phạm vi.
- [ ] Không có secret, API key, token, private key trong diff.
- [ ] Không có commit nào bị push lên remote hoặc merge trái phép.
- [ ] Nếu là Self-Review của AI: Đã ghi nhận rõ ràng tính chất và khuyến nghị Maintainer kiểm tra lại.

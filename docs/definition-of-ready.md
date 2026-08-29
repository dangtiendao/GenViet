# Definition of Ready (DoR) - Tiêu chuẩn Sẵn sàng Bắt đầu

Tài liệu này xác định các điều kiện tiên quyết bắt buộc phải đạt được trước khi một Phase hoặc Task trong dự án **GenViet** được phép chuyển từ trạng thái `NOT_STARTED` sang `IN_PROGRESS` (Vượt qua Cổng G0).

---

## 1. Nguyên tắc cốt lõi của DoR

- **Không bắt đầu khi còn mơ hồ:** Không bắt đầu thi công khi mục tiêu, phạm vi hoặc các quyết định cốt lõi chưa được xác định rõ ràng.
- **Không để AI tự suy diễn nghiệp vụ quan trọng:** Mọi quy tắc sản phẩm, mô hình dữ liệu hoặc quyết định kiến trúc trọng yếu phải được cung cấp tường minh trong tài liệu đầu vào.
- **Bảo đảm an toàn môi trường:** Repository và working tree phải ở trạng thái sẵn sàng, sạch sẽ và an toàn trước khi tạo nhánh hoặc viết code.

---

## 2. Tiêu chí DoR chi tiết

Một Phase hoặc Task được xem là **READY** khi đáp ứng đầy đủ 13 tiêu chí sau:

1. **Mục tiêu rõ ràng (Clear Objective):** Nêu rõ phase/task này giải quyết bài toán gì và tạo ra giá trị gì.
2. **Phạm vi tường minh (In-Scope / Out-of-Scope):** Liệt kê chi tiết những việc PHẢI LÀM và những việc TUYỆT ĐỐI KHÔNG LÀM.
3. **Phụ thuộc đã xác định (Dependencies Identified):** Các phase hoặc task tiền đề đã hoàn tất và được nghiệm thu qua cổng G7.
4. **Đầu vào đầy đủ (Inputs Available):** Tài liệu bàn giao từ phase trước đã được tiếp nhận và kiểm tra tính đầy đủ.
5. **Quyết định kiến trúc đã khóa (Locked Architectural Decisions):** Các quyết định nền tảng (công nghệ, cơ sở dữ liệu, phân quyền) liên quan đến phase đã được chốt và ghi vào Decision Log.
6. **Tiêu chí nghiệm thu đo lường được (Testable Acceptance Criteria):** Mỗi yêu cầu đều có tiêu chí kiểm tra rõ ràng (Pass/Fail), không mơ hồ.
7. **Rủi ro chính đã được nhận diện (Risks Identified):** Các rủi ro tiềm ẩn đã được đánh giá và ghi nhận vào Risk Register kèm phương án phòng ngừa.
8. **Kế hoạch kiểm thử sơ bộ (Test Strategy Defined):** Xác định rõ phương pháp kiểm thử (Test manual, Unit test, RLS test, Document verification).
9. **Phương án hoàn tác (Rollback / Recovery Plan):** Xác định phương án phục hồi nếu việc thi công gây lỗi trên hệ thống hoặc database.
10. **Quy chuẩn dữ liệu kiểm thử (Test Data Defined):** Dữ liệu mẫu phục vụ test phải là dữ liệu giả lập (mock data), không sử dụng dữ liệu cá nhân thật.
11. **Không có Blocker tồn đọng (No Unresolved Blockers):** Không còn bất kỳ sự cố cản trở nào từ các giai đoạn trước chưa được giải quyết.
12. **Khu vực tệp tin cho phép (Known Writable Scope):** Người thi công / AI biết chính xác danh sách thư mục và file được phép tạo/chỉnh sửa, tránh sửa lan man.
13. **Môi trường Git an toàn (Git Safety Pre-conditions):** Working tree sạch, không có uncommitted changes lạ, nhánh gốc xác định rõ ràng.

---

## 3. Checklist Definition of Ready (Có thể sao chép cho từng Phase)

Khi mở một phase mới (file `docs/phases/PXX/01-input-readiness.md`), sao chép checklist này để đánh giá:

```markdown
### Bảng kiểm tra Definition of Ready (DoR Checklist)

- [ ] **DoR-01:** Mục tiêu phase đã được mô tả chi tiết, rõ ràng.
- [ ] **DoR-02:** Phạm vi In-Scope và Out-of-Scope được phân định ranh giới rõ ràng.
- [ ] **DoR-03:** Các phase phụ thuộc (Prerequisites) đã hoàn tất và có tài liệu bàn giao.
- [ ] **DoR-04:** Đã đọc và tiếp nhận toàn bộ tài liệu đầu vào liên quan.
- [ ] **DoR-05:** Các quyết định kiến trúc bắt buộc cho phase đã được khóa trong Decision Log.
- [ ] **DoR-06:** Toàn bộ Acceptance Criteria có thể kiểm thử độc lập (Pass/Fail).
- [ ] **DoR-07:** Các rủi ro chính đã được đưa vào Risk Register kèm biện pháp ứng phó.
- [ ] **DoR-08:** Có kế hoạch kiểm thử kỹ thuật và danh sách lệnh test dự kiến.
- [ ] **DoR-09:** Có phương án rollback khi gặp sự cố.
- [ ] **DoR-10:** Dữ liệu kiểm thử đã được chuẩn bị (100% Mock data).
- [ ] **DoR-11:** Không có yêu cầu nào bắt buộc AI phải tự suy diễn quyết định sản phẩm lớn.
- [ ] **DoR-12:** Không còn issue BLOCKER nào chưa được giải quyết.
- [ ] **DoR-13:** Danh sách file dự kiến tạo/sửa đã được xác định; Git working tree sạch sẽ.

**Kết luận DoR:** `READY` (Cho phép lập kế hoạch và thi công) | `BLOCKED` (Cần bổ sung thông tin)
```

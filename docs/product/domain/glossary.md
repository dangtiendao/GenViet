# Bảng Thuật ngữ Nghiệp vụ Phả hệ Chuẩn (Genealogy Domain Glossary)

- **Mã tài liệu:** `DOM-GLOSSARY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Sử dụng Thuật ngữ

1. **Mỗi thuật ngữ chỉ có MỘT định nghĩa chuẩn duy nhất (Single Source of Truth).**
2. **Phân biệt nghiêm ngặt giữa Thực thể Nghiệp vụ và Đối tượng Đồ họa:**
   - **`Person` (Nhân vật gia phả):** Là con người trong thế giới thực / phả hệ học.
   - **`Node` (Điểm nút đồ thị):** Là thành phần giao diện visual trên React Flow Canvas. Một Person được biểu diễn bởi một Node.

---

## 2. Bảng 40 Thuật ngữ Nghiệp vụ Song ngữ Chuẩn

| Thuật ngữ Tiếng Việt | Thuật ngữ Tiếng Anh | Định nghĩa Chuẩn | Không đồng nghĩa với (Tránh nhầm lẫn) | Quy tắc / Mã liên quan |
| :--- | :--- | :--- | :--- | :--- |
| **Tài khoản Người dùng** | User Account | Tài khoản có email/mật khẩu để đăng nhập web và quản trị cây. | Không phải là Person trong cây. | `ENT-001`, `INV-001` |
| **Nhân vật Gia phả** | Person / Member | Thực thể đại diện cho một thành viên dòng họ (sống hoặc đã mất). | Không bắt buộc có tài khoản hay email. | `ENT-003`, `INV-001` |
| **Cây Gia phả** | Family Tree | Không gian quản trị và phạm vi dữ liệu gia phả khép kín. | Không bắt buộc chỉ có 1 dòng họ. | `ENT-002`, `BR-TR-001` |
| **Điểm Nút Đồ thị** | Graph Node | Khối phần tử trực quan hiển thị trên Canvas React Flow. | Không phải là thực thể Person trong CSDL. | `INV-009` |
| **Node Hiển thị** | Rendered Node | Node đồ thị đang nằm trong cửa sổ quan sát của màn hình. | Không đồng nghĩa toàn bộ CSDL cây. | `product-constraints.md` |
| **Người Trung tâm** | Center Person / Focus Node | Nhân vật được chọn làm trọng tâm quan sát của khung nhìn Canvas. | Không phải Root bất biến, không phải Thủy tổ. | `CONCEPT-002`, `INV-007` |
| **Người Tạo Đầu tiên** | Initial Person | Nhân vật đầu tiên được nhập liệu khi tạo cây rỗng. | Không mặc định là Thủy tổ, không phải Đời 1. | `CONCEPT-001`, `INV-008` |
| **Thủy Tổ** | Founding Ancestor | Cụ tổ được gia đình tôn kính là điểm khởi đầu dòng họ. | Không do hệ thống tự động suy diễn. | `CONCEPT-003`, `BR-FA-001` |
| **Mốc Đánh Số Đời** | Generation Anchor | Nhân vật được chọn làm chuẩn Thế hệ 1 để tính số đời tương đối. | Không làm thay đổi quan hệ huyết thống. | `CONCEPT-004`, `INV-018` |
| **Thế hệ / Đời** | Generation | Bậc phân tầng quan hệ dòng dõi trong gia tộc. | Không phụ thuộc thời điểm nhập liệu. | `GEN-001`..`GEN-006` |
| **Số Đời** | Generation Number | Nhãn số (1, 2, 3...) tính toán tương đối theo Mốc Đời. | Không phải thuộc tính bất biến của Person. | `INV-018` |
| **Tổ tiên / Tiền bối** | Ancestors / Ascendants | Tập hợp các thế hệ cha, mẹ, ông, bà, cụ, kỵ phía trên. | Không bao gồm cha mẹ kế hay người giám hộ. | `INV-017` |
| **Hậu duệ / Tử tức** | Descendants | Tập hợp các thế hệ con, cháu, chắt, chút phía dưới. | Không bao gồm con riêng của người phối ngẫu. | `INV-017` |
| **Cha Ruột** | Biological Father | Người cha sinh học có quan hệ huyết thống trực tiếp (Nam). | Không đồng nhất với Cha nuôi hay Cha dượng. | `REL-001`, `RR-001` |
| **Mẹ Ruột** | Biological Mother | Người mẹ sinh học có quan hệ huyết thống trực tiếp (Nữ). | Không đồng nhất với Mẹ nuôi hay Mẹ kế. | `REL-001`, `RR-001` |
| **Con Ruột** | Biological Child | Con sinh học nhận huyết thống từ Cha/Mẹ ruột. | Không bao gồm con nuôi hay con riêng của vợ/chồng. | `REL-001`, `RR-001` |
| **Cha Mẹ Nuôi** | Adoptive Parent | Người nhận nuôi dưỡng hợp pháp hoặc theo phong tục. | Không thay thế cha mẹ ruột; không truyền huyết thống. | `REL-002`, `RR-004` |
| **Con Nuôi** | Adopted Child | Con được nhận nuôi; có nhãn phân biệt trên cây. | Không làm phát sinh huyết thống với tổ tiên. | `REL-002`, `RR-004` |
| **Cha Mẹ Kế** | Step-Parent | Người phối ngẫu của Cha/Mẹ ruột (Mẹ kế, Cha dượng). | Mặc định là quan hệ suy ra từ Hôn nhân. | `REL-003`, `INV-020` |
| **Người Giám hộ** | Legal Guardian | Người đại diện pháp lý / chăm sóc khi phụ mẫu vắng mặt. | Không tạo quan hệ cha con hay số đời. | `REL-004`, `INV-019` |
| **Vợ / Chồng** | Spouse | Bạn đời trong quan hệ hôn phối của nhân vật. | Không tạo huyết thống cha mẹ - con. | `REL-005`, `RR-005` |
| **Quan hệ Hôn nhân** | Marriage Relationship | Mối liên kết hôn phối giữa 2 Person. | Không tự động biến con riêng thành con chung. | `REL-005`, `INV-016` |
| **Quan hệ Nguồn** | Source Fact | Quan hệ trực tiếp do người dùng chủ động tạo và lưu CSDL. | Không phải quan hệ suy diễn gián tiếp. | `DOM-MODEL-01` |
| **Quan hệ Suy ra** | Derived Fact | Quan hệ gián tiếp tính toán qua đồ thị (Anh em, Ông cháu). | Không lưu bản ghi trực tiếp trong CSDL. | `DOM-MODEL-01` |
| **Quan hệ Đã Xác minh** | Verified Relationship | Quan hệ chính thức, có tài liệu chứng thực (`VERIFIED`). | Không phải giả thuyết chưa kiểm chứng. | `UDR-004` |
| **Quan hệ Chưa Xác minh** | Unverified Relationship | Quan hệ phỏng đoán, truyền khẩu (`UNVERIFIED`). | Vẫn phải tuân thủ chống chu trình 100%. | `UDR-004`, `INV-011` |
| **Quan hệ Tranh chấp** | Disputed Relationship | Quan hệ có nhiều ý kiến trái chiều giữa các nhánh (`DISPUTED`). | Không được tự động chọn một nguồn để ghi đè. | `UDR-005` |
| **Hồ sơ Trùng lặp** | Duplicate Profile | Tình huống tồn tại 2 hồ sơ cho cùng 1 con người ngoài đời. | Không đồng nghĩa với việc trùng họ tên. | `DUP-001`..`DUP-003` |
| **Gộp Hồ sơ** | Profile Merge | Thao tác hợp nhất dữ liệu từ 2 hồ sơ thành 1 hồ sơ duy nhất. | Không phải thao tác liên kết quan hệ (`Link`). | `INV-012`, `MRG-001` |
| **Liên kết Người có sẵn** | Link Existing Person | Chọn Person đã có trên cây để nối làm Cha/Mẹ/Vợ/Chồng. | Không phải tạo mới Person; không phải Gộp hồ sơ. | `BR-LK-001`..`BR-LK-004` |
| **Xóa Mềm** | Soft Delete | Đánh dấu `is_deleted = true`, ẩn khỏi giao diện hiển thị. | Không phải xóa vật lý; có thể khôi phục 100%. | `DEL-001`..`DEL-003` |
| **Khôi phục** | Restore | Đưa bản ghi bị xóa mềm trở lại trạng thái hoạt động. | Bắt buộc chạy lại kiểm tra Invariants. | `DEL-004` |
| **Ngày Không Đầy đủ** | Partial Date | Ngày tháng chỉ biết năm, tháng/năm hoặc khoảng thời gian. | Tuyệt đối không tự điền `01/01`. | `INV-010`, `PDR-001` |
| **Ngày Ước tính** | Estimated Date | Niên đại phỏng đoán theo sự kiện lịch sử (ví dụ: `~1945`). | Không được hiển thị như ngày chính xác. | `PDR-005` |
| **Dữ liệu Mâu thuẫn** | Conflicting Data | Thông tin bất đồng giữa các nguồn tài liệu hoặc người nhập. | Không tự động xóa nguồn cũ. | `UDR-005`, `UDR-006` |
| **Chu trình / Vòng lặp** | Cycle / Loop | Nghịch lý thế hệ khi một người là tổ tiên của chính mình. | **LỖI NGHIÊM TRỌNG BẮT BUỘC CHẶN**. | `INV-004`, `ERR-002` |
| **Cụm Rời** | Disconnected Cluster | Nhánh phả hệ chưa có đường dây nối vào cây chính. | Dữ liệu hoàn toàn hợp lệ trong quá trình nhập. | `BR-TR-002`, `INFO-003` |
| **Quy tắc Bất biến** | Domain Invariant | Điều kiện logic nền tảng không bao giờ được vi phạm. | Không thể bỏ qua bằng nút xác nhận. | `DOM-INVARIANTS-01` |
| **Lỗi Phải Chặn** | Blocking Error | Thao tác vi phạm Invariant, hệ thống từ chối lưu vào CSDL. | Khác với Cảnh báo (Warning có thể xác nhận lưu). | `ERR-001`..`ERR-008` |
| **Cảnh báo Nghiệp vụ** | Warning | Dữ liệu bất thường (ví dụ: khoảng cách tuổi lớn, trùng tên). | Người dùng có thể xác nhận để tiếp tục lưu. | `WARN-001`..`WARN-007` |

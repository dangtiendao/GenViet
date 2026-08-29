# Danh mục Tính năng Ngoài Phạm vi MVP v0.1 (Out-of-Scope Catalogue)

- **Mã tài liệu:** `PROD-OUTOFSCOPE-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Nguyên tắc Phân loại Ngoài Phạm vi

1. **"Out of v0.1" không đồng nghĩa với "Bị từ chối vĩnh viễn":** Danh mục này liệt kê các tính năng có giá trị nhưng được chủ động hoãn lại để bảo vệ tiến độ và chất lượng của phiên bản đầu tiên.
2. **Ngăn chặn triệt để Scope Creep (`RISK-001`):** Mọi đề xuất thêm tính năng mới trong quá trình thi công kỹ thuật bắt buộc phải đối chiếu với danh sách này.

---

## 2. Bảng Danh mục 30 Tính năng Ngoài Phạm vi v0.1

| Mã OOS | Tên tính năng | Lý do loại khỏi v0.1 | Rủi ro nếu đưa vào sớm | Phiên bản xem xét lại |
| :--- | :--- | :--- | :--- | :---: |
| **OOS-001** | Nhiều quản trị viên cùng quản lý (Multi-admin) | Phức tạp hóa phân quyền trong MVP cá nhân. | Xung đột ghi đè dữ liệu, chậm tiến độ 3 tuần. | `v0.2+` |
| **OOS-002** | Mời thành viên xem qua Email/Link chia sẻ | Cần cơ chế cấp token chia sẻ an toàn và RLS phức tạp. | Nguy cơ rò rỉ dữ liệu gia tộc nếu link bị lộ. | `v0.2` |
| **OOS-003** | Phân quyền vai trò (Editor, Contributor, Viewer) | Vượt quá nhu cầu sử dụng của một người quản trị. | Làm rối cấu trúc bảng và chính sách RLS. | `v0.3` |
| **OOS-004** | Quy trình đề xuất & duyệt chỉnh sửa phả hệ | Cần xây dựng hệ thống workflow state machine. | Quá tải phạm vi MVP. | `v0.3` |
| **OOS-005** | Giao diện xem lịch sử chỉnh sửa (Audit Log UI) | Cần bảng lưu trữ lịch sử diff chi tiết. | Tăng dung lượng lưu trữ CSDL vượt gói Free. | `v0.2` |
| **OOS-006** | Album ảnh gia đình đa phương tiện | Đòi hỏi dung lượng Storage lớn và UI gallery phức tạp. | Vượt hạn mức Free Tier của Supabase Storage. | `v0.2` |
| **OOS-007** | Lưu trữ Video & File ghi âm giọng nói | Tốn băng thông truyền tải và dung lượng lưu trữ. | Tăng chi phí hạ tầng ngoài tầm kiểm soát. | `Post-MVP` |
| **OOS-008** | Scan & Lưu trữ văn bản phả ký Hán - Nôm | Tính năng chuyên sâu dành cho nhà nghiên cứu. | Không phục vụ đại đa số người dùng phổ thông. | `Roadmap` |
| **OOS-009** | Quản lý sự kiện dòng họ (Họp họ, khánh thành) | Thuộc nhóm tính năng mạng xã hội/cộng tác. | Làm phân tán sự tập trung vào đồ thị cây. | `v0.3` |
| **OOS-010** | Quản lý ngày giỗ chạp & Nhắc lịch | Cần hệ thống background cron job và email service. | Phức tạp hóa hạ tầng vận hành. | `v0.2` |
| **OOS-011** | Chuyển đổi Âm lịch - Dương lịch Việt Nam | Thuật toán âm lịch phức tạp và dễ phát sinh lỗi biên. | Làm chậm tiến độ kiểm thử v0.1. | `v0.2` |
| **OOS-012** | Thông báo đẩy (Push notifications) & Email tin tức | Đòi hỏi cấu hình Service Worker và email server riêng. | Tăng chi phí và độ phức tạp triển khai. | `v0.3` |
| **OOS-013** | Nhập dữ liệu hàng loạt từ Excel / CSV | Khó chuẩn hóa dữ liệu quan hệ gia phả phân cấp từ bảng phẳng. | Gặp lỗi dữ liệu chu trình hoặc dữ liệu rác. | `v0.2` |
| **OOS-014** | Xuất dữ liệu ra file Excel / CSV | Bảng 2D không thể biểu diễn trực quan đồ thị đa thế hệ. | Người dùng hiểu sai cấu trúc cây. | `v0.2` |
| **OOS-015** | Xuất đồ thị ra PDF khổ lớn (A0, A1) in ấn | Cần thư viện render canvas thành vector PDF phức tạp. | Lỗi tràn bộ nhớ trình duyệt phía client. | `v0.3` |
| **OOS-016** | Tương thích chuẩn quốc tế GEDCOM | Cấu trúc GEDCOM cổ điển không tương thích tốt với văn hóa Việt. | Tốn nhiều tuần công sức chuyển đổi schema. | `Roadmap` |
| **OOS-017** | Thuật toán gợi ý danh xưng họ hàng (Cách gọi tên) | Quy tắc xưng hô Việt Nam cực kỳ đa dạng theo vùng miền. | Dễ gây tranh cãi và sai lệch văn hóa. | `P02 / v0.2` |
| **OOS-018** | Bản đồ định vị lăng mộ & Quê quán (GIS Maps) | Cần tích hợp Google Maps API có phí. | Phát sinh chi phí API. | `Roadmap` |
| **OOS-019** | Nhận diện khuôn mặt tự động trong ảnh cũ (AI) | Đòi hỏi model AI nhận diện thị giác máy tính. | Vượt xa năng lực của MVP web cơ bản. | `Won't` |
| **OOS-020** | Trợ lý ảo AI tóm tắt tiểu sử phả hệ | Cần gọi OpenAI/Gemini API có phí và nguy cơ lộ dữ liệu. | Vi phạm nguyên tắc bảo mật và chi phí thấp. | `Won't` |
| **OOS-021** | Phân tích dữ liệu xét nghiệm ADN | Yêu cầu nghiệp vụ sinh học chuyên sâu và pháp lý y tế. | Không thuộc định hướng sản phẩm web gia phả. | `Won't` |
| **OOS-022** | Chat nội bộ dòng họ thời gian thực | Cần hệ thống WebSocket server riêng. | Biến sản phẩm thành ứng dụng nhắn tin. | `Won't` |
| **OOS-023** | Mạng xã hội dòng họ (Đăng bài, Thích, Bình luận) | Cần kiểm duyệt nội dung, báo cáo vi phạm. | Biến tướng phạm vi, khó kiểm soát chất lượng. | `Won't` |
| **OOS-024** | Đóng góp quỹ dòng họ, Công đức online (Payment) | Đòi hỏi tích hợp cổng thanh toán (VNPay/Momo) và pháp lý. | Rủi ro pháp lý tài chính nghiêm trọng. | `Won't` |
| **OOS-025** | Cây gia phả công khai cho cộng đồng xem tự do | Xung đột trực tiếp với nguyên tắc Privacy by Default. | Nguy cơ bị lộ thông tin cá nhân hàng loạt. | `Won't v0.1` |
| **OOS-026** | Ứng dụng di động native (App Store / Google Play) | Chi phí duy trì tài khoản Apple Developer và build đa nền tảng. | Tăng gấp đôi chi phí bảo trì so với Web App. | `Roadmap` |
| **OOS-027** | Chỉnh sửa Offline & Đồng bộ xung đột tự động | Thuật toán CRDTs / Offline Sync cực kỳ phức tạp. | Làm sụp đổ tiến độ phát hành MVP. | `Won't v0.1` |
| **OOS-028** | Thuật toán tự động sáp nhập 2 cây gia phả (Tree Merge) | Xử lý trùng lặp và xung đột quan hệ cực khó. | Nguy cơ làm hỏng toàn bộ cấu trúc cây cũ. | `v0.4+` |
| **OOS-029** | Sử dụng Graph Database chuyên dụng (Neo4j) | Phát sinh hạ tầng máy chủ riêng tốn kém chi phí. | Vi phạm nguyên tắc sử dụng PostgreSQL/Supabase. | `Won't` |
| **OOS-030** | Kiến trúc Microservices | Quá phức tạp cho quy mô ứng dụng cá nhân. | Gây overhead vận hành không đáng có. | `Won't` |

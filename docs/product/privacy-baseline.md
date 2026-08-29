# Nguyên tắc Quyền Riêng tư Sản phẩm (Privacy Baseline)

- **Mã tài liệu:** `PROD-PRIVACY-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROPOSED_FOR_APPROVAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên ngôn Quyền Riêng tư (Privacy Philosophy)

> **"Thông tin gia phả là tài sản tinh thần và dữ liệu riêng tư thiêng liêng của mỗi gia đình Việt Nam. GenViet cam kết bảo vệ dữ liệu gia phả ở mức độ cao nhất, mặc định ở chế độ riêng tư và trao toàn quyền kiểm soát dữ liệu cho người dùng."**

*(Lưu ý: Tài liệu này xác lập tiêu chuẩn nghiệp vụ và thiết kế sản phẩm của GenViet, không thay thế cho văn bản tư vấn pháp lý chuyên nghiệp).*

---

## 2. Các Nguyên tắc Riêng tư Cốt lõi (12 Điều bắt buộc)

1. **Mặc định Riêng tư (Private by Default):** Mọi cây gia phả mới được tạo ra đều ở chế độ riêng tư tuyệt đối. Không một ai ngoài chủ tài khoản có thể xem được dữ liệu.
2. **Không có Trang Công khai Mặc định (No Public Indexing):** Trong phiên bản v0.1, hệ thống không tạo trang public profile, không cho phép công cụ tìm kiếm (Google, Bing) lập chỉ mục dữ liệu gia phả.
3. **Chống Đoán Định danh URL (UUID-based Protection):** Tất cả các ID của cây (`tree_id`) và nhân vật (`person_id`) đều sử dụng định dạng UUID v4 ngẫu nhiên; ngăn chặn việc dò quét dữ liệu bằng cách tăng số ID tuần tự (`/tree/1`, `/tree/2`).
4. **Bảo vệ Đặc biệt Thông tin Người Còn Sống:** Thông tin của những người còn sống (đặc biệt là trẻ vị thành niên) được coi là dữ liệu nhạy cảm.
5. **Không Thu thập Giấy tờ Tùy thân trong v0.1:** Không yêu cầu và không hỗ trợ lưu trữ số CCCD, hộ chiếu, mã số thuế cá nhân trong phiên bản MVP.
6. **Không đưa Dữ liệu Thật vào Môi trường Thử nghiệm:** 100% dữ liệu dùng cho tài liệu hướng dẫn, ảnh chụp màn hình demo, test fixture trong Git phải là dữ liệu giả lập (Mock data).
7. **Toàn quyền Sở hữu Dữ liệu (Data Sovereignty):** Người dùng có quyền trích xuất toàn bộ dữ liệu của mình (Export JSON) bất kỳ lúc nào mà không bị ràng buộc.
8. **Xác nhận Thao tác Xóa (Explicit Confirmation):** Các thao tác xóa nhân vật hoặc xóa cây gia phả bắt buộc phải có hộp thoại xác nhận rõ ràng để tránh mất mát dữ liệu do sơ suất.
9. **Bảo vệ File Phương tiện (Secure Media Storage):** Ảnh đại diện lưu trên Supabase Storage phải được cấu hình chính sách bảo vệ, không sử dụng đường dẫn public vĩnh viễn không kiểm soát.
10. **Không Bán Dữ liệu & Không Huấn luyện AI Ngoài Luồng:** Dữ liệu gia phả của người dùng tuyệt đối không bị bán cho bên thứ ba, không bị dùng để hiển thị quảng cáo cá nhân hóa và không được đưa vào huấn luyện các mô hình AI công cộng khi chưa có sự cho phép.
11. **Giảm thiểu Thu thập Dữ liệu (Data Minimization):** Chỉ thu thập các trường thông tin tối thiểu cần thiết cho việc dựng cây (Họ tên, Giới tính, Năm sinh, Năm mất, Quan hệ).
12. **Ẩn Thông tin Nhạy cảm khỏi Nhật ký Hệ thống:** Không ghi email người dùng, token hoặc nội dung chi tiết của hồ sơ vào application console logs.

---

## 3. Bảng Phân loại Cấp độ Dữ liệu (Data Classification Matrix)

| Cấp độ dữ liệu | Loại thông tin | Xử lý trong MVP v0.1 | Biện pháp bảo vệ |
| :--- | :--- | :--- | :--- |
| **Cấp 1: Public** | Tên thương hiệu GenViet, tài liệu hướng dẫn sử dụng, trang đăng ký/đăng nhập. | Hiển thị công khai trên web. | CDN Caching, HTTPS. |
| **Cấp 2: Family-Private** | Tên cây gia phả, họ tên thành viên, giới tính, quan hệ thế hệ, năm sinh/năm mất của người đã khuất. | Chỉ chủ tài khoản nhìn thấy. | Supabase RLS Policy theo `user_id`. |
| **Cấp 3: Sensitive** | Ngày tháng năm sinh chính xác của người còn sống, ảnh chân dung, tiểu sử cá nhân. | Chỉ chủ tài khoản nhìn thấy. | RLS + Mã hóa đường truyền SSL/TLS + Signed URLs. |
| **Cấp 4: Highly Sensitive** | Số CCCD, thẻ căn cước, thông tin tài chính, mật khẩu người dùng. | **CẤM LƯU TRỮ TRONG v0.1** *(Mật khẩu được băm 1-way bởi Supabase Auth)*. | Không tạo trường dữ liệu cho loại thông tin này. |

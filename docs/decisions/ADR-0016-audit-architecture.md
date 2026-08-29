# ADR-0016: Kiến trúc Ghi nhận Nhật ký Kiểm toán Nghiệp vụ (Audit Architecture)

- **Mã Quyết định:** `ADR-0016`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Xây dựng bảng `audit_logs` trong PostgreSQL để lưu vết toàn bộ các thay đổi phả hệ trọng yếu (Tạo/sửa/xóa người, nối quan hệ, đổi mốc số đời, xuất sao lưu).
- **Ranh giới:**
  - Ghi nhận kiểm toán phải được thực thi trong **cùng một Transaction với thao tác nghiệp vụ**.
  - **Nghiêm cấm tuyệt đối** việc ghi mật khẩu, token, session key, signed URL hay toàn bộ file nhị phân vào nhật ký kiểm toán.
  - Bảng `audit_logs` là bảng chỉ thêm (`Append-Only`), bảo vệ qua RLS để người dùng chỉ xem được lịch sử của chính cây mình sở hữu.

## 2. Hệ quả
- **Tích cực:** Cung cấp khả năng truy vết lịch sử dòng họ minh bạch, hỗ trợ tính năng xem lịch sử sửa đổi và hoàn tác trong tương lai.
- **Tiêu cực:** Tăng dung lượng lưu trữ trong CSDL (cần có chính sách lưu trữ retention baseline ở Phase P18).

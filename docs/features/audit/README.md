# Tính Năng Nhật Ký Biến Động (Audit Log Feature)

## 1. Tổng Quan
Hệ thống Audit Log của GenViet cung cấp khả năng lưu vết, kiểm tra và đối soát toàn bộ các thay đổi phát sinh trên dữ liệu cây gia phả:
- **Bất biến (Immutability):** Bảng `public.audit_logs` được bảo vệ bằng RLS, không cho phép client thực hiện thao tác INSERT, UPDATE hoặc DELETE trực tiếp.
- **Khử nhiễm an toàn (Sanitization & Redaction):** Áp dụng chiến lược Allowlist kết hợp Denylist để loại bỏ 100% dữ liệu nhạy cảm (mật khẩu, token, cookie, signed URL).
- **Giao dịch nguyên tử (Atomic Integration):** Nhật ký được ghi nhận cùng transaction với các thao tác thay đổi dữ liệu chính (Person, Relationship, Union, Family Tree).

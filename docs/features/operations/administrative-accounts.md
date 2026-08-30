# Danh Mục Tài Khoản Quản Trị & Liên Hệ Vận Hành (Administrative Accounts Inventory - P25-T18)

*Lưu ý an toàn: Tài liệu này tuyệt đối KHÔNG lưu trữ mật khẩu, khóa API, token hay recovery codes.*

## 1. Bảng Phân Quyền & Tài Khoản Quản Trị Hệ Thống

| Hệ Thống / Dịch Vụ | Vai Trò & Mục Đích | Người Chịu Trách Nhiệm Chính (Primary Owner) | Người Dự Phòng (Backup Owner) | Trạng Thái Bật 2FA / MFA | Chu Kỳ Rà Soát Quyền |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **GitHub Organization / Repo** | Quản lý mã nguồn, branch protection | Lead Developer | Tech Lead | **BẮT BUỘC (YES)** | Hàng quý (Quarterly) |
| **Vercel Team / Project** | Triển khai web app, DNS, Domains, Env | DevOps Engineer | SRE Lead | **BẮT BUỘC (YES)** | Hàng quý (Quarterly) |
| **Supabase Project** | Quản trị Database, Auth, Storage RLS | Database Admin | Backend Lead | **BẮT BUỘC (YES)** | Hàng quý (Quarterly) |
| **Cloudflare Zone** | Quản lý DNS records, Domain routing | Network Admin | Tech Lead | **BẮT BUỘC (YES)** | Hàng năm |
| **Domain Registrar** | Sở hữu & gia hạn tên miền `genviet.vn` | Project Owner | Finance Lead | **BẮT BUỘC (YES)** | Hàng năm |
| **Sentry / Error Tracker** | Quản lý cảnh báo lỗi và source maps | SRE Engineer | Lead Developer | **BẮT BUỘC (YES)** | Hàng quý |

## 2. Kênh Liên Lạc Xử Lý Sự Cố Khẩn Cấp (Incident Escalation)
- **Kênh thông báo nội bộ:** Nhóm phản ứng sự cố kỹ thuật (Emergency Incident Channel).
- **Quy trình Break-Glass:** Chỉ được kích hoạt bởi Primary Owner trong các tình huống SEV-1.

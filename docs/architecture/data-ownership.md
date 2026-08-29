# Kiến trúc Quyền Sở hữu & Phân định Nguồn Dữ liệu (Data Ownership & Source of Truth)

- **Mã tài liệu:** `ARCH-DATAOWN-01`
- **Mã Kiến trúc liên quan:** `AR-001`, `CNT-004`, `ADR-0005`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên ngôn Nguồn Sự Thật Duy Nhất (Single Source of Truth)

> **PostgreSQL (trong Supabase)** là **Nguồn Sự Thật Duy Nhất và Tối Cao** cho toàn bộ dữ liệu nghiệp vụ, phả hệ, quan hệ huyết thống, hôn phối và nhật ký kiểm toán của GenViet.
> Mọi biểu diễn đồ thị trong React Flow, bộ nhớ đệm trình duyệt (TanStack Query), hay các bản sao lưu JSON đều chỉ là **Bản Chiếu Dẫn Xuất (Derived Projections)**. Khi có sự sai khác, dữ liệu trong PostgreSQL luôn là chuẩn xác nhất.

---

## 2. Ma trận Phân định Quyền Sở hữu Dữ liệu (Data Ownership Matrix)

| Loại Thực thể Dữ liệu | Hệ thống Chủ quản (Owner) | Nguồn Sự Thật (Source of Truth) | Các Bản sao Dẫn xuất (Derived Copies) | Phân cấp Bảo mật & Riêng tư | Nguồn Phục hồi (Recovery Source) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Cây Gia phả (Trees)** | PostgreSQL | Bảng `public.trees` | Client Navigation State, Local Storage Key | `PRIVATE` | Database Backup / WAL |
| **Tài khoản (Users)** | Supabase Auth | Schema `auth.users` | JWT Claims, Server Session Cookie | `CONFIDENTIAL` | Supabase Auth Identity Store |
| **Thành viên (Persons)** | PostgreSQL | Bảng `public.persons` | React Flow Node ViewModels, Search Index | `RESTRICTED_PII` | PostgreSQL Table + Audit Log |
| **Quan hệ (Relationships)**| PostgreSQL | Bảng `public.relationships` | React Flow Edge ViewModels, Graph Slices | `RESTRICTED_PII` | PostgreSQL Table + Audit Log |
| **Hôn phối (Marriages)** | PostgreSQL | Bảng `public.marriages` | React Flow Union/Edge ViewModels | `RESTRICTED_PII` | PostgreSQL Table + Audit Log |
| **Metadata Ảnh Avatar** | PostgreSQL | Bảng `public.media_metadata` | Avatar Image URL trong Node Props | `PRIVATE` | PostgreSQL Table |
| **File Nhị phân Avatar** | Supabase Storage | Private Bucket `/avatars` | Browser Image Cache (Short TTL) | `PRIVATE_BINARY` | Object Store Replication |
| **Nhật ký Kiểm toán** | PostgreSQL | Bảng `public.audit_logs` | UI History Logs View | `INTERNAL_AUDIT` | PostgreSQL Append-only Log |
| **Tọa độ Node (x, y)** | Trình duyệt Client | Bộ nhớ RAM Client (ELK Output) | React Flow Canvas Viewport State | `NON_SENSITIVE_UI`| Tính toán lại tức thì qua ELK.js |

---

## 3. Các Ranh giới Dữ liệu Không Được Vi phạm

1. **Tọa độ không phải Quan hệ Gia đình:** Tọa độ `(x, y)` chỉ phục vụ mắt nhìn người dùng trên màn hình máy tính/điện thoại, không bao giờ được lưu vào bảng `relationships` hay coi là dữ liệu phả học.
2. **Không Lưu Binary vào Database:** Cấm tuyệt đối việc lưu trữ chuỗi ảnh Base64 hoặc dữ liệu nhị phân trực tiếp vào các cột trong PostgreSQL. Mọi hình ảnh phải lưu tại Object Storage và chỉ lưu mã khóa `object_key` trong CSDL.
3. **Derived Projections Không Ghi Ngược Trực Tiếp:** Trình duyệt không thể tự ý sửa một Node trên React Flow rồi ghi đè thẳng vào CSDL. Mọi thay đổi đều phải được đóng gói thành Command DTO hợp lệ và gửi qua Service Layer.

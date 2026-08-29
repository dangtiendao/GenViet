# Phân định Server Actions và Route Handlers (Actions vs Route Handlers)

- **Mã tài liệu:** `ARCH-ACTIONS-RH-01`
- **Mã Kiến trúc liên quan:** `AR-006`, `ADR-0003`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Ma trận Lựa chọn Cơ chế Xử lý Mutation & API Endpoints

| Thao tác / Use Case | Cơ chế Lựa chọn | Lý do Kiến trúc | Xác thực & Quyền hạn | Transaction Boundary | Invalidation / Phản hồi |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Tạo Cây Gia phả Mới** | `Server Action` | Thao tác form nội bộ, tích hợp progressive enhancement. | User JWT Cookie | Atomic (Tree + Membership) | `revalidatePath('/')` |
| **Khởi tạo Người Đầu tiên** | `Server Action` | Thao tác form onboarding sau khi tạo cây. | Tree Owner Check | Atomic (Person) | `revalidatePath('/tree/:id')` |
| **Thêm Cha / Mẹ mới** | `Server Action` | Form mutation đa trường, kiểm tra bất biến DAG. | Tree Owner Check | Atomic (Person + Relation + Audit) | `revalidatePath('/tree/:id')` |
| **Thêm Vợ / Chồng mới** | `Server Action` | Form mutation kiểm tra trùng lặp hôn nhân. | Tree Owner Check | Atomic (Person + Marriage + Audit)| `revalidatePath('/tree/:id')` |
| **Thêm Con cái mới** | `Server Action` | Form mutation gắn phụ mẫu, kiểm tra niên đại. | Tree Owner Check | Atomic (Person + Relation + Audit) | `revalidatePath('/tree/:id')` |
| **Liên kết Người có sẵn** | `Server Action` | Nối quan hệ giữa 2 node đã có, chặn chu trình. | Tree Owner Check | Atomic (Relation + Audit) | `revalidatePath('/tree/:id')` |
| **Chỉnh sửa Hồ sơ Thành viên**| `Server Action` | Cập nhật thông tin tiểu sử, ngày sinh, ngày mất. | Tree Owner Check | Atomic (Person + Audit) | `revalidatePath('/tree/:id')` |
| **Xóa Mềm Thành viên** | `Server Action` | Đánh dấu `is_deleted = true`, ngắt kết nối. | Tree Owner Check | Atomic (Person + Relation State) | `revalidatePath('/tree/:id')` |
| **Đổi Người Trung tâm Canvas**| `Server Action` / Client | Lưu tùy chọn góc nhìn của người dùng. | Tree Member Check | Single Record Update | Local State / Revalidate |
| **Ký URL Upload Avatar** | `Route Handler` | API cấp phép upload trực tiếp tới Object Store. | Tree Owner Check | None (Cấp token tạm thời) | Trả về `{ uploadUrl, key }` |
| **Xuất File Sao lưu JSON** | `Route Handler` | Stream binary/text attachment dung lượng lớn. | Tree Owner Check | Read-only Transaction + Audit | Stream Content-Disposition |
| **Auth PKCE Callback** | `Route Handler` | Xử lý redirect xác thực từ Supabase Auth. | Public Endpoint | Session Set Cookie | Redirect HTTP 303 |
| **Kiểm tra Sức khỏe (Healthz)**| `Route Handler` | Giám sát hệ thống từ GitHub Actions probe. | Internal Secret Key | None (Read-only probe) | Trả về `{"status":"ok"}` |

---

## 2. Các Quy tắc Kiến trúc Nghiêm ngặt (Enforcement Rules)

1. **Cấm Viết Logic Nghiệp vụ Trực tiếp trong Action/Handler:** Cả Server Action và Route Handler chỉ đóng vai trò là Cổng tiếp nhận (Entry Gateways). Nhiệm vụ của chúng là:
   - Xác thực danh tính người dùng qua phiên Supabase SSR.
   - Kiểm tra tính hợp lệ của DTO đầu vào bằng thư viện Zod.
   - **Chuyển tiếp lệnh gọi vào Service Layer tương ứng** (`TreeService`, `PersonService`, `RelationshipService`).
   - Xử lý mã lỗi trả về và điều phối revalidation.
2. **Cấm Sử dụng Phương thức HTTP GET cho Thao tác Thay đổi Dữ liệu:** Mọi hành vi tạo, sửa, xóa, ngắt liên kết bắt buộc phải dùng Server Action (POST) hoặc Route Handler với phương thức POST/PUT/DELETE.
3. **Idempotency (Tính Bất biến khi Gọi lại):** Các thao tác tạo quan hệ và upload file phải được thiết kế có Idempotency Key hoặc kiểm tra trạng thái trước khi thực thi để chống việc người dùng nhấn đúp (double-click) gây trùng lặp dữ liệu.

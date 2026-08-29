# Mô hình Đe dọa An ninh Hệ thống (Preliminary Threat Model - STRIDE)

- **Mã tài liệu:** `SEC-THREAT-01`
- **Mã Kiến trúc liên quan:** `THR-001..014`, `MIT-001..014`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Danh mục Tài nguyên Cần Bảo vệ (Asset Inventory)

1. **`AST-001` (Thông tin Đăng nhập & Mật khẩu):** Mật khẩu người dùng, JWT token, Refresh token.
2. **`AST-002` (Dữ liệu Gia phả Cá nhân):** Danh sách thành viên, ngày sinh, ngày mất, quê quán, tiểu sử dòng họ.
3. **`AST-003` (Hình ảnh Chân dung Riêng tư):** Các file ảnh avatar thành viên trong Private Storage.
4. **`AST-004` (Khóa Quản trị Hệ thống):** `SUPABASE_SERVICE_ROLE_KEY`, Database Password, Internal API Keys.
5. **`AST-005` (Bản Sao lưu Dữ liệu JSON):** Toàn văn file phả hệ xuất ra từ hệ thống.
6. **`AST-006` (Nhật ký Kiểm toán):** Lịch sử thay đổi dữ liệu trong `audit_logs`.

---

## 2. Bảng Phân tích 14 Mối Đe dọa An ninh Trọng yếu (STRIDE Threat Matrix)

| Mã Đe dọa | Loại STRIDE | Tài nguyên Tác động | Kịch bản Tấn công & Nguy cơ | Mức độ Rủi ro | Giải pháp Kiểm soát & Ngăn chặn (Mitigation Controls) | Phase Kiểm thử |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **`THR-001`** | Spoofing | `AST-001` | Tấn công dò mật khẩu (Brute-force / Credential Stuffing). | `CAO` | Supabase Auth Rate Limiting + Cloudflare WAF chặn IP độc hại. | `P09, P22` |
| **`THR-002`** | Tampering / Info | `AST-001` | Đánh cắp phiên qua XSS đọc `localStorage`. | `CAO` | **Lưu JWT trong HTTP-Only Secure Cookie**, không lưu vào `localStorage`. | `P09, P22` |
| **`THR-003`** | Elevation / Info | `AST-002` | Tấn công IDOR: Sửa `tree_id` để đọc cây của người khác. | `NGHIÊM TRỌNG`| **PostgreSQL Row Level Security (RLS)** lọc 100% bản ghi theo `owner_id`. | `P08, P22` |
| **`THR-004`** | Tampering | `AST-002` | Kẻ xấu gửi form sửa dữ liệu nhân vật thuộc cây khác. | `NGHIÊM TRỌNG`| Service Layer kiểm tra quyền sở hữu + CSDL RLS chặn lệnh `UPDATE`. | `P08, P22` |
| **`THR-005`** | Information Leak | `AST-002` | Cấu hình RLS bị thiếu hoặc hở chính sách `FOR SELECT`. | `CAO` | Bộ test tự động kiểm thử phân quyền chéo cây (Cross-tree test suite). | `P08, P22` |
| **`THR-006`** | Elevation of Priv | `AST-004` | Lộ `SUPABASE_SERVICE_ROLE_KEY` trong mã nguồn JavaScript tải về máy khách. | `NGHIÊM TRỌNG`| **Chỉ thị `import 'server-only'`**, chỉ dùng `NEXT_PUBLIC_ANON_KEY` ở client. | `P05, P22` |
| **`THR-007`** | Information Leak | `AST-003` | Người ngoài lấy được link ảnh chân dung riêng tư. | `TRUNG BÌNH` | Khóa Storage Private Bucket + Cấp Signed URL thời hạn ngắn $\le 15$ phút. | `P17, P22` |
| **`THR-008`** | Tampering | `AST-003` | Upload file mã độc (PHP/HTML/SVG chứa script độc). | `CAO` | Kiểm tra MIME type (chỉ JPG, PNG, WebP) và dung lượng $< 5\text{MB}$ tại Storage Policy. | `P17, P22` |
| **`THR-009`** | Tampering (XSS) | `AST-002` | Chèn mã `<script>` vào trường Họ tên hoặc Tiểu sử. | `CAO` | React tự động escape HTML + Sanitize dữ liệu văn bản trước khi render. | `P11, P22` |
| **`THR-010`** | Tampering (SQLi) | `AST-002` | Tấn công SQL Injection qua ô tìm kiếm tên thành viên. | `CAO` | Sử dụng Parametrized Queries 100% qua Supabase PostgREST SDK. | `P07, P22` |
| **`THR-011`** | Tampering | `AST-002` | Tạo vòng lặp thế hệ phi lý làm sập thuật toán vẽ cây. | `CAO` | **DAG Invariant Validator (`INV-004`)** kiểm tra chu trình trước khi ghi DB. | `P13, P22` |
| **`THR-012`** | Information Leak | `AST-005` | Tải trộm file sao lưu JSON của người khác. | `NGHIÊM TRỌNG`| Route Handler kiểm tra quyền sở hữu cây bằng JWT trước khi stream file. | `P20, P22` |
| **`THR-013`** | Information Leak | `AST-001` | Lộ mật khẩu hoặc access token trong log server. | `CAO` | Bộ lọc dữ liệu log (Log Redaction) loại bỏ trường `password`, `token`, `key`. | `P18, P22` |
| **`THR-014`** | Denial of Service | `AST-002` | Gửi request truy vấn toàn bộ 1.000 node gây nghẽn mạng. | `TRUNG BÌNH` | Phân trang lát cắt cây (Tree Viewport Slice 30-50 nodes quanh Center). | `P15, P23` |

---

## 3. Tuyên bố Giới hạn An ninh (Security Disclaimer)
GenViet áp dụng nguyên tắc **Phòng thủ Chiều sâu (Defense-in-Depth)** và **Bảo mật theo Mặc định (Security-by-Default)**. Tuy nhiên, hệ thống không tuyên bố khả năng chống đỡ tuyệt đối 100% trước mọi hình thái tấn công có chủ đích; quy trình kiểm toán an ninh và cập nhật vá lỗ hổng sẽ được duy trì liên tục trong suốt vòng đời dự án.

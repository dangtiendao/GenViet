# Bộ Nguyên tắc Kiến trúc Kỹ thuật Hệ thống (Architecture Principles)

- **Mã tài liệu:** `ARCH-PRINCIPLES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Tuyên ngôn Kiến trúc Cốt lõi (Core Architecture Statement)

> Kiến trúc hệ thống của **GenViet** được xây dựng trên nền tảng **Server-First, CSDL là Nguồn Sự Thật, Phân quyền Đa tầng và Độc lập Nền tảng**:
> - Đảm bảo tính toàn vẹn dữ liệu phả hệ và bảo vệ quyền riêng tư tuyệt đối cho gia đình.
> - Tách biệt triệt để logic đồ thị gia phả (Domain Graph) khỏi lớp trình bày hiển thị (React Flow Canvas).
> - Triển khai ban đầu mượt mà trên Vercel / Supabase nhưng sẵn sàng chuyển dịch linh hoạt sang Cloudflare mà không phải viết lại nghiệp vụ cốt lõi.

---

## 2. 12 Nguyên tắc Kiến trúc Cốt lõi (The 12 Core Architecture Rules)

1. **`AR-001` (PostgreSQL là Nguồn Sự Thật Duy Nhất - Single Source of Truth):** Toàn bộ dữ liệu thành viên, quan hệ cha mẹ, hôn phối, cài đặt cây và nhật ký kiểm toán phải được lưu trữ và đảm bảo tính toàn vẹn trong PostgreSQL. React Flow state, Client Cache hay Derived Index chỉ là các bản chiếu (projections) tạm thời.
2. **`AR-002` (Tách biệt Hoàn toàn Domain Graph khỏi Presentation Graph):** Tọa độ `(x, y)` và các node/edge của React Flow không phải là quan hệ gia đình. Việc thay đổi thư viện render (ví dụ: chuyển từ React Flow sang SVG/Canvas) hay engine layout (ELK sang D3) tuyệt đối không làm ảnh hưởng tới cấu trúc bảng dữ liệu nghiệp vụ.
3. **`AR-003` (Cưỡng chế Phân quyền tại CSDL qua Row Level Security):** Phân quyền truy cập dữ liệu bắt buộc phải được kích hoạt và thực thi ở cấp độ CSDL PostgreSQL thông qua RLS. Ẩn nút trên UI hay kiểm tra quyền ở Server Component chỉ đóng vai trò cải thiện trải nghiệm (fail-fast UX), không được xem là ranh giới an ninh duy nhất.
4. **`AR-004` (Không Để Lộ Service-Role Key ra Client):** Khóa `SUPABASE_SERVICE_ROLE_KEY` chỉ được phép cấu hình trong môi trường server-side an toàn cho các tác vụ đặc biệt (background worker, cleanup). Trình duyệt của người dùng chỉ nhận `ANON_KEY` và JWT phiên đăng nhập hợp lệ.
5. **`AR-005` (Server-First by Default - Client Boundary Tối thiểu):** Mặc định mọi trang, layout và dữ liệu được render từ Server Components. Client Components (`'use client'`) chỉ được sử dụng tại các lá cuối cùng của cây component (leaf-nodes) nơi thực sự cần tương tác DOM, React Flow canvas, mở Bottom Sheet hoặc quản lý form state cục bộ.
6. **`AR-006` (Phân định Rạch ròi Server Actions vs Route Handlers):** Sử dụng Server Actions cho các thao tác mutation gắn liền với form trong ứng dụng nội bộ (tạo người, thêm quan hệ, đổi trung tâm); sử dụng Route Handlers (`/api/*`) cho các tác vụ HTTP chuẩn, auth callback, webhook, stream download backup JSON và ký URL upload binary.
7. **`AR-007` (Kiến trúc Phân tầng: Service Layer và Repository Layer):** Mọi nghiệp vụ phức tạp (kiểm tra bất biến DAG, kiểm tra niên đại, điều phối transaction, ghi audit) phải nằm trong Application Service. Repository chỉ phụ trách truy vấn dữ liệu thô. UI Component tuyệt đối không được gọi Supabase SDK trực tiếp để thực hiện mutation đa bước.
8. **`AR-008` (Ranh giới Giao dịch Nguyên tử - Atomic Transaction Boundaries):** Các thao tác tạo người mới kèm quan hệ phụ mẫu, xóa mềm kèm ngắt liên kết, đổi mốc số đời phải được bọc trong một transaction duy nhất. Nghiêm cấm để lại "dữ liệu mồ côi" (orphan Person) khi việc nối quan hệ bị lỗi.
9. **`AR-009` (Cô lập Nhà cung cấp qua Adapter Seams):** Lưu trữ nhị phân (Storage) và Dịch vụ gửi Email (nếu có) phải đi qua lớp Adapter Interface. Ứng dụng ban đầu dùng Supabase Storage nhưng sẵn sàng chuyển sang Cloudflare R2 thông qua việc cắm Storage Adapter mới mà không sửa domain service.
10. **`AR-010` (Không Khóa vào Dịch vụ Dữ liệu Độc quyền của Vercel):** Cấm sử dụng Vercel Blob, Vercel KV hay Vercel Postgres trong mã nguồn nghiệp vụ. Vercel chỉ đóng vai trò là hạ tầng host runtime ban đầu. Mã nguồn phải tuân thủ chuẩn Web APIs (Fetch, Request, Response, Web Crypto, Cookies) để sẵn sàng chạy trên Cloudflare Workers.
11. **`AR-011` (Bảo mật Mặc định & Cách ly Bộ nhớ Đệm Cá nhân):** Dữ liệu gia phả riêng tư không bao giờ được cache công khai trên Public Shared CDN. Cache ở cấp độ Server Data Cache bắt buộc phải gắn khóa theo `User ID` và `Tree ID`.
12. **`AR-012` (Không Dựa vào Bộ nhớ Tiến trình hoặc Ổ đĩa Cục bộ Lâu dài):** Ứng dụng được thiết kế theo mô hình hoàn toàn phi trạng thái (Stateless Request Processing). Không lưu session hay file tạm vào bộ nhớ memory của server giữa các request, không phụ thuộc vào local filesystem có thể ghi (writable disk).

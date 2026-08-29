# Nhật ký Quyết định Dự án GenViet (Decision Log)

Tài liệu này tổng hợp toàn bộ các quyết định kỹ thuật, kiến trúc và quản trị đã được phê duyệt trong suốt vòng đời dự án **GenViet**.

---

## 1. Danh sách Quyết định đã Khóa (Locked Decisions - Nền tảng)

Các quyết định dưới đây tạo thành khung nguyên tắc nền tảng của dự án và không được tự ý sửa đổi khi chưa có sự chấp thuận bằng văn bản của Project Owner:

| Mã Quyết định | Tiêu đề quyết định | Trạng thái | Ngày khóa | Tóm tắt nội dung |
| :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | Tên dự án & Repository | `ACCEPTED` | 2026-08-29 | Tên thương hiệu là **GenViet**, tên kỹ thuật là `genviet`. |
| **DEC-002** | Nguồn dữ liệu chính | `ACCEPTED` | 2026-08-29 | Sử dụng **PostgreSQL** (thông qua Supabase) làm CSDL chính cho toàn bộ dữ liệu nghiệp vụ. |
| **DEC-003** | Tách biệt User & Person | `ACCEPTED` | 2026-08-29 | **Tài khoản người dùng (User)** và **Nhân vật gia phả (Person)** là 2 thực thể độc lập. Một tài khoản có thể quản lý nhiều cây/nhân vật. |
| **DEC-004** | Quy trình Phase bắt buộc | `ACCEPTED` | 2026-08-29 | Mọi giai đoạn thi công phải tuân thủ 8 cổng kiểm soát (G0 - G7) và bộ 10 tài liệu chuẩn. |
| **DEC-005** | Tính trung lập nền tảng | `ACCEPTED` | 2026-08-29 | Không phụ thuộc sâu vào các API độc quyền của Vercel nhằm đảm bảo dễ dàng chuyển đổi sang Cloudflare trong tương lai. |
| **DEC-006** | Bảo mật Secret & Git | `ACCEPTED` | 2026-08-29 | Tuyệt đối không commit file `.env`, service role keys, API token hay dữ liệu cá nhân thật vào Git. |
| **DEC-007** | Ràng buộc An toàn Git cho AI | `ACCEPTED` | 2026-08-29 | AI chỉ được tạo nhánh và commit cục bộ. Cấm tuyệt đối AI push, merge, force-push hoặc tạo PR từ xa. |
| **DEC-008** | Công nghệ Visualization | `ACCEPTED` | 2026-08-29 | Sử dụng kết hợp **React Flow** (tương tác đồ thị) và **ELK.js** (thuật toán tính toán layout phân tầng tự động). |

---

## 2. Nhật ký Quyết định theo từng Phase

### Phase P00: Quản trị dự án (Project Governance)

- **DEC-P00-01 (Cấu trúc tài liệu phân tầng):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* Áp dụng cấu trúc thư mục `docs/` module hóa theo domain (`product`, `architecture`, `database`, `security`, `testing`, `operations`, `phases`, `decisions`, `risks`, `prompts`, `templates`).
  - *Lý do:* Giúp AI và kỹ sư con người dễ dàng định vị ngữ cảnh, tránh nhồi nhét toàn bộ thông tin vào một file lớn gây tràn ngữ cảnh (context window).

- **DEC-P00-02 (Quy chuẩn Commit Scope):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* Bắt buộc áp dụng Conventional Commits có scope phase: `<type>(PXX): <mô tả>`.
  - *Lý do:* Giúp truy vết lịch sử commit tương ứng chính xác với từng phase và dễ dàng tự động hóa việc xuất changelog.

### Phase P01: Chốt phạm vi sản phẩm (Product Scope Definition)

- **P01-DEC-001 (Mô hình Single-Owner cho MVP v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* v0.1 tập trung vào trải nghiệm một cá nhân tự quản lý gia phả; hoãn phân quyền cộng tác đa người dùng sang v0.2+.
  - *Lý do:* Giữ kiến trúc đơn giản, giảm thiểu rủi ro xung đột ghi đè đồng thời và tăng tốc độ ra mắt MVP.

- **P01-DEC-002 (Khởi tạo từ Node Bất kỳ & Mở rộng Tổ tiên Đa chiều):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* Cho phép bắt đầu cây từ bất kỳ nhân vật nào và bổ sung cha mẹ lên trên hoặc con cháu xuống dưới linh hoạt.
  - *Lý do:* Phù hợp với thực tế thu thập dữ liệu chắp vá của người dùng Việt Nam.

- **P01-DEC-003 (Xuất JSON là Must-Have, Nhập JSON là Should-Have):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED_FOR_APPROVAL`
  - *Nội dung:* Bắt buộc tính năng Xuất JSON sao lưu trong v0.1; tính năng Nhập JSON xếp mức Should.
  - *Lý do:* Đảm bảo an toàn dữ liệu cho người dùng trước, tránh phát sinh lỗi phức tạp khâu parse schema.

- **P01-DEC-004 (Ngưỡng Quy mô 1.000 người & Cửa sổ Hiển thị 2-3 đời):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `ACCEPTED`
  - *Nội dung:* CSDL hỗ trợ lưu 1.000 người/cây; Canvas đồ thị hiển thị cửa sổ 50-80 node (2-3 thế hệ) quanh người trung tâm.
  - *Lý do:* Đảm bảo hiệu năng mượt mà $\ge 45\text{ FPS}$ trên điện thoại thông minh.

### Phase P02: Phân tích nghiệp vụ gia phả (Genealogy Domain Analysis)

- **P02-DEC-001 (Phân định Rạch ròi 4 Loại Người Mốc):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Tách biệt 4 khái niệm độc lập: Initial Person (thứ tự tạo), Center Person (trọng tâm nhìn), Founding Ancestor (danh hiệu danh dự), Generation Anchor (mốc Đời 1).
  - *Lý do:* Loại bỏ các giả định sai lầm và cho phép mở rộng cây đa chiều linh hoạt.

- **P02-DEC-002 (Xử lý Cha Mẹ Kế & Giám Hộ trong v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Cha Mẹ Kế là quan hệ suy ra từ Hôn nhân; Giám Hộ lưu ở dạng ghi chú Profile, không vẽ đường nối trên Canvas chính ở v0.1.
  - *Lý do:* Giữ đồ thị trực quan, tập trung vào huyết thống và hôn phối trực tiếp.

- **P02-DEC-003 (Cấm Điền Ngày Giả 01/01 & Bảo toàn Date Precision):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Lưu đồng thời giá trị niên đại và mã precision; cấm tự tiện biến năm sinh thành ngày giả `01/01`.
  - *Lý do:* Tôn trọng tính trung thực của dữ liệu lịch sử phả hệ.

- **P02-DEC-004 (Cấm Tự ý Xóa Lan Truyền - No Silent Cascade):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Xóa một Person chỉ ngắt kết nối trực tiếp của người đó; toàn bộ con cái, cha mẹ, vợ chồng vẫn giữ nguyên vẹn trên cây.
  - *Lý do:* Bảo vệ dữ liệu phả hệ khỏi các thao tác xóa nhầm tai hại.

- **P02-DEC-005 (Số Đời Tính Tương Đối theo Anchor):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Số đời là nhãn hiển thị tương đối theo Mốc (Anchor = 1); thêm tổ tiên phía trên không ép đổi số đời toàn cây.
  - *Lý do:* Tránh việc cập nhật hàng loạt số đời trong CSDL mỗi khi thêm cụ tổ mới.

### Phase P03: Thiết kế UX và luồng màn hình (UX Design & Screen Flows)

- **P03-DEC-001 (Cấu trúc Bottom Navigation 4 Mục Cố định trên Mobile):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Khóa cố định 4 mục: Cây (`NAV-M01`), Tìm kiếm (`NAV-M02`), Cài đặt (`NAV-M03`), Tôi (`NAV-M04`).
  - *Lý do:* Tối ưu hóa không gian hiển thị, dễ chạm bằng ngón cái và tuân thủ Safe Area.

- **P03-DEC-002 (Ngăn Kéo Đáy 3 Nấc - Bottom Sheet cho Hồ sơ Di động):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Sử dụng Bottom Sheet với 3 nấc: Peek (80px), Half (45%), Full (90%) thay vì mở trang full-screen.
  - *Lý do:* Giữ nguyên ngữ cảnh quan sát đồ thị cây phía sau khi người dùng xem thông tin thành viên.

- **P03-DEC-003 (Mẫu Form Quan hệ 2 Tab - Tạo Mới vs Chọn Có Sẵn):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Mọi form thêm Cha, Mẹ, Vợ/Chồng, Con đều chia 2 Tab rõ ràng: Tạo người mới và Chọn người có sẵn.
  - *Lý do:* Tách biệt rạch ròi 2 ý định người dùng và loại bỏ nhầm lẫn giữa Nối quan hệ và Gộp hồ sơ.

- **P03-DEC-004 (Bộ chọn Date Precision Trực tiếp trong Biểu mẫu):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Tích hợp bộ chọn độ chính xác ngày tháng (Chính xác, Tháng/Năm, Chỉ năm, Ước tính), không ép chọn `01/01`.
  - *Lý do:* Tuân thủ nguyên tắc tôn trọng dữ liệu lịch sử và Invariant `INV-010`.

- **P03-DEC-005 (Xem trước Tác động Bắt buộc khi Xóa Mềm):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROVISIONAL`
  - *Nội dung:* Hộp thoại xóa mềm luôn liệt kê số lượng quan hệ bị ngắt và cam kết bảo toàn dữ liệu người thân (`INV-015`).
  - *Lý do:* Loại bỏ nỗi sợ mất dữ liệu của người dùng khi xóa 1 nhân vật trung gian.

### Phase P04: Thiết kế kiến trúc (System Architecture)

- **ADR-0001 (Next.js App Router làm Kiến trúc Định tuyến & Render chính):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0001-app-router.md`](./ADR-0001-app-router.md)
  - *Nội dung:* Lựa chọn App Router hỗ trợ Server-First SSR, tối ưu bundle mobile $< 150\text{KB}$.

- **ADR-0002 (Quy tắc Server-First & Phân định Ranh giới Client Components):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0002-server-client-boundaries.md`](./ADR-0002-server-client-boundaries.md)
  - *Nội dung:* Server Components mặc định; Client Components chỉ dùng cho lá tương tác (Canvas, Sheet, Form).

- **ADR-0003 (Phân định Server Actions vs Route Handlers):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0003-server-actions-and-route-handlers.md`](./ADR-0003-server-actions-and-route-handlers.md)
  - *Nội dung:* Server Actions cho Form Mutations nội bộ; Route Handlers cho HTTP API / File Streams.

- **ADR-0004 (Supabase Auth làm Nền tảng Định danh cho MVP v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0004-supabase-auth.md`](./ADR-0004-supabase-auth.md)
  - *Nội dung:* Sử dụng Supabase Auth email/password, cookie SSR, tách biệt User và Person (`INV-001`).

- **ADR-0005 (PostgreSQL là Nguồn Sự Thật Duy Nhất):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0005-postgresql-source-of-truth.md`](./ADR-0005-postgresql-source-of-truth.md)
  - *Nội dung:* PostgreSQL (Supabase) là Single Source of Truth cho toàn bộ thực thể; React Flow chỉ là view model.

- **ADR-0006 (Row Level Security RLS là Lớp Phân quyền Cuối cùng):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0006-rls-authorization-boundary.md`](./ADR-0006-rls-authorization-boundary.md)
  - *Nội dung:* Kích hoạt 100% RLS tại CSDL, ngăn chặn triệt để tấn công IDOR và truy cập chéo cây.

- **ADR-0007 (Supabase Storage Private Bucket cho Avatar MVP v0.1):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0007-supabase-storage-for-mvp.md`](./ADR-0007-supabase-storage-for-mvp.md)
  - *Nội dung:* Bucket private, cấp Signed URL ngắn hạn $\le 15$ phút, dọn dẹp file rác tự động.

- **ADR-0008 (React Flow làm Thư viện Trình bày Đồ thị Tương tác):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0008-react-flow-presentation.md`](./ADR-0008-react-flow-presentation.md)
  - *Nội dung:* React Flow chỉ phụ trách Presentation Canvas; cung cấp màn hình Danh sách/Tìm kiếm cho Screen Reader.

- **ADR-0009 (ELK.js làm Thuật toán Tính toán Bố cục Phân tầng Tự động):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0009-elkjs-layout-engine.md`](./ADR-0009-elkjs-layout-engine.md)
  - *Nội dung:* Thuật toán `elk.layered` tính tọa độ `(x, y)`; hỗ trợ Web Worker chạy ngầm $\ge 45\text{ FPS}$.

- **ADR-0010 (Phân tách Triệt để 4 Lớp Đồ thị Phả hệ):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0010-domain-presentation-graph-separation.md`](./ADR-0010-domain-presentation-graph-separation.md)
  - *Nội dung:* Tách Domain Graph, Query Graph Slice, Layout Graph (ELK) và Presentation Graph (React Flow).

- **ADR-0011 (Kiến trúc Phân tầng Repository Layer và Service Layer):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0011-repository-and-service-layers.md`](./ADR-0011-repository-and-service-layers.md)
  - *Nội dung:* 7 Repository Interfaces và 8 Domain Service Interfaces độc lập hoàn toàn khỏi UI framework.

- **ADR-0012 (Thiết kế Adapter Seams cho Storage và Email):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0012-storage-and-email-adapters.md`](./ADR-0012-storage-and-email-adapters.md)
  - *Nội dung:* Cô lập Supabase Storage / Cloudflare R2 qua `IStorageAdapter` và Email qua `IEmailAdapter`.

- **ADR-0013 (Chiến lược Bộ nhớ Đệm Caching Cách ly Dữ liệu Riêng tư):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0013-cache-strategy-private-data.md`](./ADR-0013-cache-strategy-private-data.md)
  - *Nội dung:* Cấm Public CDN cache dữ liệu cá nhân; Server Cache gắn khóa `uid` và `tree_id`.

- **ADR-0014 (Nguyên tắc Không Phụ thuộc vào Dịch vụ Dữ liệu Độc quyền Vercel):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0014-zero-vercel-data-services-lock-in.md`](./ADR-0014-zero-vercel-data-services-lock-in.md)
  - *Nội dung:* Cấm dùng Vercel Blob/KV/Postgres, cấm import `@vercel/*` SDK trong Service Layer.

- **ADR-0015 (Tính Linh động Runtime và Sẵn sàng Chuyển sang Cloudflare):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0015-runtime-portability-cloudflare-readiness.md`](./ADR-0015-runtime-portability-cloudflare-readiness.md)
  - *Nội dung:* Tuân thủ Web APIs chuẩn (Fetch, Crypto, Cookies), quy trình 10 bước chuyển sang Workers.

- **ADR-0016 (Kiến trúc Ghi nhận Nhật ký Kiểm toán Nghiệp vụ):**
  - *Ngày:* 2026-08-29 | *Trạng thái:* `PROPOSED`
  - *Tệp tin:* [`ADR-0016-audit-architecture.md`](./ADR-0016-audit-architecture.md)
  - *Nội dung:* Ghi sự kiện phả hệ vào bảng `audit_logs` cùng transaction, cấm ghi secret/token.

---

## 3. Danh sách các Quyết định mở / Đang thảo luận (Open Decisions)

1. **OPEN-DEC-01 (Giấy phép mã nguồn - License):** Quyết định lựa chọn giữa AGPLv3, MIT hoặc Proprietary (Bản quyền đóng). Tạm hoãn xem xét ở giai đoạn trước khi phát hành MVP.
2. **OPEN-DEC-02 (Provider gửi Email Giao dịch khi Nâng cấp v0.2+):** Lựa chọn giữa Resend và Postmark cho phân hệ `IEmailAdapter`. Đề xuất Resend, quyết định chính thức khi làm v0.2.


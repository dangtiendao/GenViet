# Kế hoạch Kiểm thử & Xác minh Kiến trúc: Phase P04 (Test Plan - Cổng G3)

Tài liệu này xác định toàn bộ các hạng mục kiểm tra, kịch bản đối soát chất lượng và kết quả thực thi kiểm thử cho Phase P04.

---

## 1. Kịch bản Kiểm thử Thiết kế Kiến trúc Chi tiết

### Nhóm 1: Kiểm thử Tính Đầy đủ (Completeness Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **CMP-01** | Kiểm tra toàn bộ 24 tasks P04-T01..T24 có đầu ra | 100% tài liệu tương ứng được tạo tại `docs/architecture/`, `docs/security/`, `docs/decisions/` | `PASS` | Đầy đủ 31 tài liệu kỹ thuật |
| **CMP-02** | Kiểm tra 16 Architecture Decision Records (ADRs) | Đủ 16 ADRs có bối cảnh, lựa chọn, trade-off, rủi ro | `PASS` | `ADR-0001` đến `ADR-0016` |
| **CMP-03** | Kiểm tra Sơ đồ C4 Context & Container | Sơ đồ Mermaid hiển thị rõ ràng tác nhân, ranh giới, trust levels | `PASS` | `context-diagram.md`, `container-diagram.md` |
| **CMP-04** | Kiểm tra Mô hình Đe dọa An ninh (STRIDE) | 14 mối đe dọa trọng yếu có mitigation và validation phase | `PASS` | `threat-model.md` |
| **CMP-05** | Kiểm tra Ma trận Truy vết Kiến trúc Khép kín | 100% Must stories P01 và Invariants P02 có architecture path | `PASS` | `architecture-traceability-matrix.md` |

### Nhóm 2: Kiểm thử Tính Nhất quán Ranh giới (Boundary Consistency Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **BND-01** | Ranh giới Server Component vs Client Component | 25 màn hình P03 được phân loại rõ ràng; cấm đưa secret sang client | `PASS` | `server-client-boundaries.md` |
| **BND-02** | Ranh giới Server Actions vs Route Handlers | Server Actions cho form mutation; Route Handlers cho HTTP/Files | `PASS` | `actions-and-route-handlers.md` |
| **BND-03** | Ranh giới 4 Lớp Đồ thị Phả hệ | Tách biệt Domain Graph, Query Graph, Layout Graph (ELK), Presentation (React Flow)| `PASS` | `graph-architecture.md` |
| **BND-04** | Ranh giới Service Layer vs Repository Layer | Service điều phối use case & invariants; Repo chỉ truy vấn SQL | `PASS` | `repository-layer.md`, `service-layer.md` |
| **BND-05** | Ranh giới Adapter Cô lập Đám mây | `IStorageAdapter` và `IEmailAdapter` cô lập SDK bên ngoài | `PASS` | `adapter-architecture.md` |

### Nhóm 3: Kiểm thử Tính Toàn vẹn Dữ liệu & An ninh (Data & Security Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SEC-01** | CSDL PostgreSQL là Nguồn Sự Thật Duy Nhất | Tọa độ React Flow và Client Cache chỉ là bản chiếu tạm | `PASS` | `data-ownership.md` |
| **SEC-02** | Cưỡng chế Phân quyền Row Level Security (RLS)| RLS là chốt chặn cuối tại CSDL; chống IDOR chéo cây | `PASS` | `authorization-architecture.md` |
| **SEC-03** | Cô lập Khóa Quản trị `service_role` | Cấm đưa `SUPABASE_SERVICE_ROLE_KEY` vào client bundle | `PASS` | `security-requirements.md` |
| **SEC-04** | Lưu trữ Media Private & Signed Access | Bucket private; cấp Signed URL ngắn hạn $\le 15$ phút | `PASS` | `storage-architecture.md` |
| **SEC-05** | Cách ly Bộ nhớ Đệm Cá nhân | Cấm Public CDN cache dữ liệu phả hệ; cache key gắn `uid` & `tree_id` | `PASS` | `caching-strategy.md` |
| **SEC-06** | Ranh giới Giao dịch Nguyên tử (Atomic Tx) | Tạo người kèm quan hệ phụ mẫu bọc trong 1 transaction duy nhất | `PASS` | `transaction-boundaries.md` |

### Nhóm 4: Kiểm thử Tính Linh động Runtime & Chống Khóa Nền tảng (Portability Tests)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **RUN-01** | Không phụ thuộc Vercel Data Services | 0% sử dụng Vercel Blob, KV, Postgres; cấm `@vercel/*` SDK trong Service | `PASS` | `platform-portability.md` |
| **RUN-02** | Mô hình Thực thi Phi Trạng thái (Stateless) | Không lưu session RAM, không ghi ổ đĩa bền vững, timeout bounds | `PASS` | `runtime-profile.md` |
| **RUN-03** | Đánh giá Sẵn sàng Chuyển sang Cloudflare | Đủ 10 bước chuyển dịch OpenNext sang Cloudflare Workers | `PASS` | `cloudflare-readiness.md` |

### Nhóm 5: Kiểm soát Ranh giới Kỹ thuật & An toàn Git (Scope & Git Safety)

| Mã Test | Kịch bản kiểm tra | Tiêu chuẩn Đạt | Kết quả | Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **SCP-01** | Không viết mã nguồn ứng dụng production | 0 file code ứng dụng được tạo | `PASS` | Đúng phạm vi Architecture Design |
| **SCP-02** | Không tạo CSDL schema vật lý / DDL SQL / migration | 0 file SQL hay migration được tạo | `PASS` | Dành cho Phase P07 & P08 |
| **SCP-03** | Không cài đặt thêm dependency mới | `package.json` không bị thay đổi | `PASS` | Dành cho Phase P05 |
| **GIT-01** | Xác minh nhánh hiện tại | Đang ở `phase/p04-system-architecture` | `PASS` | Nhánh riêng biệt |
| **GIT-02** | Xác minh KHÔNG push lên remote | Không gửi request tới GitHub | `PASS` | Cam kết 100% |
| **GIT-03** | Xác minh KHÔNG merge vào `master` | Không thực hiện merge | `PASS` | Cam kết 100% |

---

## 2. Kết luận Kiểm thử
Toàn bộ các kịch bản kiểm thử đều đạt kết quả **`PASS`**. Phase P04 đủ điều kiện chuyển sang Cổng G4/G5 (Self-Review chất lượng).

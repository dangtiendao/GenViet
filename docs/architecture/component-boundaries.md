# Phân định Ranh giới Thành phần Kiến trúc (Component Boundaries)

- **Mã tài liệu:** `ARCH-BOUNDARIES-01`
- **Mã Kiến trúc liên quan:** `CMP-001..010`, `BND-001..004`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Bản đồ Ranh giới Phân tầng Ứng dụng (Layer Boundaries)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [ BND-001: CLIENT BOUNDARY ] (Trình duyệt / PWA)                       │
│  • React Flow Canvas Component                                         │
│  • Mobile Bottom Sheet & Form Components                               │
│  • Local Presentation State & Event Handlers                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Props qua ranh giới phải serializable)
┌───────────────────────────────────▼────────────────────────────────────┐
│ [ BND-002: APPLICATION ENTRY BOUNDARY ] (Next.js App Router Server)    │
│  • Server Components (RSC): Layouts, Pages, Initial Load               │
│  • Server Actions: Form Mutation Enpoints (CSRF protected)             │
│  • Route Handlers: /api/auth, /api/media/sign, /api/backup/export      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Typed DTO / Command Objects)
┌───────────────────────────────────▼────────────────────────────────────┐
│ [ BND-003: DOMAIN & SERVICE BOUNDARY ] (Lõi Nghiệp vụ Độc lập)         │
│  • TreeService, PersonService, RelationshipService, BackupService      │
│  • DAG Invariant Validator, Chronological Validator                    │
│  • Audit Coordinator & Transaction Coordinators                        │
│  • Storage Adapter Interface, Email Adapter Interface                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Repository Query Contracts)
┌───────────────────────────────────▼────────────────────────────────────┐
│ [ BND-004: PERSISTENCE & DATA BOUNDARY ] (Supabase Managed PostgreSQL) │
│  • TreeRepo, PersonRepo, RelationshipRepo, AuditRepo                   │
│  • PostgreSQL Tables, Constraints, Triggers                            │
│  • Row Level Security (RLS) Policies                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Bảng Danh mục 10 Thành phần Kiến trúc Chính (Components)

| Mã Component | Tên Thành phần | Phân tầng | Trách nhiệm Duy nhất (Single Responsibility) | Không được Làm (Anti-patterns cấm) |
| :--- | :--- | :--- | :--- | :--- |
| **`CMP-001`** | **Tree Presentation Engine** | Client | Nhận Layout Graph $\rightarrow$ Render React Flow Canvas, bắt sự kiện Pan/Zoom. | ❌ Không tính toán quan hệ phả hệ, không gọi DB trực tiếp. |
| **`CMP-002`** | **ELK Layout Worker** | Client | Nhận danh sách kích thước node $\rightarrow$ Tính toán tọa độ `(x, y)` phân tầng. | ❌ Không sửa đổi dữ liệu Person hay quan hệ. |
| **`CMP-003`** | **Server Page Controllers** | Server RSC | Tải dữ liệu ban đầu cho Tree, Profile, Search qua Services và truyền Props. | ❌ Không chứa business validation hay database mutation. |
| **`CMP-004`** | **Mutation Actions Handler** | Server SA | Nhận form submission từ Client $\rightarrow$ Validate schema $\rightarrow$ Gọi Service tương ứng. | ❌ Không viết SQL hay transaction trực tiếp trong action. |
| **`CMP-005`** | **Route Handlers Gateway** | Server RH | Xử lý streaming download JSON backup, upload signing, auth callbacks. | ❌ Không dùng GET cho các thao tác thay đổi dữ liệu. |
| **`CMP-006`** | **Genealogy Domain Services** | Service Layer | Thực thi Use Case: Thêm cha/mẹ/vợ/con, đổi Center, kiểm tra DAG Invariant. | ❌ Không phụ thuộc React UI hay HTTP Request/Response. |
| **`CMP-007`** | **Transaction Coordinator** | Service Layer | Bọc các thao tác đa bước (tạo người + quan hệ, xóa mềm + ngắt nối) vào transaction. | ❌ Không để transaction mở quá lâu chờ external HTTP call. |
| **`CMP-008`** | **Audit Logger Module** | Service Layer | Ghi nhận sự kiện thay đổi dữ liệu vào bảng audit có gắn `tree_id`, `actor_id`. | ❌ Không ghi mật khẩu, token hay thông tin nhạy cảm. |
| **`CMP-009`** | **Storage Adapter** | Adapter Layer | Ký URL upload/download ảnh đại diện, giao tiếp với Supabase Storage / R2. | ❌ Không để lộ bucket credentials hay URL vĩnh viễn. |
| **`CMP-010`** | **Scoped Repositories** | Data Access | Thực hiện các câu truy vấn CRUD có gắn kèm điều kiện `tree_id` và RLS context. | ❌ Không trả raw SDK error khó hiểu ra tầng UI. |

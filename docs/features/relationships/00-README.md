# Phân Hệ Quản Lý Quan Hệ Phả Hệ (Relationship Management) - GenViet

Phân hệ Quản lý quan hệ (**Relationship Management**) cung cấp năng lực kết nối, quản lý huyết thống (cha mẹ, con cái) và quan hệ hôn nhân (vợ chồng, kết đôi) trong cây gia phả phiên bản **v0.1**.

---

## 1. Mục Tiêu & Phạm Vi
- **Thao tác Huyết Thống (Parent-Child Directed Graph):**
  - Hướng quan hệ cố định: `Parent -> Child`.
  - Hỗ trợ thêm cha mới / mẹ mới hoặc liên kết cha/mẹ có sẵn.
  - Hỗ trợ cha mẹ nuôi (`adoptive`), cha mẹ ruột (`biological`).
  - Hỗ trợ thêm con mới hoặc liên kết con có sẵn (kèm tùy chọn liên kết cha/mẹ thứ hai).
- **Phát hiện Chu trình Tổ tiên (Recursive Cycle Detection):**
  - Sử dụng hàm đệ quy PostgreSQL `_system.check_parent_child_cycle` chạy trực tiếp trong transaction cơ sở dữ liệu để ngăn chặn tuyệt đối chu trình thế hệ (cháu làm cha của ông).
- **Phân Hệ Hôn Nhân & Kết Đôi (Unions & Spouses):**
  - Tách biệt rõ ràng giữa Union và Lineage (Hôn nhân không tự động tạo quan hệ cha-con).
  - Hỗ trợ thêm phối ngẫu mới hoặc kết đôi với người có sẵn.
  - Hỗ trợ nhiều lần kết hôn (Multiple Marriages) độc lập.
  - Hỗ trợ kết thúc hôn nhân (`divorced`, `widowed`, `separated`, `former`) mà không làm mất lịch sử và liên kết con cái.
- **Xóa mềm & Thay thế Quan hệ (Soft Delete & Atomic Replace):**
  - Xóa quan hệ tuyệt đối không xóa hồ sơ Person.
  - Thay thế nguyên tử quan hệ cũ bằng quan hệ mới với kiểm tra versioning.
- **Giao diện Người Dùng (UX):**
  - Node Action Menu cho nhân vật (Thêm Cha, Mẹ, Con, Vợ/Chồng).
  - Relationship Preview trước khi lưu với cảnh báo phả hệ rõ ràng.

---

## 2. Cấu trúc Thư mục
```
src/features/relationships/
├── actions/
│   └── relationship.actions.ts         # Next.js Server Actions ("use server")
├── components/
│   ├── add-relative-dialog.tsx         # Dialog thêm người thân mới / liên kết
│   ├── delete-relationship-dialog.tsx  # Dialog xác nhận xóa mềm quan hệ
│   ├── end-union-dialog.tsx            # Dialog kết thúc quan hệ hôn nhân
│   ├── existing-person-selector.tsx    # Tìm kiếm & chọn nhân vật cùng cây
│   ├── relationship-action-menu.tsx    # Node Action Menu cho nhân vật
│   └── relationship-preview.tsx        # Card xem trước quan hệ & cảnh báo
├── errors/
│   └── relationship.errors.ts          # Bảng phân loại mã lỗi Section 43
├── repositories/
│   └── relationship.repository.ts      # DAL gọi RPC & truy vấn DB
├── schemas/
│   └── relationship.schema.ts          # Zod validation schemas
├── services/
│   └── relationship.service.ts         # Service nghiệp vụ & concurrency
├── types/
│   └── relationship.types.ts           # Types Domain & DTOs
└── utils/
    └── relationship-preview.ts         # Helper tạo câu preview tiếng Việt
```

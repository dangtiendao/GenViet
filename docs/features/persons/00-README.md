# Phân Hệ Quản Lý Nhân Vật (Person Management) - GenViet

Phân hệ Quản lý nhân vật (**Person Management**) cung cấp năng lực khởi tạo, chỉnh sửa, tra cứu chi tiết, xóa mềm, khôi phục và kiểm soát trùng lặp cho các cá nhân trong cây gia phả phiên bản **v0.1**.

---

## 1. Mục tiêu và Phạm vi
- **CRUD Nhân vật:** Quản lý thông tin họ tên, giới tính, trạng thái sống, ngày sinh, ngày mất, quê quán, nghề nghiệp, tiểu sử và trạng thái xác minh.
- **Tuân thủ Partial Date (INV-002):** Hỗ trợ nhập ngày chính xác (`exact`), chỉ biết năm (`year`), hoặc chưa rõ (`unknown`). Tuyệt đối không sinh ngày giả `01/01`.
- **Ràng buộc logic ngày tháng:** Chặn tuyệt đối trường hợp ngày mất diễn ra trước ngày sinh.
- **Kiểm soát xung đột phiên bản (Optimistic Locking):** Dựa trên cột `version` để ngăn chặn ghi đè mất dữ liệu.
- **Cảnh báo hồ sơ tương tự (Similar Profile Warning):** Phát hiện ứng viên trùng lặp trong cùng cây gia phả và yêu cầu người dùng xác nhận rõ ràng trước khi tạo.
- **Tóm tắt quan hệ chỉ đọc (Read-only Summary):** Hiển thị danh sách Cha mẹ, Con cái, Phối ngẫu hiện có của nhân vật.

---

## 2. Cấu trúc Thư mục
```
src/features/persons/
├── actions/
│   └── person.actions.ts         # Next.js Server Actions ("use server")
├── components/
│   ├── delete-person-dialog.tsx   # Modal xác nhận xóa mềm
│   ├── person-create-form.tsx     # Form tạo tối giản / đầy đủ
│   ├── person-detail.tsx          # Giao diện chi tiết nhân vật
│   ├── person-edit-form.tsx       # Form chỉnh sửa đầy đủ
│   ├── person-form-fields.tsx     # Các trường form dùng chung
│   ├── person-relationship-list.tsx # Danh sách quan hệ chỉ đọc
│   ├── restore-person-dialog.tsx  # Modal khôi phục từ thùng rác
│   ├── similar-person-warning.tsx # Modal cảnh báo trùng lặp
│   └── trash-person-row.tsx       # Hàng hiển thị trong thùng rác
├── errors/
│   └── person.errors.ts          # Bảng phân loại lỗi nghiệp vụ
├── repositories/
│   └── person.repository.ts      # Data Access Layer Supabase RLS
├── schemas/
│   └── person.schema.ts          # Zod validation schemas
├── services/
│   └── person.service.ts         # Service nghiệp vụ & concurrency
├── types/
│   └── person.types.ts           # Type definitions Domain & DTOs
└── utils/
    ├── normalize-person-name.ts   # Chuẩn hóa họ tên tiếng Việt
    └── partial-date-mapper.ts    # Ánh xạ PartialDateValue <-> DB
```

# Server Actions Entry Boundary

- **Scope:** Chứa các Server Actions phục vụ Form Mutations nội bộ ứng dụng (Tạo cây, thêm/sửa/xóa người, nối quan hệ).
- **Rule:** Nhận dữ liệu form $\rightarrow$ Validate Zod $\rightarrow$ Gọi Service tương ứng $\rightarrow$ Revalidate path.
- **Architecture Reference:** `docs/architecture/actions-and-route-handlers.md`, `ADR-0003`.

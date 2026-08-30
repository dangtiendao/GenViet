# Phân hệ Quản lý Cây Gia Phả (Family Tree Management)

Tài liệu thiết kế và vận hành phân hệ Quản lý cây gia phả (Family Tree Management) phiên bản **v0.1** cho dự án **GenViet**.

---

## 1. Mục lục Tài liệu Phân hệ

- **[Luồng Dữ liệu (Data Flow)](./data-flow.md):** Kiến trúc luồng Server Action, Service, Repository, RPC và PostgreSQL Database.
- **[Ma trận Phân quyền (Authorization Matrix)](./authorization.md):** Nguyên tắc phân quyền Owner, Admin, Editor, Viewer và RLS.
- **[Mô hình Giao dịch Nguyên tử (Transaction Model)](./transaction-model.md):** Đặc tả RPC `create_family_tree` bảo đảm không phát sinh orphan tree.
- **[Quy trình Xóa mềm & Khôi phục (Deletion & Restore)](./deletion-and-restore.md):** Quy chuẩn Soft Delete, Trash access và lý do an toàn cho `DEFERRED_FOR_SAFETY` của Hard Purge.
- **[Danh mục Kiểm thử (Test Catalogue)](./test-catalogue.md):** Danh mục test suites cho pgTAP, Vitest và Playwright E2E.

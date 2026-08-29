# Architecture Documentation

Thư mục này chứa các tài liệu về kiến trúc kỹ thuật tổng thể, sơ đồ khối hệ thống, cấu trúc module frontend/backend, quy hoạch dịch vụ và các quyết định công nghệ của dự án **GenViet**.

---

## 1. Mục đích & Phạm vi

- Mô tả kiến trúc tổng quan hệ thống (System Architecture).
- Thiết kế luồng dữ liệu (Data Flow) và luồng hiển thị đồ thị cây gia phả (React Flow + ELK.js).
- Thiết kế kiến trúc bảo mật đa người dùng (Multi-tenant / Row Level Security).
- Quy chuẩn module hóa component trong Next.js App Router.

---

## 2. Cấu trúc tài liệu dự kiến

- `README.md`: Chỉ mục và hướng dẫn kiến trúc (file này).
- `system-overview.md`: Sơ đồ kiến trúc tổng thể, tương tác giữa Next.js, Supabase, Storage và CDN.
- `graph-visualization-engine.md`: Thiết kế engine dựng cây gia phả, thuật toán phân tầng ELK.js, tối ưu hóa rendering với React Flow.
- `auth-and-authorization.md`: Thiết kế phân quyền và cơ chế xác thực.

---

## 3. Nguyên tắc kiến trúc

1. **Decoupled & Vendor-Neutral:** Giữ cho tầng ứng dụng độc lập tối đa với các tính năng chuyên biệt của nền tảng hosting (Vercel) để sẵn sàng chuyển đổi khi cần.
2. **Performance First for Graph:** Thuật toán tính toán vị trí cây gia phả (Layout Computation) phải được tối ưu, xử lý bất đồng bộ hoặc caching để không làm đơ giao diện khi cây có hàng trăm thành viên.
3. **Mọi thay đổi kiến trúc lớn phải có ADR:** Trước khi áp dụng thay đổi lớn, phải tạo bản ghi trong [docs/decisions/](../decisions/README.md).

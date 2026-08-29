# ADR-0002: Quy tắc Server-First Rendering và Phân định Ranh giới Client Components

- **Mã Quyết định:** `ADR-0002`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Vấn đề (Context & Problem)
Nếu đặt cờ `'use client'` ở cấp độ toàn bộ trang (`page.tsx`), toàn bộ mã nguồn xử lý dữ liệu và thư viện sẽ bị đẩy xuống trình duyệt, gây phình to bundle JS và làm giảm hiệu năng trên mạng di động 4G.

## 2. Quyết định Kiến trúc (Decision)
1. Áp dụng nguyên tắc **Server-First by Default**: Mọi trang (`page.tsx`), bố cục (`layout.tsx`) và bộ chứa dữ liệu đều là **Server Components**.
2. **Client Components (`'use client'`) chỉ được sử dụng tại các lá cuối cùng của cây component (leaf-nodes)** khi thực sự cần:
   - Tương tác đồ thị React Flow canvas và tính toán bố cục ELK.
   - Quản lý trạng thái mở/đóng Modal Dialog, Drawer hoặc Bottom Sheet di động.
   - Bắt sự kiện form nhập liệu, bàn phím di động và validate tức thì.
3. Dữ liệu truyền qua ranh giới Server $\rightarrow$ Client bắt buộc phải là **Plain Serializable Objects**, loại bỏ toàn bộ dữ liệu nhạy cảm dư thừa.

## 3. Hệ quả & Tác động (Consequences & Trade-offs)
- **Tích cực:** Giảm thiểu 60-70% mã JS tải về máy khách; bảo mật tuyệt đối các trường dữ liệu nhạy cảm.
- **Tiêu cực:** Phải phân tách component thành nhiều file nhỏ hơn (Container/Presentation split).
- **Kế hoạch Triển khai:** Triển khai từ Phase P05, P10 và P15.

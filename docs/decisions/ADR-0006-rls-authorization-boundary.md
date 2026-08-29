# ADR-0006: Row Level Security (RLS) là Lớp Cưỡng chế Phân quyền Cuối cùng

- **Mã Quyết định:** `ADR-0006`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Kích hoạt **Row Level Security (RLS)** trên 100% các bảng dữ liệu nghiệp vụ trong schema `public`.
- **Ranh giới:** RLS là chốt chặn an ninh tối cao. Ngay cả khi tầng ứng dụng (Next.js) bị lỗi logic hoặc kẻ tấn công cố tình thay đổi `tree_id` trên máy khách (tấn công IDOR), CSDL PostgreSQL sẽ tự động từ chối truy cập và trả về kết quả rỗng.
- **Quy tắc:** Không sử dụng `SUPABASE_SERVICE_ROLE_KEY` cho các tác vụ người dùng thông thường để tránh vô hiệu hóa RLS.

## 2. Hệ quả
- **Tích cực:** Ngăn chặn triệt để rò rỉ dữ liệu chéo giữa các cây gia phả cá nhân; bảo vệ dữ liệu theo nguyên tắc Defense-in-Depth.
- **Tiêu cực:** Đòi hỏi lập trình viên phải kiểm thử kỹ lưỡng các chính sách RLS ở Phase P08 để tránh lỗi chặn nhầm người dùng hợp lệ.

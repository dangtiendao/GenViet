# ADR-0014: Nguyên tắc Không Phụ thuộc vào Dịch vụ Dữ liệu Độc quyền của Vercel

- **Mã Quyết định:** `ADR-0014`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** **Nghiêm cấm tuyệt đối** việc sử dụng các dịch vụ dữ liệu độc quyền của Vercel (bao gồm `Vercel Blob`, `Vercel KV`, `Vercel Postgres`, `Vercel Edge Config`) trong mã nguồn của GenViet.
- **Ranh giới:** Vercel chỉ đóng vai trò là môi trường host tính toán serverless ban đầu.
- **Quy tắc:** Sử dụng Supabase PostgreSQL cho dữ liệu quan hệ, Supabase Storage cho lưu trữ file nhị phân, và sử dụng GitHub Actions cho tác vụ cron định kỳ. Cấm import `@vercel/*` trong Service Layer.

## 2. Hệ quả
- **Tích cực:** Loại bỏ nguy cơ bị khóa chặt nhà cung cấp (Vendor Lock-in); kiểm soát chi phí hạ tầng; cho phép dễ dàng chuyển dịch toàn bộ hệ thống sang Cloudflare khi cần.
- **Tiêu cực:** Không sử dụng được một số tính năng tiện ích gắn liền của hệ sinh thái Vercel.

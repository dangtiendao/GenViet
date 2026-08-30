# Đánh Giá Phương Án Hạ Tầng Khi Thương Mại Hóa (Commercial Hosting Evaluation - P27-T20)

## 1. So Sánh Các Phương Án Hạ Tầng (TCO Evaluation)

| Tiêu Chí | Phương Án 1: Vercel + Supabase (Hiện Tại) | Phương Án 2: Cloudflare Workers + R2 + Supabase DB | Phương Án 3: Hybrid (Vercel Frontend + Cloudflare R2 Media) |
| :--- | :--- | :--- | :--- |
| **Next.js Compatibility** | 100% Native, Zero-config | Tốt (yêu cầu OpenNext) | 100% Native cho Frontend |
| **Chi Phí Lưu Trữ Media** | ~\$0.021/GB (Supabase Storage) | Miễn phí Egress, \$0.015/GB (R2) | Tiết kiệm tối đa chi phí Egress media |
| **Độ Phức Tạp Vận Hành** | Thấp nhất, tập trung một nền tảng | Trung bình, quản lý đa nền tảng | Trung bình thấp, tối ưu chi phí ảnh lớn |
| **Khuyến Nghị MVP/v0.1** | **Khuyến nghị duy trì cho v0.1** | Đánh giá khi quy mô đạt >100.000 users | Khuyến nghị bước đệm khi phát triển Album ảnh lớn |

## 2. Kết Luận & Quyết Định
- Giữ nguyên kiến trúc hiện tại (Vercel + Supabase) cho giai đoạn phát hành v0.1.0 và phát triển ban đầu.
- Sử dụng Storage-Provider Abstraction đã xây dựng tại P27 để sẵn sàng chuyển đổi sang Cloudflare R2 khi chi phí lưu trữ ảnh/tài liệu scan tăng cao mà không làm ảnh hưởng mã nguồn nghiệp vụ.

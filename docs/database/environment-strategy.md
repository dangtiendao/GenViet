# Chiến lược Phân tách Môi trường CSDL (Database Environment Strategy)

- **Mã tài liệu:** `DB-ENV-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `LOCKED`

---

## 1. Ma trận Phân tách 4 Môi trường (Environment Matrix)

| Tiêu chí | 1. Local Development | 2. Development Cloud | 3. Preview Staging | 4. Production |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase Project** | Local Docker Stack | `genviet-dev` | Shared Dev / Branching | `genviet-prod` (Tách riêng) |
| **Mục đích** | Phát triển tính năng, kiểm thử đơn vị, tạo migration mới | Tích hợp từ xa, chia sẻ nhóm, kiểm thử API đám mây | Kiểm tra PR / preview frontend deployments | Môi trường người dùng thực tế với dữ liệu phả hệ thật |
| **Phân loại dữ liệu** | Mock / Technical seed chỉ | Test data an toàn, không chứa PII thật | Dữ liệu test cô lập theo namespace | Dữ liệu gia phả cá nhân thật (Bảo mật tối đa) |
| **Quyền Reset DB** | ✅ Cho phép (`db reset`) | ⚠️ Có kiểm soát (Thông báo trước) | ⚠️ Không chạy destructive reset | ❌ TUYỆT ĐỐI CẤM RESET |
| **Nạp Seed Data** | ✅ `supabase/seed.sql` | ⚠️ Seed kỹ thuật tối thiểu | ⚠️ Seed kỹ thuật tối thiểu | ❌ TUYỆT ĐỐI CẤM NẠP SEED DEV |
| **Nguồn Schema** | `supabase/migrations/` | Push từ branch đã merge (`npm run supabase:db:push:dev`) | Đồng bộ từ development cloud | Release process có gate kiểm duyệt và backup |
| **Lưu trữ Credential** | CLI sinh cục bộ (`127.0.0.1`) | Dashboard Project Settings $\rightarrow$ `.env.local` | Vercel Preview Env Variables | Vercel Production Env $\rightarrow$ Secret Manager |
| **Yêu cầu Backup** | Không bắt buộc | Khuyến nghị trước schema lớn | Khuyến nghị | 🔒 BẮT BUỘC TRƯỚC MỌI MIGRATION |
| **Chi phí Phát sinh** | $0$ (Chạy máy cá nhân) | $0$ (Gói Free Tier phù hợp) | $0$ (Dùng chung Dev trong MVP) | Đánh giá theo quy mô v0.1 |

---

## 2. Chiến lược Môi trường Preview cho Giai đoạn MVP v0.1

### Đề xuất Phương án A (Khuyến nghị cho MVP):
- Frontend Preview Deployments (Vercel Preview PRs) sẽ kết nối tới **Development Cloud Project (`genviet-dev`)**.
- Không tự động kích hoạt tính năng trả phí Supabase Branching để tối ưu hóa chi phí ($0$).
- Dữ liệu tạo trong preview tests được gắn nhãn test và dọn dẹp định kỳ.

### Phương án B (Tương lai khi mở rộng):
- Kích hoạt Supabase Database Branching khi dự án có ngân sách và nhiều nhóm kỹ sư phát triển đồng thời.

# Sổ Đăng ký Rủi ro Dự án GenViet (Risk Register)

Tài liệu này theo dõi toàn bộ các rủi ro đã được nhận diện, đánh giá và lập phương án xử lý trong dự án **GenViet**.

---

## 1. Thang đánh giá Mức độ Rủi ro

- **Mức độ Ưu tiên (Priority / Severity):**
  - `P0`: Rủi ro cực kỳ nghiêm trọng (Mất dữ liệu, lộ dữ liệu toàn hệ thống, sập dịch vụ không thể phục hồi).
  - `P1`: Rủi ro cao (Chặn tiến độ phase, sai lệch kiến trúc cốt lõi, vi phạm bảo mật).
  - `P2`: Rủi ro trung bình (Ảnh hưởng hiệu năng cục bộ, chậm tiến độ một vài task, phát sinh nợ kỹ thuật).
  - `P3`: Rủi ro thấp (Ảnh hưởng nhỏ, có thể chấp nhận hoặc xử lý sau).

---

## 2. Bảng Theo dõi Rủi ro Dự án (Active Risk Register)

| Mã Risk | Mô tả rủi ro | Xác suất | Tác động | Mức độ | Phase | Trạng thái | Ngày review |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RISK-001** | Phạm vi MVP phình to không kiểm soát (Scope Creep) | Cao | Cao | **P1** | P00, P01 | `OPEN` | 2026-08-29 |
| **RISK-002** | Mô hình quan hệ gia phả phức tạp vượt dự kiến (Đa thê, nhận con nuôi, chu trình vòng) | Cao | Cao | **P1** | P02, P03 | `OPEN` | 2026-08-29 |
| **RISK-003** | Lỗi chính sách RLS dẫn đến truy cập chéo dữ liệu giữa các dòng họ | Trung bình | Cực cao | **P0** | P03, P04 | `OPEN` | 2026-08-29 |
| **RISK-004** | Cây gia phả lớn gây giật lag giao diện & tính toán layout quá tải | Cao | Trung bình | **P2** | P06, P07 | `OPEN` | 2026-08-29 |
| **RISK-005** | Phụ thuộc sâu vào nhà cung cấp (Vendor Lock-in Vercel/Supabase) gây khó di chuyển hạ tầng | Trung bình | Trung bình | **P2** | P00, P03 | `OPEN` | 2026-08-29 |
| **RISK-006** | Nhà cung cấp thay đổi hạn mức gói miễn phí (Free-tier Quota limits) | Trung bình | Trung bình | **P2** | Toàn bộ | `OPEN` | 2026-08-29 |
| **RISK-007** | Dữ liệu cá nhân/gia phả nhạy cảm bị ghi vào log hoặc gửi ra dịch vụ ngoài | Thấp | Cao | **P1** | P00, P04 | `OPEN` | 2026-08-29 |
| **RISK-008** | AI Agent vô tình sửa/xóa các file ngoài phạm vi được giao | Cao | Trung bình | **P1** | Toàn bộ | `OPEN` | 2026-08-29 |
| **RISK-009** | Thiếu tài liệu bàn giao giữa các phase làm AI sau hiểu sai ngữ cảnh | Cao | Cao | **P1** | Toàn bộ | `OPEN` | 2026-08-29 |
| **RISK-010** | Database Migration không có kế hoạch Rollback gây kẹt dữ liệu | Trung bình | Cao | **P1** | P03+ | `OPEN` | 2026-08-29 |

---

## 3. Chi tiết Phương án Ứng phó Từng Rủi ro

### RISK-001: Phạm vi MVP phình to không kiểm soát (Scope Creep)
- **Dấu hiệu kích hoạt:** Xuất hiện các yêu cầu về mạng xã hội, thanh toán, phân tích AI ADN trong giai đoạn đầu.
- **Biện pháp phòng ngừa:** Khóa chặt phạm vi trong `project-charter.md` và `prd-mvp.md` (P01); mọi tính năng ngoài phạm vi bắt buộc gán nhãn `DEFERRED` hoặc `Post-MVP`.
- **Biện pháp ứng phó:** Project Owner thẳng thắn từ chối các tính năng phụ trước khi hoàn thành luồng tạo cây cơ bản.
- **Chủ sở hữu:** Project Owner / Product Manager.

### RISK-002: Mô hình quan hệ gia phả phức tạp vượt dự kiến
- **Dấu hiệu kích hoạt:** CSDL không thể biểu diễn trường hợp một người có nhiều vợ/chồng, hoặc xuất hiện đồ thị có chu trình lặp (Cycles).
- **Biện pháp phòng ngừa:** Thiết kế kỹ lưỡng Phase P02 (Glossary & Model Design); tách biệt bảng `relationships` trung gian dạng Directed Acyclic Graph (DAG) logic.
- **Biện pháp ứng phó:** Thêm các validation constraint ở tầng database/API để ngăn tạo chu trình quan hệ phi logic.
- **Chủ sở hữu:** Database Architect.

### RISK-003: Lỗi chính sách RLS dẫn đến truy cập chéo dữ liệu giữa các dòng họ
- **Dấu hiệu kích hoạt:** Người dùng đăng nhập có thể query được `persons` hoặc `trees` thuộc `user_id` khác qua Supabase Client.
- **Biện pháp phòng ngừa:** Bắt buộc viết bộ automated test chuyên biệt cho RLS (`rls-test-suite.md`) trước khi merge code; test với 2 tài khoản riêng biệt.
- **Biện pháp ứng phó:** Khóa quyền truy cập public ngay lập tức; thu hồi session; kiểm tra log truy cập.
- **Chủ sở hữu:** Security Lead.

### RISK-004: Cây gia phả lớn gây giật lag giao diện & tính toán layout quá tải
- **Dấu hiệu kích hoạt:** Thời gian tính toán ELK.js vượt quá 1000ms khi số node > 200; FPS giảm dưới 30 khi zoom/pan React Flow.
- **Biện pháp phòng ngừa:** Chạy tính toán layout trong Web Worker ngầm; áp dụng kỹ thuật windowing/virtualization của React Flow và tối ưu hóa DOM node.
- **Biện pháp ứng phó:** Giới hạn số đời hiển thị đồng thời (mặc định chỉ bung 3 đời gần nhất, lazy load các nhánh khác khi click).
- **Chủ sở hữu:** Frontend Tech Lead.

### RISK-005: Phụ thuộc sâu vào nhà cung cấp (Vendor Lock-in)
- **Dấu hiệu kích hoạt:** Codebase sử dụng trực tiếp các thư viện chỉ chạy được trên Vercel Serverless Functions.
- **Biện pháp phòng ngừa:** Tuân thủ nguyên tắc Decoupled; chỉ sử dụng standard Next.js APIs và chuẩn Supabase client; không dùng Vercel-specific headers/APIs.
- **Biện pháp ứng phó:** Định kỳ kiểm tra khả năng build dạng standalone Docker container.
- **Chủ sở hữu:** System Architect.

### RISK-006: Nhà cung cấp thay đổi hạn mức gói miễn phí (Free-tier Quota limits)
- **Dấu hiệu kích hoạt:** Nhận thông báo từ Supabase/Vercel về giới hạn dung lượng database (500MB) hoặc số lượng monthly active users.
- **Biện pháp phòng ngừa:** Tối ưu hóa dung lượng lưu trữ, nén ảnh chân dung trước khi upload lên Supabase Storage; thiết kế schema gọn nhẹ.
- **Biện pháp ứng phó:** Thiết lập phương án self-host Supabase trên VPS riêng (sử dụng Docker Compose) khi chạm ngưỡng.
- **Chủ sở hữu:** DevOps Lead.

### RISK-007: Dữ liệu cá nhân/gia phả nhạy cảm bị ghi vào log
- **Dấu hiệu kích hoạt:** Xuất hiện email, họ tên hoặc ngày sinh thật trong terminal log hoặc Vercel Runtime Logs.
- **Biện pháp phòng ngừa:** Ban hành `project-security-rules.md`; cấu hình linter cảnh báo `console.log`; sử dụng logger có filter masking.
- **Biện pháp ứng phó:** Xóa log ngay lập tức; rà soát lại các hàm xử lý request.
- **Chủ sở hữu:** Security Lead.

### RISK-008: AI Agent vô tình sửa/xóa các file ngoài phạm vi
- **Dấu hiệu kích hoạt:** `git diff` chứa các file nằm ngoài danh sách được duyệt trong `02-plan.md`.
- **Biện pháp phòng ngừa:** Ban hành `ai-working-agreement.md`; yêu cầu AI kiểm tra `git status` và so khớp scope trước khi commit.
- **Biện pháp ứng phó:** Loại bỏ (discard) các thay đổi ngoài phạm vi; yêu cầu AI tạo lại commit đúng phạm vi.
- **Chủ sở hữu:** Technical Lead.

### RISK-009: Thiếu tài liệu bàn giao giữa các phase làm AI sau hiểu sai ngữ cảnh
- **Dấu hiệu kích hoạt:** AI ở Phase sau tự ý suy diễn lại mô hình dữ liệu hoặc chọn sai công nghệ.
- **Biện pháp phòng ngừa:** Bắt buộc tuân thủ Cổng G7 (file `09-handover.md`); kiểm tra DoR (Cổng G0) ở phase tiếp theo.
- **Biện pháp ứng phó:** Dừng phase tiếp theo ở trạng thái `BLOCKED` cho đến khi tài liệu bàn giao được bổ sung đầy đủ.
- **Chủ sở hữu:** Documentation Architect.

### RISK-010: Database Migration không có kế hoạch Rollback
- **Dấu hiệu kích hoạt:** Chạy migration thất bại trên production và không thể hoàn tác lại schema cũ.
- **Biện pháp phòng ngừa:** Tiêu chí DoD bắt buộc mọi migration SQL phải kèm file rollback SQL; test thử cả 2 chiều (Up & Down) trên local.
- **Biện pháp ứng phó:** Khôi phục database từ bản backup tự động gần nhất.
- **Chủ sở hữu:** Database Architect.

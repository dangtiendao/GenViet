# Quản lý Hồ sơ các Phase Dự án GenViet

Thư mục `docs/phases/` là nơi lưu trữ toàn bộ hồ sơ thi công, kế hoạch, biên bản kiểm thử, đánh giá chất lượng và tài liệu bàn giao cho từng giai đoạn (Phase) phát triển của **GenViet**.

---

## 1. Cấu trúc chuẩn của một Phase

Mỗi phase phải được đặt trong một thư mục con riêng biệt với tên viết hoa: `PXX` (Ví dụ: `P00`, `P01`, `P02`, ...).

Trong mỗi thư mục `PXX/`, bắt buộc phải có đủ 10 tài liệu chuẩn và thư mục `issues/`:

```text
docs/phases/PXX/
├── 00-overview.md             # Tổng quan mục tiêu, phạm vi, kết quả mong đợi của phase
├── 01-input-readiness.md      # Đánh giá đầu vào và kiểm tra Definition of Ready (G0)
├── 02-plan.md                 # Kế hoạch thi công chi tiết và phân chia Work Packages
├── 03-task-breakdown.md       # Chi tiết danh sách task và subtasks (PXX-TYY-STZZ)
├── 04-decisions.md            # Các quyết định kỹ thuật phát sinh trong phase
├── 05-test-plan.md            # Kế hoạch kiểm thử, tiêu chí nghiệm thu và test cases
├── 06-review.md               # Biên bản đánh giá chất lượng (Review/Self-Review) (G5)
├── 07-re-review.md            # Biên bản re-review sau khi fix lỗi (G5)
├── 08-summary.md              # Báo cáo tổng kết nghiệm thu phase (G6)
├── 09-handover.md             # Tài liệu bàn giao làm đầu vào cho phase tiếp theo (G7)
└── issues/                    # Quản lý các vấn đề phát sinh trong phase
    ├── blocker.md             # Danh sách các vấn đề chặn tiến độ
    ├── deferred.md            # Danh sách các hạng mục được phê duyệt hoãn lại
    └── technical-debt.md      # Danh sách nợ kỹ thuật phát sinh cần xử lý sau
```

---

## 2. Quy tắc quản lý hồ sơ Phase

1. **Không tạo file rỗng:** Nếu phase không có issue blocker, file `issues/blocker.md` phải ghi rõ `None at phase close` kèm ngày đối soát.
2. **Tiền tố số để giữ thứ tự:** Các file tài liệu từ `00-` đến `09-` giúp người đọc và AI theo dõi đúng trình tự logic thời gian từ chuẩn bị đến bàn giao.
3. **Cập nhật trạng thái trung thực:** File `08-summary.md` chỉ được chuyển sang trạng thái `ACCEPTED` khi toàn bộ Acceptance Criteria đã pass và biên bản review không còn lỗi `BLOCKER`/`CRITICAL`.
4. **Bàn giao chặt chẽ (Handover):** File `09-handover.md` là cầu nối bắt buộc. Phase tiếp theo không được bắt đầu nếu thiếu tài liệu bàn giao từ phase trước.

---

## 3. Danh mục các Phase trong dự án

| Phase | Tên giai đoạn | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **[P00](./P00/00-overview.md)** | Quản trị dự án (Project Governance) | `ACCEPTED` (Đang nghiệm thu) | Khung tài liệu, Git workflow, tiêu chuẩn DoR/DoD. |
| **P01** | Yêu cầu sản phẩm (PRD & Scope) | `NOT_STARTED` | Định nghĩa yêu cầu chi tiết MVP, Personas. |
| **P02** | Thuật ngữ & Mô hình dữ liệu gia phả | `NOT_STARTED` | Thiết kế schema gia phả, glossary. |
| **P03** | Thiết kế kiến trúc & Setup kỹ thuật | `NOT_STARTED` | Khởi tạo Next.js, Tailwind, Supabase schema. |
| **P04** | Xác thực & Quản lý người dùng | `NOT_STARTED` | Supabase Auth, phân quyền RLS ban đầu. |
| **P05** | Quản lý cây & Thành viên gia phả | `NOT_STARTED` | CRUD Person, Tree, Relationship. |
| **P06** | Visualization Engine (Cây gia phả) | `NOT_STARTED` | React Flow + ELK.js layout rendering. |
| **P07** | Kiểm thử tích hợp & Tối ưu hóa | `NOT_STARTED` | E2E Tests, Performance optimization. |
| **P08** | Chuẩn bị phát hành MVP | `NOT_STARTED` | Deployment guide, UAT, Production release. |

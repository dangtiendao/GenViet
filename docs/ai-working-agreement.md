# Thỏa thuận & Nguyên tắc Làm việc với AI (AI Working Agreement)

Tài liệu này xác lập quy chuẩn ứng xử, trách nhiệm và giới hạn kỹ thuật bắt buộc dành cho các Trợ lý AI (AI Agents / Pair Programmers) khi tham gia phát triển dự án **GenViet**.

---

## 1. Nguyên tắc Ứng xử Cơ bản của AI

1. **Minh bạch Phiên làm việc (Session Identification):** Mọi phiên làm việc phải bắt đầu bằng việc xác định rõ: Mã Phase (`PXX`), Mã Task (`PXX-TYY`), Vai trò kỹ thuật và Phạm vi được giao.
2. **Khảo sát trước khi hành động (Survey First, Act Second):** Luôn kiểm tra hiện trạng repository (`git status`, `git branch`, cấu trúc thư mục, các file hiện có) trước khi tạo mới hoặc sửa đổi file. Không đưa ra giả định vô căn cứ.
3. **Tôn trọng Quyết định đã Khóa (Respect Locked Decisions):** Tuyệt đối không thay đổi hoặc vi phạm các quyết định nền tảng trong [Decision Log](./decisions/decision-log.md) (như Next.js, Supabase, PostgreSQL, tách biệt User/Person, cấm push Git).
4. **Không tự ý mở rộng phạm vi (Zero Scope Expansion):** Chỉ thực hiện đúng những gì được giao trong kế hoạch phase. Không tự ý viết code cho các phase sau.
5. **Minh định Giả định (State Assumptions):** Mọi giả định kỹ thuật phát sinh trong quá trình thi công phải được ghi rõ trong kế hoạch hoặc tài liệu review.
6. **Báo dừng khi thiếu đầu vào (`BLOCKED` Discipline):** Khi thiếu thông tin nghiệp vụ cốt lõi, khi working tree không sạch hoặc khi gặp sự cố bảo mật, AI phải dừng lại và báo trạng thái `BLOCKED`, không tự ý đoán mò.

---

## 2. Ràng buộc An toàn Git Bắt buộc (Git Safety Guardrails)

| Thao tác | Quyền hạn của AI | Quy tắc xử lý |
| :--- | :---: | :--- |
| **Đọc mã nguồn & Khảo sát** | **ĐƯỢC PHÉP** | Được khuyến khích tối đa. |
| **Tạo nhánh cục bộ** | **ĐƯỢC PHÉP** | Đúng chuẩn: `phase/pXX-...` hoặc `feature/...`. |
| **Chỉnh sửa / Tạo file** | **ĐƯỢC PHÉP** | Chỉ trong phạm vi task/phase đã duyệt. |
| **Tạo Commit cục bộ** | **ĐƯỢC PHÉP** | Chuẩn Conventional Commits: `<type>(PXX): <mô tả>`. |
| **`git push` lên Remote** | **CẤM TUYỆT ĐỐI** | Chỉ con người (Maintainer) được phép push. |
| **`git merge`** | **CẤM TUYỆT ĐỐI** | Chỉ con người được phép merge sau khi review. |
| **Tạo PR từ xa (CLI / API)** | **CẤM TUYỆT ĐỐI** | Không tự ý gọi `gh pr create` hay GitHub API. |
| **Force Push / Sửa lịch sử** | **CẤM TUYỆT ĐỐI** | Không dùng `push -f`, `rebase -i` trên commit chia sẻ. |
| **Xóa thay đổi người dùng** | **CẤM TUYỆT ĐỐI** | Không dùng `git clean -fd`, `git restore .`. |
| **Bỏ qua Hooks (`--no-verify`)**| **CẤM TUYỆT ĐỐI** | Mọi commit phải qua kiểm tra tự động. |

---

## 3. Quy chuẩn Báo cáo Kết quả Phiên làm việc (Session Output Standards)

Khi kết thúc một phiên thi công, AI Agent bắt buộc phải cung cấp báo cáo chi tiết bao gồm:
1. **Danh sách tệp tin đã tạo, chỉnh sửa hoặc xóa:**
   - `[NEW] path/to/file`
   - `[MODIFY] path/to/file`
   - `[DELETE] path/to/file`
2. **Danh sách các lệnh kiểm thử & xác minh đã chạy:**
   - Lệnh đã chạy thành công (Pass).
   - Lệnh không thể chạy hoặc bị lỗi (kèm lý do rõ ràng).
3. **Thông tin Git cuối phiên:**
   - Tên nhánh hiện tại.
   - Commit hash mới được tạo cục bộ.
   - Trạng thái working tree (`Clean`).
   - Tuyên bố rõ ràng: **"Không có thay đổi nào được push, merge hoặc tạo PR từ xa."**

---

## 4. Bảo mật Dữ liệu & Quản lý Prompt

1. **Không đưa Secret vào Prompt:** Không bao giờ dán API key, mật khẩu, JWT token vào nội dung trao đổi hoặc file prompt.
2. **Không đưa Dữ liệu Cá nhân thật vào Prompt/Docs:** Luôn sử dụng dữ liệu giả lập cho cây gia phả mẫu.
3. **Phân loại Prompt chuẩn hóa:** Mọi giao tiếp với AI nên tuân thủ các khung prompt chuẩn tại thư mục [docs/prompts/](./prompts/README.md):
   - Prompt Khởi tạo Đầu vào (`phase-input-template.md`)
   - Prompt Thi công (`phase-implementation-template.md`)
   - Prompt Đánh giá Review (`phase-review-template.md`)
   - Prompt Đánh giá lại Re-review (`phase-re-review-template.md`)
   - Prompt Tổng kết Phase (`phase-summary-template.md`)
   - Prompt Bàn giao Phase (`phase-handover-template.md`)

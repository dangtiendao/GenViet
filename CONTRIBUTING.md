# Hướng dẫn đóng góp dự án GenViet (Contributing Guide)

Chào mừng bạn đã tham gia đóng góp cho dự án **GenViet**! Để đảm bảo chất lượng mã nguồn, tính toàn vẹn dữ liệu, tính bảo mật và sự hợp tác trơn tru giữa con người và AI Agents, vui lòng tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Nguyên tắc cốt lõi

1. **Phát triển theo Phase:** Mọi đóng góp phải gắn liền với một Phase cụ thể (`P00`, `P01`, `P02`, ...) và một Task cụ thể (`PXX-TYY`).
2. **Bảo mật tuyệt đối:** Không bao giờ commit file `.env`, mật khẩu, token, private key hay dữ liệu cá nhân thật.
3. **Quy tắc an toàn cho AI:** Nếu bạn là AI Agent, bạn chỉ được phép tạo nhánh và tạo commit cục bộ. **Tuyệt đối KHÔNG push lên remote, KHÔNG merge, KHÔNG tạo Pull Request qua CLI/API**.
4. **Không phá vỡ hợp đồng kỹ thuật:** Đọc kỹ [Hiến chương dự án](./docs/project-charter.md) và các quyết định đã khóa trước khi bắt đầu.

---

## 2. Chiến lược phân nhánh (Branching Strategy)

Mọi nhánh đều phải được đặt tên theo quy chuẩn kebab-case, có tiền tố phân loại rõ ràng:

| Loại nhánh | Cú pháp đặt tên | Mục đích sử dụng | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Nhánh chính** | `main` | Nhánh ổn định, chứa mã nguồn đã qua nghiệm thu. | `main` |
| **Nhánh Phase** | `phase/pXX-short-name` | Nhánh tích hợp toàn bộ các task của một phase. | `phase/p00-project-governance` |
| **Nhánh Feature** | `feature/pXX-tYY-short-name`| Nhánh thực hiện một task cụ thể khi cần tách nhỏ. | `feature/p01-t02-user-persona` |
| **Nhánh Sửa lỗi** | `fix/pXX-bug-NNN-short-name` | Nhánh sửa lỗi phát sinh trong quá trình review. | `fix/p00-bug-001-broken-link` |
| **Nhánh Tài liệu** | `docs/pXX-short-name` | Nhánh cập nhật tài liệu độc lập. | `docs/p00-update-guidelines` |

> **Lưu ý:** Không tự ý tạo các nhánh không có trong danh sách trên. Không tạo nhánh chứa khoảng trắng hoặc ký tự đặc biệt.

---

## 3. Quy chuẩn Commit (Conventional Commits with Phase Scope)

Mọi commit message trong dự án phải tuân theo chuẩn Conventional Commits có chỉ định scope là mã Phase:

```text
<type>(PXX): <mô tả ngắn bằng tiếng Việt hoặc tiếng Anh>

[Mô tả chi tiết tùy chọn nếu cần]

[Liên kết task / issue nếu có: PXX-TYY]
```

### 3.1. Các Commit Types hợp lệ:

- `docs`: Cập nhật tài liệu, hướng dẫn, template.
- `feat`: Thêm tính năng mới hoặc tạo module mới.
- `fix`: Sửa lỗi (bug fix).
- `chore`: Thay đổi cấu hình công cụ, quy trình build, template phụ trợ.
- `refactor`: Tái cấu trúc code mà không thay đổi chức năng.
- `test`: Thêm mới hoặc cập nhật unit/integration test.
- `ci`: Thay đổi cấu hình CI/CD.
- `build`: Thay đổi hệ thống build hoặc package dependencies.
- `perf`: Cải thiện hiệu năng.
- `revert`: Hoàn tác một commit trước đó.

### 3.2. Ví dụ commit hợp lệ:

- `docs(P00): establish project governance documentation`
- `chore(P00): add GitHub collaboration templates`
- `feat(P01): define MVP user personas and PRD`
- `fix(P00): resolve broken relative links in documentation`

### 3.3. Quy tắc commit an toàn:

- Mỗi commit chỉ nên tập trung giải quyết một mục tiêu rõ ràng.
- Sử dụng câu mệnh lệnh ngắn gọn, rõ nghĩa.
- **Tuyệt đối không dùng cờ `--no-verify`** để bỏ qua Git hooks.
- **Không tự ý `git commit --amend`** đối với các commit cũ của người dùng.
- Luôn kiểm tra `git status` và `git diff` trước khi commit để đảm bảo không có file lạ hoặc secret bị thêm vào.

---

## 4. Quy trình đóng góp từng bước

1. **Khảo sát & Chuẩn bị:**
   - Kiểm tra `git status` đảm bảo working tree sạch.
   - Đọc kỹ [Definition of Ready (DoR)](./docs/definition-of-ready.md) của task/phase.
2. **Tạo nhánh:**
   - Tạo nhánh thi công từ `main` theo đúng định dạng `phase/pXX-...` hoặc `feature/...`.
3. **Thực hiện công việc:**
   - Tạo mới/chỉnh sửa file theo đúng phạm vi được giao.
   - Thường xuyên kiểm tra để không sửa các file ngoài phạm vi.
4. **Kiểm tra chất lượng (Verification):**
   - Chạy format, lint, type check, test liên quan.
   - Đối chiếu với [Definition of Done (DoD)](./docs/definition-of-done.md).
5. **Commit cục bộ:**
   - Tạo commit với message chuẩn Conventional Commits.
6. **Bàn giao / Tạo Pull Request (Dành cho con người):**
   - Người duy trì dự án (Project Maintainer) sẽ đẩy nhánh lên GitHub và tạo Pull Request sử dụng template tại `.github/PULL_REQUEST_TEMPLATE.md`.
   - Tiến hành review độc lập, sửa lỗi (nếu có) và merge vào `main`.

---

## 5. Tài liệu tham khảo quan trọng

- [Quy trình Git chi tiết](./docs/git-workflow.md)
- [Vòng đời Phase](./docs/phase-lifecycle.md)
- [Quy chuẩn Review](./docs/review-guidelines.md)
- [Quy tắc bảo mật dự án](./docs/security/project-security-rules.md)
- [Thỏa thuận làm việc với AI](./docs/ai-working-agreement.md)

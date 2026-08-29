# Project Charter: GenViet

- **Mã tài liệu:** `CHARTER-GENVIET`
- **Phiên bản:** `1.0.0`
- **Ngày ban hành:** 2026-08-29
- **Trạng thái:** `ACCEPTED`
- **Chủ sở hữu:** Project Owner / Lead Maintainer

---

## 1. Tên dự án & Tầm nhìn

- **Tên chính thức:** **GenViet**
- **Tên repository kỹ thuật:** `genviet` (hoặc giữ nguyên tên repository hiện tại).
- **Tầm nhìn:** Xây dựng một ứng dụng web hiện đại, trực quan, tin cậy và tôn trọng quyền riêng tư cao nhất dành cho người Việt Nam để lưu trữ, hiển thị, quản lý và kết nối dữ liệu cây gia phả dòng họ qua các thế hệ.

---

## 2. Mục tiêu hiện tại (MVP Focus)

1. Cung cấp trải nghiệm vẽ và trực quan hóa cây gia phả tương tác mượt mà, phân cấp thế hệ rõ ràng.
2. Cho phép người dùng tạo, chỉnh sửa thông tin thành viên (nhân vật gia phả) và thiết lập các mối quan hệ gia tộc chuẩn mực văn hóa Việt Nam.
3. Bảo vệ dữ liệu gia tộc nghiêm ngặt, chỉ chủ sở hữu hoặc người được cấp quyền mới có thể xem/chỉnh sửa cây gia phả.
4. Tối ưu chi phí vận hành ở giai đoạn ban đầu (tận dụng tối đa Free-tier và dịch vụ serverless/managed).
5. Xây dựng nền tảng kiến trúc module hóa, dễ dàng bàn giao và phát triển độc lập theo từng phase bằng AI hoặc đội ngũ kỹ sư.

---

## 3. Người sử dụng ban đầu (Target Users)

- **Trưởng tộc / Người lập gia phả (Genealogy Maintainer):** Người trực tiếp thu thập thông tin dòng họ, số hóa phả ký, nhập dữ liệu và cấu trúc các nhánh thế hệ.
- **Thành viên dòng họ (Family Members):** Người được chia sẻ quyền xem hoặc đóng góp thông tin chi tiết về nhánh/gia đình nhỏ của mình.
- **Quản trị viên cá nhân (Self-hosted / Single Owner):** Người tự lưu trữ và quản lý cây phả hệ riêng tư của gia đình.

---

## 4. Phạm vi tổng quát (Scope Overview)

### Trong phạm vi MVP:
- Quản lý xác thực người dùng (Đăng ký, đăng nhập, phân quyền cơ bản).
- Quản lý nhiều cây gia phả trên cùng một tài khoản hoặc độc lập.
- Thao tác CRUD nhân vật gia phả (Họ tên, ngày sinh, ngày mất, giới tính, tiểu sử, vị trí thế hệ, ảnh chân dung).
- Thiết lập các loại quan hệ gia phả: Cha - Con, Mẹ - Con, Vợ - Chồng.
- Trực quan hóa cây gia phả tương tác dạng đồ thị (hỗ trợ zoom, pan, sắp xếp tự động phân tầng).
- Xuất/nhập dữ liệu cơ bản (JSON / định dạng chuẩn gia phả khi hoàn thiện).

### Ngoài phạm vi MVP (Tạm hoãn sang các giai đoạn sau):
- Mạng xã hội dòng họ, chat thời gian thực, bảng tin nội bộ dòng họ.
- Tính năng thanh toán, đóng góp quỹ dòng họ.
- Phân tích ADN hoặc nhận diện khuôn mặt tự động qua AI.
- Ứng dụng di động native (iOS / Android) - MVP tập trung vào Web App Responsive.

---

## 5. Nguyên tắc quyền riêng tư & Dữ liệu (Privacy-First)

1. **Dữ liệu gia tộc là dữ liệu nhạy cảm:** Mọi thông tin cá nhân (ngày sinh, nơi an táng, số điện thoại, tiểu sử) phải được bảo vệ bằng Row Level Security (RLS) ở tầng database.
2. **Không chia sẻ chéo dữ liệu:** Tuyệt đối không cho phép người dùng thuộc dòng họ A truy cập hoặc vô tình đọc được dữ liệu của dòng họ B.
3. **Quyền sở hữu thuộc về người dùng:** Người dùng có toàn quyền xuất (export) hoặc xóa (delete) toàn bộ cây gia phả của mình mà không bị giữ dữ liệu.
4. **Không thu thập dữ liệu trái phép:** Không gắn mã theo dõi của bên thứ ba xâm phạm đời tư, không dùng dữ liệu gia phả để huấn luyện model công cộng.

---

## 6. Định hướng kỹ thuật cốt lõi

- **Frontend Framework:** Next.js (App Router), React, TypeScript.
- **Styling & UI Components:** Tailwind CSS, shadcn/ui.
- **Visualization Engine:** React Flow kết hợp với ELK.js (Eclipse Layout Kernel) để tính toán layout phân tầng tự động cho đồ thị gia phả.
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Supabase Storage).
- **Hạ tầng triển khai ban đầu:** Vercel (dành cho môi trường cá nhân / MVP) kết hợp Cloudflare DNS.
- **Định hướng tương lai:** Sẵn sàng khả năng chuyển đổi hosting sang Cloudflare Pages/Workers hoặc VPS độc lập khi quy mô tăng.

---

## 7. Nguyên tắc chi phí thấp (Low-Cost Principle)

- Tối ưu hóa việc sử dụng các gói miễn phí (Free Tier) của Supabase, Vercel và Cloudflare.
- Thiết kế kiến trúc phi trạng thái (stateless), tận dụng triệt để Edge Caching và Client-side rendering cho các tác vụ đồ thị nặng.
- Không sử dụng các dịch vụ trả phí hoặc tính năng độc quyền đắt đỏ của nhà cung cấp điện toán đám mây trừ khi có phê duyệt rõ ràng từ Project Owner.

---

## 8. Nguyên tắc phát triển theo Phase

- Mọi công việc phải được chia thành các **Phase** có mã định danh chuẩn (`P00`, `P01`, `P02`, ...).
- Mỗi phase đều phải tuân thủ nghiêm ngặt vòng đời 8 cổng kiểm soát (từ `G0: Input Readiness` đến `G7: Handover`).
- Không được bắt đầu thi công code khi kế hoạch chưa được duyệt (`G1`), không được bàn giao khi chưa vượt qua kiểm thử và review (`G6/G7`).

---

## 9. Vai trò của tài liệu

- Tài liệu là thành phần sản phẩm hạng nhất (First-class Citizen), không phải là công việc phụ thêm.
- Tài liệu định nghĩa "Hợp đồng kỹ thuật" (Technical Contract) và là ngữ cảnh (Context) duy nhất để các kỹ sư con người và AI Agents có thể thi công chính xác, độc lập và an toàn.

---

## 10. Các quyết định đã khóa (Locked Decisions)

Các quyết định sau đây đã được chốt và không được tự ý thay đổi:

1. **Tên dự án:** GenViet.
2. **Nguồn dữ liệu nghiệp vụ chính:** PostgreSQL (thông qua Supabase trong giai đoạn hiện tại).
3. **Tách biệt thực thể:** **Tài khoản người dùng (User Account)** và **Nhân vật gia phả (Person/Family Member)** là hai thực thể hoàn toàn khác nhau. Một tài khoản có thể quản lý nhiều nhân vật, và một nhân vật có thể không liên kết với tài khoản người dùng nào (người đã mất, trẻ nhỏ...).
4. **Quy trình Phase bắt buộc:** Mọi phase phải có Overview, Plan, Breakdown, Test Plan, Review, Summary và Handover.
5. **Độc lập nền tảng:** Không phụ thuộc sâu vào các API/tính năng độc quyền của Vercel nhằm đảm bảo tính linh hoạt khi di chuyển hạ tầng.
6. **Bảo mật Secret:** Không đưa bất kỳ secret, API token, private key nào vào Git history.
7. **Quy tắc an toàn Git của AI:** AI được phép tạo nhánh và commit cục bộ; **AI tuyệt đối KHÔNG được push lên remote, KHÔNG được merge nhánh, KHÔNG được tạo Pull Request từ xa, KHÔNG được force push/sửa lịch sử Git**.

---

## 11. Các nội dung chưa được chốt (Open / Deferred Items)

- **Lựa chọn Giấy phép mã nguồn mở / Bản quyền (License):** Tạm hoãn đến khi xác định rõ mô hình phân phối thương mại hay mã nguồn mở cộng đồng.
- **Mô hình định giá / Monetization:** Sẽ xem xét sau giai đoạn MVP.
- **Dịch vụ Email Transactional:** Sẽ lựa chọn nhà cung cấp (Resend / SendGrid / Supabase Default) ở phase xác thực.

---

## 12. Điều kiện thay đổi Charter & Quyền quyết định

- **Chủ sở hữu quyết định tối cao:** Project Owner / Lead Maintainer là người duy nhất có quyền phê duyệt thay đổi trong Project Charter.
- **Điều kiện sửa đổi:** Bất kỳ thay đổi nào đối với các Locked Decisions hoặc Tầm nhìn cốt lõi phải được thảo luận, ghi nhận thành một Architecture Decision Record (ADR) có trạng thái `ACCEPTED` trước khi cập nhật vào file này.

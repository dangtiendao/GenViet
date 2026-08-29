# Bộ Quy tắc Nghiệp vụ Mối quan hệ Phả hệ (Relationship Rules)

- **Mã tài liệu:** `DOM-RELRULES-01`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Danh sách Quy tắc Quan hệ Phụ Mẫu - Tử tức (Parent-Child Rules)

### `RR-001`: Quy tắc Hướng và Tính Bất đối xứng (Parent-Child Directionality)
- **Mức độ:** `MUST` (Invariant `INV-004`)
- **Định nghĩa:** Mọi liên kết Cha/Mẹ - Con đều có hướng từ Cha/Mẹ tới Con (`Parent -> Child`).
- **Allowed:** `A là Cha của B` (A là thế hệ trên, B là thế hệ dưới).
- **Disallowed:** Hệ thống tuyệt đối từ chối nếu đồng thời tồn tại `B là Cha của A` (Tạo chu trình trực tiếp).
- **Validation:** `BLOCKING_ERROR: ERR-002`.

### `RR-002`: Chống Tự làm Cha/Mẹ của Chính mình (Anti-Self-Parent)
- **Mức độ:** `MUST` (Invariant `INV-002`)
- **Định nghĩa:** Một Person không bao giờ được phép là cha hoặc mẹ của chính bản thân mình (`Person A -> Person A`).
- **Validation:** `BLOCKING_ERROR: ERR-001`.

### `RR-003`: Giới hạn Số lượng Cha/Mẹ Ruột Đã Xác nhận (Single Biological Father/Mother Rule)
- **Mức độ:** `MUST`
- **Định nghĩa:** Một Person chỉ được có tối đa **1 Cha ruột** (`parent_role = FATHER`) và **1 Mẹ ruột** (`parent_role = MOTHER`) ở trạng thái đã xác minh (`status = VERIFIED`).
- **Trường hợp cạnh tranh:** Nếu người dùng cố tình thêm Cha ruột thứ 2 đã xác nhận $\rightarrow$ Hệ thống hiển thị cảnh báo `WARN-001` yêu cầu xác nhận thay thế cha cũ hoặc chuyển quan hệ mới về trạng thái chưa xác minh (`status = UNVERIFIED`).

### `RR-004`: Đồng tồn tại giữa Cha/Mẹ Ruột và Cha/Mẹ Nuôi (Biological & Adoptive Coexistence)
- **Mức độ:** `MUST`
- **Định nghĩa:** Một Person có thể vừa có Cha/Mẹ ruột, vừa có Cha/Mẹ nuôi.
- **Allowed:** Person A có Cha ruột là Person B và Cha nuôi là Person C. Hệ thống hỗ trợ lưu cả 2 và phân biệt bằng nhãn `Nuôi (Adoptive)` trên giao diện.

---

## 2. Danh sách Quy tắc Quan hệ Hôn phối (Marriage & Multiple Spouses Rules)

### `RR-005`: Chống Tự Kết hôn với Chính mình (Anti-Self-Spouse)
- **Mức độ:** `MUST` (Invariant `INV-003`)
- **Định nghĩa:** Một Person không thể thiết lập quan hệ hôn nhân với chính bản thân mình.
- **Validation:** `BLOCKING_ERROR: ERR-003`.

### `RR-006`: Chống Tạo Quan hệ Hôn nhân Trùng lặp (Anti-Duplicate Marriage)
- **Mức độ:** `MUST`
- **Định nghĩa:** Không cho phép tạo 2 bản ghi quan hệ hôn nhân cùng tồn tại giữa 2 Person A và B nếu bản ghi cũ đang ở trạng thái hiệu lực (`status = ACTIVE`).
- **Validation:** `BLOCKING_ERROR: ERR-006`.

### `RR-007`: Hỗ trợ Nhiều lần Kết hôn theo Thời gian (Multiple Spouses Support) - `P02-T12`
- **Mức độ:** `MUST`
- **Định nghĩa:** Một người có thể kết hôn nhiều lần trong đời (ví dụ: góa bụa rồi tục huyền, hoặc ly hôn rồi tái hôn).
- **Allowed:** Person A kết hôn với Person B (từ 1970 đến 1985, trạng thái `DIVORCED`) và kết hôn với Person C (từ 1988 đến nay, trạng thái `ACTIVE`).
- **Cảnh báo Chồng lấn Thời gian (Overlapping Marriages):** Nếu người dùng nhập 2 cuộc hôn nhân cùng có trạng thái `ACTIVE` hoặc khoảng thời gian chồng lấn mà không có ngày kết thúc $\rightarrow$ Hệ thống lưu ở dạng cảnh báo `WARN-003: Hôn nhân chồng lấn thời gian`, không chặn lưu để tôn trọng tính phức tạp của dữ liệu lịch sử.

### `RR-008`: Tính Độc lập giữa Hôn nhân và Con cái (Marriage & Child Independence)
- **Mức độ:** `MUST`
- **Định nghĩa:** Khi quan hệ hôn nhân giữa Cha và Mẹ chấm dứt (Ly hôn / Người phối ngẫu qua đời / Xóa bản ghi hôn nhân), **tất cả các mối quan hệ Cha-Con và Mẹ-Con đối với con cái vẫn được giữ nguyên vẹn 100%**.
- **Disallowed:** Nghiêm cấm hành vi tự động xóa con cái khi xóa mối quan hệ hôn nhân giữa cha mẹ.

# Tổng Quan Phase P28: Chế Độ Hiển Thị Dòng Họ Mặc Định (Default Paternal-Line Tree View)

## 1. Thông Tin Phase
- **Mã phase:** P28
- **Tên phase:** Chế độ hiển thị dòng họ mặc định (Default Paternal-Line Tree View)
- **Dự án:** GenViet
- **Phạm vi:** Dừng mở rộng hậu duệ tại node con nữ trong Tree View mặc định
- **Baseline:** Toàn bộ P00 đến P27 đã hoàn thành và nghiệm thu
- **Phiên bản mục tiêu:** Sau P27 (v0.2.0-readiness)
- **Tính chất:** Tối ưu hóa trải nghiệm xem sơ đồ cây phả hệ theo tập quán truyền thống Việt Nam, đồng thời bảo toàn 100% dữ liệu gốc trong toàn hệ thống.

## 2. Mục Tiêu Cốt Lõi
1. Định nghĩa chuẩn xác hai chế độ duyệt hậu duệ: `PATERNAL_LINE` (Dòng họ / Mặc định) và `ALL_DESCENDANTS` (Toàn bộ con cháu).
2. Thiết lập `PATERNAL_LINE` làm chế độ mặc định từ phía server.
3. Node con gái (FEMALE) vẫn hiển thị đầy đủ trên sơ đồ cây (tên, avatar, ngày sinh/mất, trạng thái xác thực).
4. Không tiếp tục duyệt hay tải hậu duệ bên dưới node con gái trong chế độ mặc định.
5. Ngoại lệ nhân vật trung tâm (**Center-Female Exception**): Nếu Center Person là nữ, sơ đồ vẫn hiển thị con cái và hậu duệ của chính người đó bình thường.
6. Chỉ dừng nhánh khi giới tính được chuẩn hóa chính xác là `FEMALE`; các giới tính `MALE`, `UNKNOWN`, `OTHER` tiếp tục duyệt theo độ sâu quy định.
7. Phân định rạch ròi giữa **View Graph** (phép chiếu cho Tree View / In ấn) và **Domain Graph** (toàn bộ dữ liệu phả hệ cho Search, Kinship, Duplicate Detection, Merge, Backup, Restore, GEDCOM, Excel Import).
8. Trả metadata chi tiết (`hasHiddenDescendants`, `truncationReason: 'PATERNAL_LINE'`) để giao diện hiển thị chỉ báo thân thiện và đáp ứng chuẩn tiếp cận (Accessibility).
9. Mở rộng Cache Key theo traversal mode và quản lý invalidation chính xác khi giới tính hoặc quan hệ thay đổi.
10. Giữ Web Worker ELK thuần thuật toán layout, không chứa logic nghiệp vụ giới tính.
11. Bổ sung chú thích phạm vi hiển thị cho tính năng xuất PDF và in cây lớn.
12. Bộ kiểm thử đa tầng: Unit, Database SQL, Integration, Component, E2E, Performance, Security & Data-Integrity.

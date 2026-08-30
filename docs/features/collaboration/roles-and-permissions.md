# Mô Hình Phân Quyền Đa Vai Trò (Roles & Permissions - P27-T01)

## 1. Hệ Thống 5 Vai Trò Phân Cấp
1. **Owner (Chủ sở hữu):** Toàn quyền quản trị, xóa cây gia phả và chuyển nhượng quyền sở hữu.
2. **Admin (Quản trị viên):** Quản lý thành viên, mời cộng tác, duyệt đề xuất và gộp hồ sơ. Không được hạ quyền Owner.
3. **Editor (Biên tập viên):** Thêm, sửa, xóa thành viên, quan hệ và ảnh đại diện.
4. **Contributor (Người đóng góp):** Xem cây gia phả và gửi đề xuất chỉnh sửa (Proposals).
5. **Viewer (Người xem):** Quyền chỉ xem cây gia phả và xuất bản in.

## 2. Nguyên Tắc Bảo Vệ
- Toàn bộ quyền hạn được thực thi nghiêm ngặt tại tầng PostgreSQL RLS và Server Action.
- Chủ sở hữu cuối cùng (Last Owner) không thể bị xóa hoặc giáng cấp quyền.

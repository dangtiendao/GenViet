# Kế Hoạch Di Chuyển Dữ Liệu Phase P27 (Data Migration Plan)

## 1. Mở Rộng Cơ Sở Dữ Liệu
Các bảng mở rộng sẵn sàng bổ sung trong các migration kế tiếp:
1. `tree_collaborators`: Mở rộng vai trò đa tầng (Admin, Editor, Contributor, Viewer).
2. `tree_invitations`: Lưu trữ token băm SHA-256 cho thư mời cộng tác.
3. `edit_proposals`: Lưu trữ đề xuất chỉnh sửa và diffs trường dữ liệu.
4. `person_account_links`: Lưu trữ liên kết giữa User Account và Person Node.
5. `family_events`: Lưu trữ các sự kiện phả hệ và ngày giỗ.
6. `photo_albums` & `scanned_documents`: Lưu trữ album và tài liệu scan riêng tư.

## 2. Tính Tương Thích & An Toàn
- Toàn bộ mở rộng tuân thủ nguyên tắc Forward-only Migration, bảo toàn 100% dữ liệu của phiên bản MVP v0.1.0.

# Parent Relationship Flows (Luồng Quan Hệ Cha Mẹ)

## 1. Thêm Cha Mới / Mẹ Mới (`create_person_with_parent_relationship`)
1. Người dùng chọn "Thêm Cha" hoặc "Thêm Mẹ" từ Node Action Menu.
2. Nhập thông tin Person mới (họ tên, ngày sinh, quê quán, tiểu sử).
3. Server Action xác thực người dùng và quyền Writer.
4. Gọi RPC PostgreSQL thực thi atomic: tạo Person $\rightarrow$ kiểm tra cycle $\rightarrow$ tạo Parent-Child relation.
5. Cập nhật giao diện và revalidate cache path.

## 2. Liên Kết Cha/Mẹ Có Sẵn (`link_existing_parent`)
1. Người dùng chọn tab "Chọn người có sẵn".
2. Tìm kiếm nhân vật trong cùng Tree.
3. Xem trước quan hệ (Preview).
4. Kiểm tra chu trình và cảnh báo cha/mẹ ruột.
5. Thực hiện liên kết an toàn.

## 3. Cha Mẹ Nuôi (`relationship_kind = 'adoptive'`)
- Cho phép tồn tại song song với cha mẹ ruột (`biological`).
- Không làm thay đổi hay xóa bỏ cha mẹ ruột đã xác minh.

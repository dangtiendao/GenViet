# Ma Trận Phân Quyền & RLS (Role & RLS Authorization Matrix)

## 1. Ma Trận Phân Quyền Kiểm Thử

| Hành Động / Tài Nguyên | Owner (Chủ cây) | Viewer (Người xem) | Outsider (Người ngoài) | Anonymous (Chưa đăng nhập) |
| :--- | :---: | :---: | :---: | :---: |
| Đọc Cây Gia Phả (`family_trees`) | **CHO PHÉP** | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI |
| Chỉnh Sửa Cây Gia Phả | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Thêm/Sửa/Xóa Nhân Vật (`persons`) | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Thêm/Sửa/Xóa Quan Hệ & Hôn Nhân | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Tải Lên & Xóa Avatar | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Xuất File Sao Lưu (Export Backup) | **CHO PHÉP** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Nhập File Sao Lưu (Import Backup) | **CHO PHÉP (Tạo cây mới)** | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |
| Đọc/Ghi Bảng `system_heartbeats` | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI | TỪ CHỐI |

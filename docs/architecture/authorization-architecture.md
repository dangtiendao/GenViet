# Kiến trúc Phân quyền & Bảo vệ Dữ liệu qua RLS (Authorization Architecture)

- **Mã tài liệu:** `ARCH-AUTHZ-01`
- **Mã Kiến trúc liên quan:** `AR-003`, `CNT-004`, `ADR-0006`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mô hình Phòng thủ Phân quyền 3 Lớp (Three-Tier Defense Model)

```mermaid
graph TD
    UserAction[Thao tác Người dùng] --> L1[Lớp 1: Giao diện Người dùng - UI Pre-check\n• Ẩn nút sửa/xóa nếu không phải chủ cây\n• Tối ưu trải nghiệm, không đóng vai trò bảo mật]
    L1 --> L2[Lớp 2: Máy chủ Ứng dụng - Service Layer Authorization\n• Xác thực user_id trong session\n• Kiểm tra quyền sở hữu tree_id\n• Fail-fast và trả mã lỗi thân thiện]
    L2 --> L3[Lớp 3: Cơ sở Dữ liệu - Row Level Security RLS\n• CƯỠNG CHẾ TUYỆT ĐỐI TẠI CSDL\n• USING (auth.uid() = owner_id)\n• Ngăn chặn 100% tấn công IDOR & Cross-tree access]
```

---

## 2. Ma trận Quyền hạn Tài nguyên Hệ thống (Authorization Matrix)

| Tài nguyên (Resource) | Tác nhân | Đọc (Read) | Tạo (Create) | Sửa (Update) | Xóa Mềm (Soft Delete) | Cưỡng chế RLS CSDL | Ghi Audit Log? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Cây Gia phả (`trees`)** | Chủ sở hữu (`Owner`) | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | `USING (auth.uid() = owner_id)` | ✅ Bắt buộc |
| **Cây Gia phả (`trees`)** | Người dùng khác / Guest | ❌ Từ chối | ❌ Từ chối | ❌ Từ chối | ❌ Từ chối | `USING (false)` | ❌ Không |
| **Thành viên (`persons`)** | Chủ sở hữu Cây | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | `USING (tree_id IN (SELECT id FROM trees WHERE owner_id = auth.uid()))` | ✅ Bắt buộc |
| **Quan hệ (`relationships`)**| Chủ sở hữu Cây | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | ✅ Cho phép | `USING (tree_id IN (SELECT id FROM trees WHERE owner_id = auth.uid()))` | ✅ Bắt buộc |
| **File Avatar (`Storage`)** | Chủ sở hữu Cây | ✅ Signed URL | ✅ Signed URL| ✅ Thay thế | ✅ Xóa file | Storage Bucket Policy: `owner_id` | ✅ Bắt buộc |
| **Nhật ký (`audit_logs`)** | Chủ sở hữu Cây | ✅ Xem lịch sử| ❌ Chỉ Service| ❌ Cấm sửa | ❌ Cấm xóa | `FOR SELECT USING (tree_id IN (...))` (Append-only) | ❌ N/A |

---

## 3. Các Biện pháp Phòng chống Tấn công Phân quyền Đặc thù

1. **Chống Tấn công IDOR (Insecure Direct Object Reference):**
   - Kẻ tấn công thay đổi `tree_id` hoặc `person_id` trong payload gửi lên Server Action sẽ bị **chặn đứng tại 2 tầng**: Service Layer kiểm tra quyền sở hữu và RLS CSDL tự động lọc kết quả về 0 dòng.
2. **Quy tắc Kiểm tra `tree_id` Không Tin cậy:**
   - Server Action và Service Layer tuyệt đối không tin tưởng mù quáng `tree_id` do client gửi lên. Mọi câu truy vấn đều phải đối chiếu `tree_id` với `owner_id == auth.uid()` trong bảng `trees`.
3. **Giới hạn Quyền Hạn `SUPABASE_SERVICE_ROLE_KEY`:**
   - Không dùng `service_role` để thực hiện các thao tác CRUD người dùng thông thường. Service role chỉ dùng cho script bảo trì hệ thống nội bộ chạy cô lập trên máy chủ.

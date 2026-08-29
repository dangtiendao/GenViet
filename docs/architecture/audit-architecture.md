# Kiến trúc Nhật ký Kiểm toán Nghiệp vụ (Audit Architecture)

- **Mã tài liệu:** `ARCH-AUDIT-01`
- **Mã Kiến trúc liên quan:** `CMP-008`, `AUD-001..007`, `ADR-0016`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Phân định Ba Loại Nhật ký trong Hệ thống

1. **Nhật ký Kiểm toán Nghiệp vụ (Business Audit Log):** Ghi nhận các thay đổi thực thể phả hệ (Tạo cây, thêm/sửa/xóa thành viên, đổi mốc đời, xuất sao lưu). Lưu trữ bền vững trong bảng `audit_logs` của PostgreSQL.
2. **Nhật ký An ninh (Security Audit Events):** Ghi nhận các lần đăng nhập thất bại liên tiếp, cố tình truy cập trái phép chéo cây (IDOR attempts).
3. **Nhật ký Vận hành Kỹ thuật (Operational Telemetry):** Log request/response, thời gian phản hồi, mã lỗi 500 phục vụ giám sát hạ tầng.

---

## 2. Danh mục Sự kiện Kiểm toán Nghiệp vụ Bắt buộc (Audit Catalogue)

| Mã Sự kiện | Tên Sự kiện Nghiệp vụ | Đối tượng Tác động | Dữ liệu Trạng thái Lưu vết | Điều kiện Giao dịch |
| :--- | :--- | :--- | :--- | :---: |
| **`AUD-001`** | `TREE_CREATED` / `TREE_UPDATED` | Cây Gia phả (`trees`) | Tên cây, mô tả, quyền riêng tư | Cùng Transaction tạo cây |
| **`AUD-002`** | `PERSON_CREATED` / `PERSON_UPDATED` | Thành viên (`persons`) | Họ tên, năm sinh, năm mất, quê quán | Cùng Transaction sửa hồ sơ |
| **`AUD-003`** | `PERSON_SOFT_DELETED` | Thành viên (`persons`) | Lý do xóa, danh sách quan hệ bị ngắt | Cùng Transaction xóa mềm |
| **`AUD-004`** | `RELATIONSHIP_CREATED` / `UNLINKED` | Quan hệ (`relationships`) | ID Cha/Mẹ, ID Con, Loại quan hệ | Cùng Transaction tạo nối |
| **`AUD-005`** | `MARRIAGE_CREATED` / `UNLINKED` | Hôn phối (`marriages`) | ID Chồng, ID Vợ, Trạng thái hôn nhân | Cùng Transaction tạo hôn phối|
| **`AUD-006`** | `GENERATION_ANCHOR_CHANGED` | Cây Gia phả (`trees`) | Mốc cũ $\rightarrow$ Mốc mới | Cùng Transaction đổi mốc |
| **`AUD-007`** | `BACKUP_EXPORTED` | Bản sao lưu (`backups`) | Số lượng thành viên và quan hệ xuất | Ghi log độc lập |

---

## 3. Cấu trúc Bản ghi Kiểm toán & Quy tắc An toàn

```sql
-- NON-PRODUCTION ARCHITECTURE EXAMPLE (Cấu trúc Khái niệm)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    correlation_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Các Điều Cấm Tuyệt Đối trong Audit Log:
- ❌ **CẤM** ghi mật khẩu, chuỗi băm mật khẩu (password hash) hay refresh token.
- ❌ **CẤM** ghi khóa `SUPABASE_SERVICE_ROLE_KEY`.
- ❌ **CẤM** ghi Signed URL đang còn hiệu lực truy cập ảnh riêng tư.
- ❌ **CẤM** lưu toàn bộ file nhị phân ảnh vào cột `before_state` hay `after_state`.

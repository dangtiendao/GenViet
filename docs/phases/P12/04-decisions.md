# Quyết Định Kiến Trúc: Phase P12

## 1. DEC-P12-001: Quản Lý Normalized Name Qua Database Trigger
- **Quyết định:** Giao việc tính toán và duy trì cột `normalized_name` cho database trigger `trg_persons_maintain_normalized_name` gọi `_system.normalize_person_name(NEW.full_name)` trong PostgreSQL.
- **Lý do:** Bảo đảm tính nhất quán dữ liệu 100%, không phụ thuộc vào việc client hay các batch job khác có gọi hàm chuẩn hóa hay không.

## 2. DEC-P12-002: Hoãn Lại Field Nickname (`P12-T05`)
- **Quyết định:** Ghi nhận hoãn lại `P12-T05` sang giai đoạn nâng cấp schema tiếp theo, không nhồi nhét vào `biography` hay dùng cột tạm thời.
- **Lý do:** Tuân thủ nguyên tắc toàn vẹn schema P07 và yêu cầu prompt.

## 3. DEC-P12-003: RPC `restore_person` Khôi Phục Nguyên Tử
- **Quyết định:** Dùng PostgreSQL Stored Procedure `public.restore_person(p_person_id UUID, p_expected_version int)` chạy dưới `SECURITY DEFINER` với `SET search_path = public, _system, pg_temp;`.
- **Lý do:** Thực hiện kiểm tra quyền ghi `_system.can_write_tree` và cập nhật phiên bản nguyên tử.

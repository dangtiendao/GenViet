# Quyết định Lựa chọn Enum vs Lookup Table (Enum & Lookup Decisions)

- **Mã tài liệu:** `DB-ENUM-01`
- **Phiên bản:** `v0.1-baseline`
- **Ngày ban hành:** 2026-08-29
- **Trạng thái:** `LOCKED`

---

## 1. Ma trận Đánh giá & Lựa chọn (Decision Matrix)

| Tập Giá trị | Các Giá trị Baseline | Mức Ổn định | Kiểu Được Chọn | Lý do Quyết định & Hệ quả |
| :--- | :--- | :---: | :---: | :--- |
| **`tree_status`** | `active`, `archived` | Rất cao | **PostgreSQL Enum** | Tập giá trị cố định, logic ứng dụng kiểm soát |
| **`tree_privacy_level`** | `private`, `public` | Rất cao | **PostgreSQL Enum** | Quyền riêng tư theo thiết kế MVP, default `private` |
| **`membership_role`** | `owner`, `admin`, `editor`, `viewer` | Rất cao | **PostgreSQL Enum** | RBAC tiêu chuẩn của GenViet, kiểm tra trong RLS P08 |
| **`membership_status`** | `active`, `invited`, `suspended` | Rất cao | **PostgreSQL Enum** | Vòng đời thành viên cố định |
| **`gender_type`** | `male`, `female`, `other`, `unknown` | Cao | **PostgreSQL Enum** | Phù hợp chuẩn phả hệ quốc tế và Việt Nam (`unknown` default) |
| **`living_status_type`** | `living`, `deceased`, `unknown` | Rất cao | **PostgreSQL Enum** | Ba trạng thái cơ bản, tránh boolean `is_deceased` |
| **`date_precision_type`** | `exact`, `year`, `unknown` | Rất cao | **PostgreSQL Enum** | Độ chính xác ngày tháng chuẩn theo P02 |
| **`verification_status_type`** | `unverified`, `verified`, `disputed` | Cao | **PostgreSQL Enum** | Trạng thái tin cậy của dữ liệu phả hệ |
| **`parent_role_type`** | `father`, `mother`, `unspecified` | Rất cao | **PostgreSQL Enum** | Vai trò cha/mẹ trong liên kết huyết thống |
| **`relationship_kind_type`** | `biological`, `adoptive`, `step`, `foster` | Cao | **PostgreSQL Enum** | Loại quan hệ trực hệ, nhận nuôi và đỡ đầu |
| **`union_status_type`** | `active`, `separated`, `divorced`, `widowed`, `former` | Cao | **PostgreSQL Enum** | Trạng thái hôn nhân |
| **`union_member_role_type`** | `spouse`, `partner`, `unspecified` | Rất cao | **PostgreSQL Enum** | Vai trò thành viên trong kết đôi |

# Ma trận Phân quyền Truy cập (Authorization Matrix)

- **Mã tài liệu:** `SEC-AUTH-MATRIX-01`
- **Phiên bản:** `v0.1-baseline`

---

| Thực thể / Tài nguyên | Hành động (Action) | `anon` | `outsider` | `viewer` | `editor` / `admin` | `owner` | `service_role` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Own Profile** | Read / Update | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Other Profile**| Read / Update | `DENY` | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| **Family Tree** | Create | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Family Tree** | Read (active) | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Family Tree** | Update (info/settings) | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` |
| **Family Tree** | Soft Delete | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` |
| **Tree Memberships** | Read (active) | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Tree Memberships** | Manage (Add/Update/Revoke) | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` |
| **Persons** | Read (active) | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Persons** | Create / Update / Soft Delete | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Relationships** | Read (active) | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Relationships** | Create / Update / Soft Delete | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Unions & Members** | Read (active) | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Unions & Members** | Create / Update / Soft Delete | `DENY` | `DENY` | `DENY` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Immutable Columns** | Mutate (`tree_id`, `id`, `user_id`) | `DENY` | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| **Hard Delete** | Purge physical row | `DENY` | `DENY` | `DENY` | `DENY` | `DENY` | `ALLOW` |

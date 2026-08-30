# Phase P19: Bảng Đối Soát 20 Nhiệm Vụ (Task Breakdown P19-T01 đến P19-T20)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Chi Tiết Thực Hiện |
| :--- | :--- | :---: | :--- |
| `P19-T01` | Định nghĩa schemaVersion | **COMPLETED** | Chốt `schemaVersion: 1`, tách biệt app version, có version detector |
| `P19-T02` | Định nghĩa JSON Schema | **COMPLETED** | Draft 2020-12 `genviet-backup-v1.schema.json` & Zod schema |
| `P19-T03` | Export thông tin gia phả | **COMPLETED** | RPC `export_family_tree_backup` export snapshot an toàn |
| `P19-T04` | Export nhân vật | **COMPLETED** | Export Persons, partial dates, living status, deterministic ordering |
| `P19-T05` | Export quan hệ | **COMPLETED** | Export Parent-Child relationships, giữ nguyên kind và verification |
| `P19-T06` | Export union | **COMPLETED** | Export Unions và Union Members, giữ nguyên cấu trúc hôn nhân |
| `P19-T07` | Export media metadata | **COMPLETED** | Export metadata-only (`binaryIncluded: false`), không export binary |
| `P19-T08` | Không export signed URL | **COMPLETED** | Quét khử nhiễm đệ quy, loại bỏ 100% tokens, signed URLs, passwords |
| `P19-T09` | Tải file backup | **COMPLETED** | Route Handler `GET /api/trees/[treeId]/backup` với Cache-Control no-store |
| `P19-T10` | Validate file import | **COMPLETED** | Pipeline 5 lớp: byte limit, syntax, schema, semantic invariants |
| `P19-T11` | Giới hạn dung lượng | **COMPLETED** | Tối đa 10 MB, 5.000 Persons, 10.000 Relationships, max nesting |
| `P19-T12` | Preview nội dung | **COMPLETED** | Giao diện Preview, hiển thị số lượng, cảnh báo media, digest SHA-256 |
| `P19-T13` | Phát hiện phiên bản cũ | **COMPLETED** | Phân loại current v1, future > 1, unsupported old, missing |
| `P19-T14` | Ánh xạ ID cũ sang UUID mới | **COMPLETED** | `buildIdMaps` & `remapBackupDocument`, rewrite toàn bộ foreign keys |
| `P19-T15` | Import trong transaction | **COMPLETED** | RPC `import_family_tree_backup` atomic trong PostgreSQL transaction |
| `P19-T16` | Mặc định tạo cây mới | **COMPLETED** | Không merge, không ghi đè, `auth.uid()` là Owner, privacy private |
| `P19-T17` | Báo cáo lỗi từng bản ghi | **COMPLETED** | Report item có section, recordIndex, sourceId, fieldPath, stable code |
| `P19-T18` | Rollback khi import lỗi | **COMPLETED** | Tự động rollback 100% khi có exception, không để lại dữ liệu rác |
| `P19-T19` | Test export rồi import lại | **COMPLETED** | Test round-trip semantic equality, verified relationships, unions |
| `P19-T20` | Test file bị sửa / không hợp lệ | **COMPLETED** | Test cycle, self-link, duplicate ID, secret injection, corrupted JSON |

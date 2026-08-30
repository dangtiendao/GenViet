# Phân Rã Nhiệm Vụ (Task Breakdown): Phase P13

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Ghi Chú Kỹ Thuật |
| :--- | :--- | :---: | :--- |
| `P13-T01` | Service tạo quan hệ | DONE | RelationshipService xử lý toàn bộ use cases quan hệ |
| `P13-T02` | RPC transaction | DONE | 10 RPCs trong migration 20260830110000 |
| `P13-T03` | Kiểm tra cùng tree_id | DONE | Composite FK, RPC checks, RLS policies |
| `P13-T04` | Kiểm tra self-link | DONE | Chặn parent_id = child_id, person1 = person2 |
| `P13-T05` | Kiểm tra trùng quan hệ | DONE | Unique partial index, RPC duplicate check |
| `P13-T06` | Recursive CTE phát hiện chu trình | DONE | Function `_system.check_parent_child_cycle` |
| `P13-T07` | Phân biệt lỗi và cảnh báo | DONE | Error taxonomy Section 43 |
| `P13-T08` | Ghi audit trong transaction | DEFERRED | Hoãn sang P18 (System Audit), hợp đồng DEFERRED_AUDIT |
| `P13-T09` | Action thêm cha mới | DONE | `addNewParentAction` với parent_role = 'father' |
| `P13-T10` | Action thêm mẹ mới | DONE | `addNewParentAction` với parent_role = 'mother' |
| `P13-T11` | Action thêm cha/mẹ nuôi | DONE | Hỗ trợ `relationship_kind = 'adoptive'` |
| `P13-T12` | Action thêm người giám hộ | DEFERRED | Hoãn lại vì schema P07 chưa có enum guardian |
| `P13-T13` | Liên kết cha có sẵn | DONE | `linkExistingParentAction` |
| `P13-T14` | Liên kết mẹ có sẵn | DONE | `linkExistingParentAction` |
| `P13-T15` | Cảnh báo cha ruột đã tồn tại | DONE | Cảnh báo khi đã có verified biological father |
| `P13-T16` | Cảnh báo mẹ ruột đã tồn tại | DONE | Cảnh báo khi đã có verified biological mother |
| `P13-T17` | Xử lý quan hệ chưa xác minh | DONE | Hỗ trợ verification_status 'unverified' / 'disputed' |
| `P13-T18` | Hủy hoặc thay thế quan hệ | DONE | Hủy an toàn không để rác, RPC replace_parent_relationship |
| `P13-T19` | Tạo Union | DONE | Tạo Union và 2 Union Members nguyên tử |
| `P13-T20` | Thêm vợ/chồng mới | DONE | `createUnionWithNewPersonAction` |
| `P13-T21` | Liên kết vợ/chồng có sẵn | DONE | `createUnionWithExistingPersonAction` |
| `P13-T22` | Thêm con mới | DONE | `addNewChildAction` (hỗ trợ tùy chọn cha/mẹ thứ hai) |
| `P13-T23` | Liên kết con có sẵn | DONE | `linkExistingChildAction` |
| `P13-T24` | Nhiều lần kết hôn | DONE | Lưu trữ nhiều Union độc lập cho cùng 1 cá nhân |
| `P13-T25` | Trạng thái kết thúc quan hệ | DONE | `endUnionAction` với divorced, widowed, separated |
| `P13-T26` | Xóa mềm quan hệ | DONE | `softDeleteRelationshipAction`, `softDeleteUnionAction` |
| `P13-T27` | Node Action Menu | DONE | Component `RelationshipActionMenu` |
| `P13-T28` | Luồng tạo Person mới | DONE | Tái sử dụng form fields P12 trong Dialog |
| `P13-T29` | Luồng chọn Person có sẵn | DONE | Component `ExistingPersonSelector` |
| `P13-T30` | Preview quan hệ trước khi lưu | DONE | Component `RelationshipPreviewCard` |
| `P13-T31` | Test chu trình hai node | DONE | `04100_relationship_cycles.test.sql` |
| `P13-T32` | Test chu trình nhiều thế hệ | DONE | `04100_relationship_cycles.test.sql` |
| `P13-T33` | Test mở rộng tổ tiên nhiều lần | DONE | Vitest + pgTAP |
| `P13-T34` | Test rollback transaction | DONE | `04200_relationship_transactions.test.sql` |

# Phase P18: Kế Hoạch Thi Công (Execution Plan)

## 1. Các Gói Công Việc (Work Packages)
1. **P18-WP01:** Preflight & kế hoạch thi công.
2. **P18-WP02:** Migration schema `audit_logs`, indexes, RLS và function `_system.write_audit_log`.
3. **P18-WP03:** Tích hợp ghi audit trong transaction cho RPCs P11, P12, P13.
4. **P18-WP04:** Xây dựng Domain Types, Errors, Schemas, DAL & Services cho Audit và Recovery.
5. **P18-WP05:** Giao diện lịch sử biến động (`/trees/[treeId]/history`) với bộ lọc và phân trang.
6. **P18-WP06:** Xây dựng Recovery RPCs và dialogs khôi phục (Person, Relationship, Union).
7. **P18-WP07:** Thiết lập chính sách thùng rác (30 ngày) và tiện ích quét dry-run.
8. **P18-WP08:** Kiểm thử kháng giả mạo, chất lượng toàn diện và bàn giao.

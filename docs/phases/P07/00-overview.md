# Phase Overview: P07 - Thiết kế Cơ sở Dữ liệu Lõi (Core Database Schema & DDL Design)

- **Mã Phase:** `P07`
- **Tên Phase:** Thiết kế Cơ sở Dữ liệu Lõi (Core Database Schema Design)
- **Dự án:** GenViet (v0.1)
- **Trạng thái Phase:** `IMPLEMENTATION_COMPLETE`
- **Nhánh Git thi công:** `phase/p07-core-database-schema`
- **Starting Commit:** `70d18a6` (Merge PR #6 for P06)
- **Vai trò thi công:** Principal Database Architect, PostgreSQL Engineer & Data Integrity Lead
- **Thời gian thực hiện:** 2026-08-29

---

## 1. Mục tiêu của Phase P07

1. Chuyển đổi Domain Model P02 và Kiến trúc P04 thành schema PostgreSQL lõi vững chắc.
2. Tạo 7 bảng CSDL cốt lõi: `profiles`, `family_trees`, `tree_memberships`, `persons`, `parent_child_relationships`, `unions`, `union_members`.
3. Bảo đảm tính cô lập dữ liệu theo từng cây gia phả (`Same-Tree Isolation`) bằng Composite Foreign Keys.
4. Hỗ trợ dữ liệu phả hệ không đầy đủ (Partial Dates: `exact`, `year`, `unknown` và cờ `is_estimated`), cấm điền ngày giả 01/01.
5. Thiết lập các ràng buộc toàn vẹn: Foreign Keys với referential actions (`RESTRICT`, `CASCADE`, `SET NULL`), Check Constraints, Unique Partial Indexes, và Graph Query Indexes.
6. Thiết lập trigger tự động cập nhật `updated_at` và trigger chuẩn hóa họ tên `normalized_name`.
7. Thiết lập trạng thái bảo vệ RLS deny-by-default trên tất cả các bảng public (chưa tạo business policies, chuyển giao cho P08).
8. Xây dựng bộ database test suites kiểm thử tính toàn vẹn CSDL.
9. Sinh lại TypeScript Database Types đồng bộ (`src/lib/supabase/database.types.ts`).
10. Xây dựng tài liệu ERD, Data Dictionary, Ma trận khóa ngoại và Chiến lược Indexing.

---

## 2. Ranh giới Kỹ thuật Nghiêm ngặt (Strict Boundaries)

- ❌ **Không viết RLS Business Policies** (Thuộc phạm vi Phase P08).
- ❌ **Không triển khai Auth UI / Session flows** (Thuộc phạm vi Phase P09).
- ❌ **Không triển khai Transactional Business RPC / CRUD** (Thuộc phạm vi Phase P11 - P13).
- ❌ **Không tự push code hoặc migration lên Git Remote.**

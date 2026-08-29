# Thiết kế Tầng Truy cập Dữ liệu (Repository Layer Specification)

- **Mã tài liệu:** `ARCH-REPO-01`
- **Mã Kiến trúc liên quan:** `AR-007`, `CMP-010`, `REP-001..007`, `ADR-0011`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mục tiêu & Nguyên tắc Thiết kế Tầng Repositories

1. **Cô lập Truy cập CSDL:** Toàn bộ các thao tác `SELECT`, `INSERT`, `UPDATE`, `DELETE` với PostgreSQL thông qua Supabase PostgREST Client đều phải nằm bên trong Repository Layer.
2. **Cưỡng chế Phân quyền theo Cây (Tree-Scoped Access):** Mọi hàm repository đều bắt buộc nhận tham số `treeId` và thực thi truy vấn với bối cảnh `User Session` (để CSDL áp dụng RLS).
3. **Chuẩn hóa Đầu ra (Typed DTOs):** Repository không trả về raw SDK response mà chuyển đổi thành các DTO nghiệp vụ rõ ràng, chuẩn hóa các mã lỗi CSDL thành `PersistenceError`.
4. **Chỉ Chạy Phía Máy Chủ (Server-Only Boundary):** Toàn bộ file repository đều có chỉ thị `import 'server-only'` để ngăn chặn việc vô tình import vào Client Components.

---

## 2. Danh mục 7 Repository Contracts Cốt lõi (Non-Production Architectural Contracts)

> [!NOTE]
> Các khai báo dưới đây là ví dụ hợp đồng kiến trúc (**`NON-PRODUCTION ARCHITECTURE EXAMPLE`**), không phải mã nguồn ứng dụng production.

```typescript
// NON-PRODUCTION ARCHITECTURE EXAMPLE

/** IFamilyTreeRepository [REP-001]: Quản trị Cây Gia phả */
export interface IFamilyTreeRepository {
  findById(treeId: string, userId: string): Promise<FamilyTreeEntity | null>;
  findByOwner(ownerId: string): Promise<FamilyTreeEntity[]>;
  create(data: CreateTreeDTO, ownerId: string): Promise<FamilyTreeEntity>;
  update(treeId: string, data: UpdateTreeDTO): Promise<FamilyTreeEntity>;
  softDelete(treeId: string): Promise<void>;
}

/** IPersonRepository [REP-002]: Quản trị Thành viên Gia phả */
export interface IPersonRepository {
  findById(personId: string, treeId: string): Promise<PersonEntity | null>;
  findByTree(treeId: string, options?: PaginationOptions): Promise<PersonEntity[]>;
  searchByName(treeId: string, query: string, limit?: number): Promise<PersonSearchResultDTO[]>;
  create(person: CreatePersonDTO, treeId: string): Promise<PersonEntity>;
  update(personId: string, data: UpdatePersonDTO, treeId: string): Promise<PersonEntity>;
  softDelete(personId: string, treeId: string): Promise<void>;
}

/** IRelationshipRepository [REP-003]: Quản trị Quan hệ Phụ mẫu - Con cái */
export interface IRelationshipRepository {
  findParents(childId: string, treeId: string): Promise<ParentRelationshipDTO[]>;
  findChildren(parentId: string, treeId: string): Promise<ChildRelationshipDTO[]>;
  findSpouses(personId: string, treeId: string): Promise<SpouseRelationshipDTO[]>;
  createParentChild(data: CreateParentChildDTO, treeId: string): Promise<RelationshipEntity>;
  createSpouse(data: CreateSpouseDTO, treeId: string): Promise<MarriageEntity>;
  softDeleteRelationship(relationshipId: string, treeId: string): Promise<void>;
  checkAncestorExists(ancestorCandidateId: string, descendantCandidateId: string, treeId: string): Promise<boolean>;
}

/** ITreeGraphRepository [REP-004]: Truy vấn Lát cắt Đồ thị Phả hệ */
export interface ITreeGraphRepository {
  getGraphSliceAroundCenter(treeId: string, centerPersonId: string, depth: number): Promise<GraphSliceEntity>;
  getAllActiveNodesAndEdges(treeId: string): Promise<FullTreeGraphEntity>;
}

/** IMediaMetadataRepository [REP-005]: Quản trị Thông tin Tệp tin Avatar */
export interface IMediaMetadataRepository {
  createMetadata(data: CreateMediaMetadataDTO): Promise<MediaMetadataEntity>;
  updateStatus(objectKey: string, status: 'CONFIRMED' | 'ORPHAN'): Promise<void>;
  findByPerson(personId: string): Promise<MediaMetadataEntity | null>;
}

/** IAuditRepository [REP-006]: Ghi nhận Nhật ký Kiểm toán Nghiệp vụ */
export interface IAuditRepository {
  appendLog(entry: CreateAuditEntryDTO): Promise<void>;
  findByTree(treeId: string, limit?: number): Promise<AuditLogEntity[]>;
}

/** IBackupRepository [REP-007]: Trích xuất Toàn văn Dữ liệu Sao lưu */
export interface IBackupRepository {
  exportFullTreeData(treeId: string): Promise<FullTreeBackupPayloadDTO>;
}
```

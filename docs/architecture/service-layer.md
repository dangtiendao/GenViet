# Thiết kế Tầng Dịch vụ Nghiệp vụ (Service Layer Specification)

- **Mã tài liệu:** `ARCH-SERVICE-01`
- **Mã Kiến trúc liên quan:** `AR-007`, `CMP-006`, `SVC-001..008`, `ADR-0011`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Mục tiêu & Trách nhiệm của Service Layer

Service Layer là trung tâm điều phối toàn bộ các trường hợp sử dụng (Use Cases) của hệ thống GenViet:
1. **Kiểm tra Bất biến Nghiệp vụ (Domain Invariants):** Kiểm tra chống vòng lặp thế hệ DAG (`INV-004`), kiểm tra niên đại phi lý (`ERR-005`), kiểm tra trùng lặp quan hệ (`ERR-006`).
2. **Quản lý Ranh giới Giao dịch (Transaction Orchestration):** Đảm bảo tính nguyên tử khi tạo người mới kèm phụ mẫu hoặc xóa mềm kèm ngắt liên kết.
3. **Độc lập Hoàn toàn khỏi UI:** Không import các component React, không phụ thuộc vào Next.js Request/Response hay state của trình duyệt.
4. **Phản hồi Chuẩn hóa (Typed Application Result):** Mọi service method đều trả về cấu trúc phân biệt: `SUCCESS`, `BLOCKING_ERROR` (Khóa thao tác), hoặc `WARNING_REQUIRES_CONFIRMATION` (Yêu cầu xác nhận từ người dùng).

---

## 2. Danh mục 8 Service Interfaces Cốt lõi (Architectural Contracts)

> [!NOTE]
> Các khai báo dưới đây là ví dụ hợp đồng kiến trúc (**`NON-PRODUCTION ARCHITECTURE EXAMPLE`**), không phải mã nguồn ứng dụng production.

```typescript
// NON-PRODUCTION ARCHITECTURE EXAMPLE

/** IFamilyTreeService [SVC-001]: Use cases liên quan tới Cây */
export interface IFamilyTreeService {
  createTree(userId: string, cmd: CreateTreeCommand): Promise<ServiceResult<FamilyTreeDTO>>;
  getTreeDashboard(userId: string): Promise<ServiceResult<FamilyTreeDTO[]>>;
  updateTreeSettings(userId: string, treeId: string, cmd: UpdateTreeSettingsCommand): Promise<ServiceResult<FamilyTreeDTO>>;
  setGenerationAnchor(userId: string, treeId: string, anchorPersonId: string): Promise<ServiceResult<void>>;
}

/** IPersonService [SVC-002]: Use cases liên quan tới Thành viên */
export interface IPersonService {
  createInitialPerson(userId: string, treeId: string, cmd: CreateInitialPersonCommand): Promise<ServiceResult<PersonDTO>>;
  updatePersonProfile(userId: string, treeId: string, personId: string, cmd: UpdatePersonCommand): Promise<ServiceResult<PersonDTO>>;
  softDeletePerson(userId: string, treeId: string, personId: string): Promise<ServiceResult<SoftDeleteImpactSummaryDTO>>;
}

/** IRelationshipService [SVC-003]: Use cases liên quan tới Quan hệ Phả hệ */
export interface IRelationshipService {
  addParent(userId: string, treeId: string, cmd: AddParentCommand): Promise<ServiceResult<RelationshipResultDTO>>;
  addSpouse(userId: string, treeId: string, cmd: AddSpouseCommand): Promise<ServiceResult<MarriageResultDTO>>;
  addChild(userId: string, treeId: string, cmd: AddChildCommand): Promise<ServiceResult<RelationshipResultDTO>>;
  linkExistingPerson(userId: string, treeId: string, cmd: LinkExistingPersonCommand): Promise<ServiceResult<RelationshipResultDTO>>;
  unlinkRelationship(userId: string, treeId: string, relationshipId: string): Promise<ServiceResult<void>>;
}

/** ITreeQueryService [SVC-004]: Use cases truy vấn Lát cắt Đồ thị */
export interface ITreeQueryService {
  getTreeViewportSlice(userId: string, treeId: string, centerPersonId: string, depth: number): Promise<ServiceResult<QueryGraphSliceDTO>>;
}

/** ISearchService [SVC-005]: Use cases tìm kiếm thành viên Tiếng Việt */
export interface ISearchService {
  searchPersons(userId: string, treeId: string, query: string): Promise<ServiceResult<PersonSearchResultDTO[]>>;
}

/** IMediaService [SVC-006]: Use cases quản trị ảnh đại diện */
export interface IMediaService {
  requestAvatarUploadUrl(userId: string, treeId: string, personId: string, mimeType: string, fileSize: number): Promise<ServiceResult<SignedUploadUrlDTO>>;
  confirmAvatarUpload(userId: string, treeId: string, personId: string, objectKey: string): Promise<ServiceResult<void>>;
}

/** IBackupService [SVC-007]: Use cases xuất dữ liệu sao lưu */
export interface IBackupService {
  exportTreeBackup(userId: string, treeId: string): Promise<ServiceResult<BackupExportPayloadDTO>>;
}

/** IAuditService [SVC-008]: Use cases ghi nhận lịch sử kiểm toán */
export interface IAuditService {
  logEvent(event: AuditEventCommand): Promise<void>;
  getTreeAuditHistory(userId: string, treeId: string, limit?: number): Promise<ServiceResult<AuditLogDTO[]>>;
}
```

# Graph DTO Contract (TreeGraphDto)

## 1. Cấu Trúc Tổng Thể `TreeGraphDto`

```typescript
export interface TreeGraphDto {
  schemaVersion: number; // Mặc định: 1
  treeId: string; // UUID của cây gia phả
  centerPersonId: string; // UUID của nhân vật trung tâm
  persons: GraphPersonDto[]; // Danh sách nhân vật trong lát cắt
  parentChildRelationships: ParentChildRelationshipDto[]; // Danh sách quan hệ huyết thống
  unions: UnionDto[]; // Danh sách hôn nhân
  unionMembers: UnionMemberDto[]; // Danh sách thành viên hôn nhân
  expansion: Record<string, ExpansionDto>; // Metadata mở rộng theo Person ID
  limits: LimitsDto; // Metadata giới hạn & ngân sách
  truncated: boolean; // Cờ báo hiệu kết quả có bị cắt gọt do vượt ngân sách
  warnings?: string[]; // Cảnh báo nghiệp vụ (nếu có)
}
```

## 2. Chi Tiết Các Thực Thể Con

### 2.1. `GraphPersonDto`
| Thuộc tính | Kiểu dữ liệu | Ý nghĩa |
| :--- | :--- | :--- |
| `id` | `string` (UUID) | Khóa chính nhân vật |
| `fullName` | `string` | Họ và tên hiển thị |
| `gender` | `'male' \| 'female' \| 'other' \| 'unknown'` | Giới tính |
| `livingStatus` | `'living' \| 'deceased' \| 'unknown'` | Trạng thái sống |
| `birthDate` | `string \| null` | Ngày sinh (YYYY-MM-DD nếu exact) |
| `birthYear` | `number \| null` | Năm sinh (nếu chỉ biết năm) |
| `birthDatePrecision` | `'exact' \| 'month' \| 'year' \| 'unknown'` | Độ chính xác ngày sinh |
| `birthIsEstimated` | `boolean` | Ngày sinh ước lượng |
| `deathDate` / `deathYear` | `string \| number \| null` | Thông tin ngày mất |
| `verificationStatus` | `'verified' \| 'unverified' \| 'disputed'` | Trạng thái xác minh |
| `isCenter` | `boolean` | `true` nếu là Center Person |

### 2.2. `ParentChildRelationshipDto`
- `id`: UUID của quan hệ.
- `parentId`: UUID cha/mẹ (gốc).
- `childId`: UUID con (ngọn).
- `parentRole`: `'father' | 'mother' | 'unspecified'`.
- `relationshipKind`: `'biological' | 'adoptive' | 'step' | 'foster'`.
- `verificationStatus`: Trạng thái xác minh quan hệ.

### 2.3. `ExpansionDto`
- `hasMoreAncestors`: `boolean` (Còn tổ tiên ngoài biên lát cắt).
- `hasMoreDescendants`: `boolean` (Còn hậu duệ ngoài biên lát cắt).
- `canAddFather`: `boolean` (Có thể thêm cha ruột).
- `canAddMother`: `boolean` (Có thể thêm mẹ ruột).

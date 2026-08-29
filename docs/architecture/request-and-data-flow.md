# Luồng Xử lý Yêu cầu & Dữ liệu Hệ thống (Request & Data Flow)

- **Mã tài liệu:** `ARCH-FLOW-01`
- **Mã Kiến trúc liên quan:** `DF-001..008`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Luồng 1: Đăng nhập & Xác thực Phiên làm việc (`DF-001`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Chủ sở hữu Gia phả
    participant Browser as Browser (Client)
    participant NextServer as Next.js Server (RSC/Route)
    participant SupaAuth as Supabase Auth

    User->>Browser: Nhập Email & Mật khẩu -> Bấm "Đăng nhập"
    Browser->>SupaAuth: signInWithPassword({ email, password })
    SupaAuth-->>Browser: Trả về JWT Access Token + Refresh Token
    Browser->>NextServer: Gửi session cookie qua HTTPS (Set-Cookie)
    NextServer->>SupaAuth: Xác thực phiên SSR (getUser())
    SupaAuth-->>NextServer: User Identity hợp lệ
    NextServer-->>Browser: Redirect về Dashboard / Cây gia phả (/tree/:id)
```

---

## 2. Luồng 2: Tải & Hiển thị Khung nhìn Cây Gia phả (`DF-002`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Browser as Browser (React Flow)
    participant ELK as ELK.js Layout Engine
    participant RSC as Next.js Server Component
    participant TreeSvc as TreeQueryService
    participant DB as PostgreSQL (RLS Active)

    User->>Browser: Mở URL /tree/:id
    Browser->>RSC: HTTP GET /tree/:id (Kèm Cookie Auth)
    RSC->>TreeSvc: getTreeSliceAroundCenter(treeId, centerPersonId, depth=3)
    TreeSvc->>DB: Query Persons & Relationships WHERE tree_id = :id
    Note over DB: RLS kiểm tra auth.uid() == tree.owner_id
    DB-->>TreeSvc: Trả về 30-50 Nodes & Edges (Domain Graph Slice)
    TreeSvc-->>RSC: QueryGraph DTO (Đã lọc dữ liệu nhạy cảm)
    RSC-->>Browser: Render HTML + Truyền QueryGraph DTO vào Canvas Props
    Browser->>ELK: calculateLayout(nodes, edges, config)
    ELK-->>Browser: Trả về tọa độ hiển thị (x, y) cho từng node
    Browser-->>User: Hiển thị Đồ thị Cây React Flow mượt mà quanh Center Person
```

---

## 3. Luồng 3: Thêm Cha/Mẹ Mới trong Transaction Nguyên tử (`DF-003`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Browser as Form Sheet (Client)
    participant SA as Server Action (addParentAction)
    participant RelSvc as RelationshipService
    participant DAG as DAG Invariant Validator
    participant DB as PostgreSQL (Transaction)
    participant Audit as AuditService

    User->>Browser: Nhập thông tin Cha mới -> Bấm "Lưu thành viên"
    Browser->>SA: Gọi Server Action (treeId, childId, newParentData)
    SA->>RelSvc: addParentWithNewPerson(command)
    RelSvc->>DAG: validateNoCycle(treeId, newParentId, childId)
    DAG-->>RelSvc: Hợp lệ (DAG Invariant PASS)
    
    RelSvc->>DB: BEGIN TRANSACTION
    RelSvc->>DB: 1. INSERT INTO persons (new parent)
    RelSvc->>DB: 2. INSERT INTO relationships (parent_id, child_id, type='BIOLOGICAL')
    RelSvc->>Audit: 3. Ghi log kiểm toán (ACTION_ADD_PARENT)
    Audit->>DB: INSERT INTO audit_logs (...)
    RelSvc->>DB: COMMIT TRANSACTION
    
    RelSvc-->>SA: Result Success (Parent Created & Linked)
    SA-->>Browser: Revalidate Path -> Trả về kết quả thành công
    Browser-->>User: Node Cha xuất hiện ở tầng trên + Toast thành công
```

---

## 4. Luồng 4: Tải Lên & Cập nhật Ảnh Chân dung (Avatar Signed Flow) (`DF-004`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Browser as Browser (Client)
    participant RH as Route Handler (/api/media/sign-upload)
    participant Storage as Supabase Storage (Private Bucket)
    participant PersonSvc as PersonService
    participant DB as PostgreSQL

    User->>Browser: Chọn file ảnh (avatar.jpg < 5MB)
    Browser->>RH: POST /api/media/sign-upload (treeId, personId, mimeType)
    Note over RH: Xác thực quyền sở hữu cây và kiểm tra MIME type
    RH->>Storage: Tạo Signed Upload URL ngắn hạn (5 phút)
    Storage-->>RH: signedUploadUrl
    RH-->>Browser: { uploadUrl, objectKey }
    
    Browser->>Storage: PUT binary file trực tiếp lên uploadUrl
    Storage-->>Browser: Upload Complete (200 OK)
    
    Browser->>PersonSvc: Server Action: confirmAvatarUpload(personId, objectKey)
    PersonSvc->>DB: UPDATE persons SET avatar_key = :objectKey WHERE id = :personId
    DB-->>PersonSvc: Updated OK
    PersonSvc-->>Browser: Cập nhật thành công
    Browser-->>User: Ảnh avatar mới hiển thị trên Node và Profile Panel
```

---

## 5. Luồng 5: Xuất Sao lưu Dữ liệu Gia phả JSON (`DF-005`)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant Browser as Browser (Client)
    participant RH as Route Handler (/api/tree/:id/export)
    participant BackupSvc as BackupService
    participant DB as PostgreSQL
    participant Audit as AuditService

    User->>Browser: Bấm "Tải file sao lưu (.json)"
    Browser->>RH: GET /api/tree/:id/export (Auth Cookie)
    RH->>BackupSvc: exportTreeToJson(treeId, userId)
    BackupSvc->>DB: SELECT * FROM trees, persons, relationships WHERE tree_id = :id
    DB-->>BackupSvc: Toàn bộ dữ liệu dòng họ
    BackupSvc->>Audit: Ghi log kiểm toán xuất dữ liệu
    BackupSvc-->>RH: Trả về JSON Buffer + Headers (Content-Disposition: attachment)
    RH-->>Browser: Stream file GenViet_Backup_[Name]_[Date].json
    Browser-->>User: Trình duyệt tự động lưu file về máy tính cá nhân
```

---

## 6. Luồng 6: Xử lý Lỗi Phân quyền & Từ chối Truy cập (RLS Denied) (`DF-006`)

```mermaid
sequenceDiagram
    autonumber
    actor Attacker as Kẻ tấn công / User lạ
    participant Browser as Browser
    participant RSC as Server Component
    participant DB as PostgreSQL (RLS Engine)

    Attacker->>Browser: Cố tình truy cập URL /tree/:otherUserTreeId
    Browser->>RSC: GET /tree/:otherUserTreeId
    RSC->>DB: Query Tree & Persons WHERE id = :otherUserTreeId
    Note over DB: RLS Engine kiểm tra: auth.uid() != tree.owner_id
    DB-->>RSC: Trả về 0 records (Empty / Not Found)
    RSC-->>Browser: Render Màn hình Từ chối / 404 SCR-024 (Bảo mật thông tin tồn tại)
    Browser-->>Attacker: "Cây gia phả không tồn tại hoặc bạn không có quyền truy cập"
```

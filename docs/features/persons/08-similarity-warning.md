# Similar Profile Warning Flow (Cảnh Báo Hồ Sơ Tương Tự)

## 1. Mục Đích Nghiệp Vụ
Trong các dòng họ Việt Nam, nhiều người có thể trùng họ và tên (ví dụ: con cháu đặt tên theo các bậc tiền nhân hoặc trùng tên giữa các chi phái). Hệ thống cần:
- Cảnh báo người nhập liệu khi có khả năng trùng lặp hồ sơ.
- **Không bao giờ tự ý gộp (No Auto-merge) hoặc tự động liên kết (No Auto-link)** vì có thể làm sai lệch dữ liệu thế thứ.
- Cung cấp luồng xác nhận rõ ràng (Explicit Confirmation Flow).

## 2. Luồng Xử Lý
```mermaid
sequenceDiagram
    actor User as Người dùng
    participant UI as Form Tạo Nhân Vật
    participant Action as createFullPersonAction
    participant Svc as PersonService
    participant DB as PostgreSQL DB

    User->>UI: Nhập tên "Nguyễn Văn An" & Submit
    UI->>Action: Gửi form (confirmSimilar=false)
    Action->>Svc: createFullPerson(data)
    Svc->>DB: findSimilarPeople(treeId, "nguyễn văn an")
    DB-->>Svc: [Candidate A, Candidate B]
    Svc-->>Action: { isWarning: true, warningCandidates: [...] }
    Action-->>UI: Trả về state cảnh báo
    UI->>User: Mở modal "Cảnh báo hồ sơ tương tự"
    User->>UI: Chọn "Vẫn tạo nhân vật này"
    UI->>Action: Gửi lại form (confirmSimilar=true)
    Action->>Svc: createFullPerson(data)
    Svc->>DB: INSERT INTO persons ...
    DB-->>Svc: Person đã tạo
    Action-->>UI: Chuyển hướng tới trang chi tiết nhân vật
```

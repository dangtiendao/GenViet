# Kiến trúc Đồ thị Phả hệ 4 Lớp & Hiển thị Tương tác (Family Graph Architecture)

- **Mã tài liệu:** `ARCH-GRAPH-01`
- **Mã Kiến trúc liên quan:** `AR-002`, `CMP-001`, `CMP-002`, `ADR-0008..0010`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Phân tách Triệt để 4 Lớp Đồ thị (The 4-Tier Graph Model)

```mermaid
graph TD
    subgraph Tier1 [Lớp 1: Đồ thị Nghiệp vụ - Domain Graph]
        DG[PostgreSQL Entities\n• Persons\n• Biological/Adoptive Parents\n• Marriages / Unions\n• Verification Semantics\n❌ KHÔNG CHỨA TỌA ĐỘ UI]
    end

    subgraph Tier2 [Lớp 2: Lát cắt Truy vấn - Query Graph Slice]
        QG[TreeQueryService Output\n• Cửa sổ 30-50 nodes quanh Center Person\n• Độ sâu tổ tiên (depth=2-3) & hậu duệ\n• Dữ liệu thu gọn cho di động]
    end

    subgraph Tier3 [Lớp 3: Đồ thị Bố cục - Layout Graph]
        LG[ELK.js Input Graph\n• Kích thước Node cố định: 220x90px\n• Node Hôn nhân Ảo (Dummy Union Node)\n• Thuật toán elk.layered\n• Tính toán tọa độ phân tầng (x, y)]
    end

    subgraph Tier4 [Lớp 4: Đồ thị Hiển thị - Presentation Graph]
        PG[React Flow Canvas\n• React Flow Custom Nodes\n• Solid / Dashed Edges\n• Viewport Pan/Zoom & Selection State\n• UI Event Callbacks]
    end

    DG -->|TreeQueryService Slice Query| QG
    QG -->|Graph Projection Adapter| LG
    LG -->|ELK.js Layout Calculation (Worker)| PG
```

---

## 2. Ma trận Ánh xạ Giữa 4 Lớp Đồ thị (Graph Transformation Matrix)

| Thuộc tính / Khái niệm | Lớp 1: Domain Graph | Lớp 2: Query Graph Slice | Lớp 3: Layout Graph (ELK) | Lớp 4: Presentation Graph (React Flow) |
| :--- | :--- | :--- | :--- | :--- |
| **Thành viên (Person)** | Bản ghi `persons` trong DB | DTO `PersonSummaryDTO` | Node `{ id, width: 220, height: 90 }` | Custom Node Component `PersonNode` |
| **Quan hệ Phụ mẫu - Con** | Bản ghi `relationships` | DTO `ParentChildLinkDTO` | Cạnh `{ id, source, target }` | Đường kẻ nét liền (Solid Edge) |
| **Hôn phối (Vợ / Chồng)** | Bản ghi `marriages` | DTO `SpouseLinkDTO` | Node ảo kết hôn + 2 cạnh ngang | Đường đôi ngang (Marriage Edge) |
| **Quan hệ Chưa xác minh**| `is_verified = false` | `unverified: true` | Cạnh có gắn cờ `dashed` | Đường kẻ nét đứt màu cam |
| **Tọa độ Không gian** | ❌ Không tồn tại | ❌ Không tồn tại | Output: `{ x: 150, y: 300 }` | Input: `position: { x: 150, y: 300 }` |
| **Trọng tâm Khung nhìn** | Thuộc tính cài đặt | Gốc tính toán cửa sổ | Trọng tâm phân tầng | `setCenter(x, y)` / Smooth Pan |

---

## 3. Vai trò của React Flow & ELK.js và Cơ chế Tối ưu Hiệu năng

### 3.1. Thư viện Hiển thị React Flow (`CMP-001` / `ADR-0008`)
- React Flow **chỉ đóng vai trò là View Engine** vẽ canvas SVG/HTML trên trình duyệt máy khách.
- **Không phải Nguồn Dữ liệu:** Khi người dùng tương tác kéo thả (pan/zoom) hay chọn node, React Flow chỉ thay đổi state viewport nội bộ của nó.
- **Tối ưu Hiệu năng:** Sử dụng `memo` cho Custom Node component, chỉ re-render những node có thay đổi trạng thái chọn hoặc đổi thông tin.

### 3.2. Thuật toán Tính Bố cục ELK.js (`CMP-002` / `ADR-0009`)
- ELK.js (sử dụng thuật toán `elk.layered`) nhận đầu vào là đồ thị phân cấp không gian và tự động tính toán tọa độ `(x, y)` sao cho:
  - Các thế hệ được xếp ngay ngắn theo các hàng ngang (tiers).
  - Phụ mẫu nằm ở hàng trên, con cái nằm ở hàng dưới.
  - Vợ chồng nằm cạnh nhau trên cùng một hàng ngang.
  - Giảm thiểu tối đa các đường nối cắt nhau (edge crossings).
- **Khả năng chạy trong Web Worker (Web Worker Readiness):** Đối với đồ thị lớn ($\ge 50\text{ nodes}$), thuật toán ELK được đưa vào chạy trong Web Worker ngầm để không làm đơ giật giao diện chính (main thread) trên điện thoại di động ($\ge 45\text{ FPS}$).

### 3.3. Giải pháp Khả năng Tiếp cận cho Người Khiếm thị (A11y Alternative)
- Do Canvas React Flow là đồ thị không gian 2D khó định vị bằng Trình đọc màn hình (Screen Reader):
- Kiến trúc cung cấp **Giao diện Danh sách Thành viên & Tra cứu Tìm kiếm (`SCR-010`)** chạy song song. Người dùng Screen Reader có thể duyệt tuần tự danh sách thế hệ, phụ mẫu và con cháu mà không cần nhìn vào Canvas.

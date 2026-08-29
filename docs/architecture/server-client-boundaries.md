# Phân định Ranh giới Server Component và Client Component (Server vs Client Boundaries)

- **Mã tài liệu:** `ARCH-BOUNDARY-SC-01`
- **Mã Kiến trúc liên quan:** `AR-005`, `ADR-0002`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Ma trận Quyết định Phân chia Component theo 25 Màn hình P03

| Khu vực / Màn hình | Tên Component Đại diện | Loại Component | Lý do & Ranh giới Kỹ thuật |
| :--- | :--- | :---: | :--- |
| **`SCR-001` (Login)** | `LoginPage` | `Server Component` | Render khung nền và title bảo mật, bọc form client. |
| **`SCR-001` (Login Form)** | `LoginForm` | `Client Component` | Cần `useActionState`, quản lý focus ô nhập, bàn phím di động. |
| **`SCR-005` (Dashboard)** | `DashboardPage` | `Server Component` | Query danh sách cây phả hệ thuộc sở hữu của User trực tiếp tại server. |
| **`SCR-007` (Create Tree Modal)**| `CreateTreeDialog` | `Client Component` | Mở/đóng modal dialog, validation tên cây tức thì. |
| **`SCR-009` (Tree Canvas Page)** | `TreeViewPage` | `Server Component` | Tải dữ liệu lát cắt cây (`QueryGraphSlice`) quanh Center Person. |
| **`SCR-009` (Tree Canvas)** | `ReactFlowTreeCanvas` | `Client Component` | Sử dụng React Flow, bắt sự kiện Pan/Zoom, Web Worker ELK layout. |
| **`SCR-009` (Controls nổi)** | `FloatingCanvasControls`| `Client Component` | Nút bấm phóng to, thu nhỏ, Fit view, Center focus. |
| **`SCR-011` (Profile Panel/Sheet)**| `PersonProfileSheet` | `Client Component` | Quản lý 3 nấc Bottom Sheet (Peek, Half, Full), cử chỉ vuốt di động. |
| **`SCR-012..016` (Person Forms)**| `PersonFormModal` | `Client Component` | Bộ chọn Date Precision, chuyển đổi 2 Tab (Tạo mới vs Chọn có sẵn). |
| **`SCR-017` (Link Person Picker)**| `LinkPersonPicker` | `Client Component` | Ô tìm kiếm tức thì (Debounced 250ms), chọn thẻ thành viên. |
| **`SCR-018` (Alerts & Confirms)** | `DangerousActionDialog`| `Client Component` | Hộp thoại xác nhận xóa mềm, quản lý Focus mặc định vào nút Hủy. |
| **`SCR-010` (Search Modal/Page)**| `GlobalSearchModal` | `Client Component` | Thanh Command Bar `Ctrl+K`, duyệt kết quả bằng phím `↑` `↓`. |
| **`SCR-019` (Tree Settings)** | `TreeSettingsPage` | `Server Component` | Tải cấu hình cây, danh sách mốc số đời từ database. |
| **`SCR-020` (Backup Card)** | `BackupExportCard` | `Client Component` | Bắt sự kiện click tải file, hiển thị trạng thái Progress bar. |

---

## 2. Các Quy tắc Bắt buộc Khi Truyền Dữ liệu Qua Ranh giới (Boundary Rules)

1. **Tính Tuần tự hóa 100% (Serializable Props):** Dữ liệu truyền từ Server Component sang Client Component phải là JSON-serializable (String, Number, Boolean, Array, Plain Object). Tuyệt đối không truyền `Function`, `Date object` chưa định dạng, hoặc `Class instance`.
2. **Không Truyền Dữ liệu Thừa & Nhạy cảm:** Khi render đồ thị cây:
   - **ĐƯỢC TRUYỀN:** `id`, `full_name`, `gender`, `birth_year`, `death_year`, `avatar_url`, `generation_number`.
   - **CẤM TRUYỀN VÀO NODE PROPS:** Số điện thoại, CCCD, Email cá nhân, Toàn văn ghi chú tiểu sử bí mật. (Các thông tin này chỉ fetch riêng khi người dùng mở Profile Sheet).
3. **Cấm Đưa Secret qua Boundary:** Khóa `SUPABASE_SERVICE_ROLE_KEY` hoặc các biến môi trường không có tiền tố `NEXT_PUBLIC_` tuyệt đối không được tham chiếu trong bất kỳ Client Component nào.
4. **Không Dùng Client State Thay thế CSDL:** Trạng thái Client (Zustand / React Context) chỉ dùng để lưu trữ trạng thái hiển thị tạm thời (modal đang mở hay đóng, node nào đang chọn, mức zoom hiện tại). Mọi dữ liệu phả hệ đều phải đồng bộ về CSDL thông qua Server Actions.

# Phân Rã Nhiệm Vụ (Task Breakdown): Phase P12

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Ghi Chú Kỹ Thuật |
| :--- | :--- | :---: | :--- |
| `P12-T01` | Schema form nhân vật | DONE | Zod validation schemas chung cho create/edit |
| `P12-T02` | Form tạo tối giản | DONE | Nhập liệu nhanh họ tên, giới tính, ngày sinh |
| `P12-T03` | Form chỉnh sửa đầy đủ | DONE | Đầy đủ trường, optimistic version check, danger zone |
| `P12-T04` | Nhập họ tên | DONE | Bắt buộc, Unicode có dấu, trim, cấm control characters |
| `P12-T05` | Nhập tên thường gọi | DEFERRED | Hoãn lại vì schema P07 chưa có cột nickname |
| `P12-T06` | Chọn giới tính | DONE | Enum: male, female, other, unknown |
| `P12-T07` | Chọn trạng thái sống | DONE | Enum: living, deceased, unknown |
| `P12-T08` | Nhập ngày sinh | DONE | PartialDateInput, hỗ trợ exact date |
| `P12-T09` | Nhập chỉ biết năm sinh | DONE | Lưu `birth_year`, `birth_date = NULL`, cấm ngày giả `01/01` |
| `P12-T10` | Đánh dấu ngày sinh ước tính | DONE | Lưu cờ `birth_is_estimated` |
| `P12-T11` | Nhập ngày mất | DONE | Ẩn khi còn sống, hỗ trợ exact, year-only, unknown |
| `P12-T12` | Kiểm tra ngày mất trước ngày sinh | DONE | Chặn exact death < exact birth (`AC-P12-075/076`) |
| `P12-T13` | Nhập quê quán | DONE | Lưu vào cột `hometown_text` |
| `P12-T14` | Nhập nghề nghiệp | DONE | Lưu vào cột `occupation_text` |
| `P12-T15` | Nhập tiểu sử | DONE | Lưu vào cột `biography` (Plain text an toàn) |
| `P12-T16` | Tạo normalized_name | DONE | Trigger DB quản lý tự động, TypeScript helper đồng bộ |
| `P12-T17` | Trang chi tiết nhân vật | DONE | Route `/trees/[treeId]/people/[personId]` |
| `P12-T18` | Danh sách quan hệ nhân vật | DONE | Read-only summary cha mẹ, con cái, vợ chồng |
| `P12-T19` | Sửa có optimistic concurrency | DONE | Cột `version` phát hiện và chặn ghi đè stale |
| `P12-T20` | Xóa mềm | DONE | Lưu `deleted_at`, `deleted_by`, tăng `version`, chặn anchor |
| `P12-T21` | Khôi phục Person | DONE | RPC `restore_person` an toàn |
| `P12-T22` | Cảnh báo hồ sơ tương tự | DONE | Phát hiện trùng tên/năm sinh, explicit continue flow |
| `P12-T23` | Test validation | DONE | 15 Vitest schema tests, 10 partial date tests |
| `P12-T24` | Test quyền dữ liệu | DONE | 4 pgTAP suites, 6 Playwright E2E tests |

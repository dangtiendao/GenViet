# Quy Trình Đề Xuất Chỉnh Sửa (Edit Proposals - P27-T03)

## 1. Vòng Đời Đề Xuất
`draft` $\rightarrow$ `submitted` $\rightarrow$ `approved` / `rejected` $\rightarrow$ `applied`.

## 2. Kiểm Soát Xung Đột (Optimistic Concurrency)
- Đề xuất lưu trữ `baseVersion` của thực thể tại thời điểm tạo.
- Khi người duyệt phê duyệt, hệ thống kiểm tra nếu phiên bản thực thể hiện tại lớn hơn `baseVersion` thì cảnh báo xung đột (Stale Proposal) và yêu cầu cập nhật lại.

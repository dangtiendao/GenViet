# Hồ Sơ P15 - 01: Sẵn Sàng Đầu Vào (Input Readiness)

## 1. Tiêu Chí Đầu Vào
- Phase P14 (API vùng cây) đã hoàn thành, kiểm thử và được merge vào nhánh master.
- RPC `public.get_tree_graph_slice` và Route Handler `GET /api/trees/[treeId]/graph` hoạt động ổn định.
- Thư viện `@xyflow/react` v12 và `elkjs` v0.12 đã có sẵn trong dự án.

## 2. Ràng Buộc Kỹ Thuật
- Không lưu tọa độ hiển thị vào database PostgreSQL.
- Không kéo tạo quan hệ trực tiếp trong canvas v0.1.
- Không mutate dữ liệu DTO từ API P14.
- Tuân thủ quy tắc an toàn Git DEC-007 (Không push remote / merge / PR).

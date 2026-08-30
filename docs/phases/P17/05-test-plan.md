# Phase P17: Kế Hoạch & Báo Cáo Kiểm Thử (Test Plan & Report)

## 1. Các Tầng Kiểm Thử

### 1.1. CSDL & Storage RLS (pgTAP)
- `07000_avatar_bucket.test.sql`: Cấu hình bucket private, 10MB limit.
- `07100_avatar_storage_policies.test.sql`: Hàm trích xuất an toàn path segments.
- `07200_avatar_metadata.test.sql`: Bảng metadata và cập nhật `persons.avatar_path`.
- `07300_avatar_cross_tree.test.sql`: Cách ly dữ liệu chéo cây gia phả.

### 1.2. Unit & Component Tests (Vitest)
- `tests/unit/media/object-path.test.ts`: 8 tests.
- `tests/unit/media/mime-validation.test.ts`: 7 tests.
- `tests/unit/media/image-processing.test.ts`: 3 tests.
- `tests/unit/media/signed-url-cache.test.ts`: 3 tests.
- `tests/unit/media/components.test.tsx`: 4 tests.

### 1.3. End-to-End Tests (Playwright)
- `tests/e2e/avatar.spec.ts`: Kiểm tra điều hướng xác thực, bảo vệ trang edit/detail và giao diện mobile.

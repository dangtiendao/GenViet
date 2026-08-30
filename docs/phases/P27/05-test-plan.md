# Kế Hoạch Kiểm Thử Toàn Diện Phase P27 (Test Plan)

## 1. Phạm Vi Kiểm Thử
1. **Unit Tests (15 Test Suites mới):**
   - Phân quyền & Vai trò (`roles.test.ts`).
   - Token thư mời bảo mật (`invitations.test.ts`).
   - Đề xuất chỉnh sửa & Diff (`proposals.test.ts`).
   - Liên kết tài khoản & Nhân vật (`account-linking.test.ts`).
   - Sự kiện & Ngày giỗ (`events.test.ts`).
   - Âm lịch Việt Nam (`lunar-calendar.test.ts`).
   - Album & Tài liệu scan (`albums-and-documents.test.ts`).
   - Lớp trừu tượng Storage (`storage-provider.test.ts`).
   - Nhập bảng tính Excel (`excel-import.test.ts`).
   - Chuẩn GEDCOM Spike (`gedcom.test.ts`).
   - Xuất PDF & In cây lớn (`pdf-and-large-print.test.ts`).
   - Tìm đường quan hệ (`relationship-path.test.ts`).
   - Gợi ý xưng hô tiếng Việt (`address-terms.test.ts`).
   - Phát hiện hồ sơ trùng (`duplicate-detection.test.ts`).
   - Gộp hồ sơ kiểm toán (`profile-merge.test.ts`).
2. **Quality Gates & Regression Tests:**
   - 99 Vitest Test Suites hiện hành + 15 Test Suites mới (Tổng cộng 114 Test Suites).
   - 75 Playwright E2E Tests.
   - Quét bảo mật không phơi lộ secret (`scan-client-secrets.mjs`).

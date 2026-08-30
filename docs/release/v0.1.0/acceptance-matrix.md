# Ma Trận Nghiệm Thu Phát Hành MVP v0.1.0 (Release Acceptance Matrix)

## 1. Bảng Tổng Hợp Tiêu Chí Nghiệm Thu Toàn Phân Hệ

| Phân Hệ / Tiêu Chí | Nhiệm Vụ | Nguồn Phase | Phương Thức Kiểm Thử | Môi Trường | Kết Quả | Phân Loại Lỗi | Trạng Thái Chặn Release |
| :--- | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **Phạm vi & Định danh RC** | P26-T01, T02 | P01, P26 | Tự động & Thủ công | Local Git | **PASS** | Không | Không |
| **Kiểm thử chất lượng toàn diện** | P26-T03 | P22, P25 | Vitest & Playwright | Test / Preview | **PASS** | Không | Không |
| **Clean DB Migration** | P26-T04 | P06, P07 | Supabase CLI & Schema Tests | Clean DB | **PASS** | Không | Không |
| **Kiểm tra Sao lưu Dữ liệu** | P26-T05 | P19, P25 | JSON Round-trip & Backup Script | Local / Isolated | **PASS** | Không | Không |
| **Kiểm tra Phục hồi Cô lập** | P26-T06 | P25 | Isolated Restore Script & Checksum | Isolated Schema | **PASS** | Không | Không |
| **Nghiệm thu Desktop UI/UX** | P26-T07 | P10, P15 | Playwright Desktop (Chromium/WebKit) | Headless / 1280px | **PASS** | Không | Không |
| **Nghiệm thu Mobile & 320px** | P26-T08 | P20, P22 | Mobile Viewport Matrix (320px - 412px) | Emulated Mobile | **PASS** | Không | Không |
| **Kiểm tra Trợ năng (A11y)** | P26-T09 | P03, P10 | Keyboard Navigation & Focus Visible | Browser Matrix | **PASS** | Không | Không |
| **Quyền riêng tư & Cách ly Tenant** | P26-T10 | P08, P25 | Security Unit Tests & RLS Matrix | Test Database | **PASS** | Không | Không |
| **Lưu trữ Ảnh đại diện Private** | P26-T11 | P17 | Storage Security Tests & Signed URLs | Test Storage | **PASS** | Không | Không |
| **Cây gia phả phức tạp đa thế hệ** | P26-T12 | P15, P23 | Benchmark 100/500/1000 & Worker | Browser / Worker | **PASS** | Không | Không |
| **Mở rộng tổ tiên từ node bất kỳ** | P26-T13 | P14, P15 | Graph API & Expand Ancestors Tests | Browser / Node | **PASS** | Không | Không |
| **Sổ đăng ký Lỗi P0 / P1** | P26-T14, T15 | P26 | Defect Triage & Verification | Toàn hệ thống | **PASS (0 P0/P1)** | Không | Không |
| **Tài liệu Phát hành & Hướng dẫn** | P26-T16-T20 | P26 | Rà soát tài liệu & Liên kết | Docs / Markdown | **PASS** | Không | Không |

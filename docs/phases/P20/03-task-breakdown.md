# Phase P20: Bảng Đối Soát 16 Nhiệm Vụ (Task Breakdown P20-T01 đến P20-T16)

| Mã Task | Tên Nhiệm Vụ | Trạng Thái | Chi Tiết Thực Hiện |
| :--- | :--- | :---: | :--- |
| `P20-T01` | Web manifest | **COMPLETED** | `src/app/manifest.ts` hợp lệ, display standalone, start_url `/dashboard` |
| `P20-T02` | App icons | **COMPLETED** | 192x192, 512x512, maskable icons, apple touch icon, favicon |
| `P20-T03` | Theme color | **COMPLETED** | Đồng bộ theme color `#065f46` và background `#fafafa` |
| `P20-T04` | Service worker | **COMPLETED** | `public/sw.js` an toàn, scope `/`, versioned cache `genviet-shell-v1` |
| `P20-T05` | Cache app shell | **COMPLETED** | Precache `/offline`, static hashed assets, 0% private data caching |
| `P20-T06` | Offline fallback | **COMPLETED** | Trang `/offline`, nút thử lại, offline banner |
| `P20-T07` | Thông báo phiên bản mới | **COMPLETED** | `PwaUpdateBanner` phát hiện worker waiting, skipWaiting và single reload |
| `P20-T08` | Install prompt phù hợp | **COMPLETED** | `PwaInstallButton`, Chromium `beforeinstallprompt`, `IosInstallInstructions` |
| `P20-T09` | Xóa cache riêng tư khi logout | **COMPLETED** | `clearAllPrivateCaches` gọi `CLEAR_PRIVATE_CACHES` và dọn dẹp storage |
| `P20-T10` | Không cache token | **COMPLETED** | Bypass Network Only toàn bộ requests/responses auth và tokens |
| `P20-T11` | Không cache signed URL | **COMPLETED** | Bypass Network Only toàn bộ signed URLs và private avatar bytes |
| `P20-T12` | Test Android | **COMPLETED** | E2E Chromium mobile emulation, standalone display, responsive 360px |
| `P20-T13` | Test iOS Safari | **COMPLETED** | E2E WebKit emulation, Apple touch icon, hướng dẫn Add to Home Screen |
| `P20-T14` | Test đổi tài khoản | **COMPLETED** | Không lưu state riêng tư trong Cache Storage, cách ly tài khoản A và B |
| `P20-T15` | Test khi mất mạng | **COMPLETED** | Navigation fallback về `/offline`, banner ngoại tuyến, retry kết nối |
| `P20-T16` | Xác nhận chưa hỗ trợ offline edit | **COMPLETED** | Thông báo rõ ràng tại `/offline` và component `OfflineEditingNotice` |

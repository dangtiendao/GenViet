# Phase P20: Quyết Định Kiến Trúc Đã Chốt (Architectural Decisions)

## 1. Danh Sách Quyết Định Đã Khóa
1. **DEC-P20-01: PWA không đồng nghĩa Offline-First**
   - Chỉ cung cấp cài đặt ứng dụng và App Shell ngoại tuyến. Không hỗ trợ chỉnh sửa offline, không tạo Background Sync, không tạo hàng đợi mutation.
2. **DEC-P20-02: Ranh giới Cache Storage: 0% Dữ liệu Riêng tư**
   - Tuyệt đối không cache token, session, auth callback, graph API, search results, signed URLs hay backup payload trong Cache Storage.
3. **DEC-P20-03: Versioned Cache Naming & Tự Động Dọn Dẹp**
   - Sử dụng tên cache `genviet-shell-v1` và dọn dẹp các version cũ khi activate.
4. **DEC-P20-04: Trải Nghiệm Cài Đặt Đa Nền Tảng Phù Hợp**
   - Feature-detect `beforeinstallprompt` trên Chromium/Android và cung cấp hướng dẫn Add to Home Screen trên iOS Safari.
5. **DEC-P20-05: Dọn Dẹp Cache Riêng Tư Khi Đăng Xuất**
   - Tích hợp `clearAllPrivateCaches()` trong luồng đăng xuất để đảm bảo cách ly tài khoản tuyệt đối.

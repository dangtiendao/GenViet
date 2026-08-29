# ADR-0013: Chiến lược Bộ nhớ Đệm (Caching) Cách ly Dữ liệu Riêng tư

- **Mã Quyết định:** `ADR-0013`
- **Trạng thái:** `PROPOSED`
- **Ngày ban hành:** 2026-08-29
- **Người đề xuất:** Principal Software Architect (P04)
- **Người phê duyệt:** Project Owner / Maintainer

---

## 1. Bối cảnh & Quyết định (Context & Decision)
- **Quyết định:** Áp dụng chính sách **Cách ly Bộ nhớ Đệm Tuyệt đối (Strict Cache Isolation)** cho dữ liệu gia phả cá nhân:
  1. Cấm cache công khai trên Public CDN đối với toàn bộ các trang và API có chứa dữ liệu phả hệ (`Cache-Control: private, no-store`).
  2. Cache ở cấp độ Server Data Cache bắt buộc phải gắn khóa chứa `auth.uid()` và `tree_id`.
  3. Áp dụng cơ chế hủy cache mục tiêu (`revalidateTag('tree_${treeId}')`) sau mỗi thao tác mutation.

## 2. Hệ quả
- **Tích cực:** Loại bỏ 100% rủi ro rò rỉ thông tin gia phả cá nhân giữa các người dùng qua bộ nhớ đệm chia sẻ; đảm bảo giao diện luôn hiển thị dữ liệu mới nhất sau khi sửa đổi.
- **Tiêu cực:** Không thể tận dụng CDN Edge Cache toàn cầu cho các trang phả hệ cá nhân (đây là đánh đổi bắt buộc vì lý do an toàn quyền riêng tư).

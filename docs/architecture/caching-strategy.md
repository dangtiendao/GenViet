# Chiến lược Quản lý Bộ nhớ Đệm (Caching Strategy)

- **Mã tài liệu:** `ARCH-CACHE-01`
- **Mã Kiến trúc liên quan:** `AR-011`, `CACHE-001..005`, `ADR-0013`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Ma trận Chiến lược Caching theo 5 Cấp độ (Cache Matrix)

| Cấp độ Cache | Vị trí Lưu trữ | Loại Dữ liệu Áp dụng | Cấu trúc Khóa Cache (Key) | Thời gian Tồn tại (TTL) | Cơ chế Hủy Cache (Invalidation) |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **1. Static Assets** | Trình duyệt / Cloudflare CDN | JS bundle, CSS, Logo, Web Fonts | URL Hash / Fingerprint | 1 năm (`immutable`) | Triển khai phiên bản build mới |
| **2. Public HTML** | Cloudflare Edge / Vercel Edge | Trang giới thiệu, Trang Đăng nhập `/login` | URL Path | 1 giờ | Revalidate on deploy |
| **3. Private Data Cache** | Server Data Cache | Danh sách Cây, Lát cắt Đồ thị quanh Center | `user_{uid}:tree_{tid}:center_{cid}` | 5 - 15 phút (hoặc On-Demand) | `revalidatePath('/tree/:id')`, `revalidateTag()` |
| **4. Signed Image URLs**| Trình duyệt Máy khách | Ảnh Avatar thành viên | Signed URL Query String | $\le 15$ phút | Hết hạn TTL / Cập nhật ảnh mới |
| **5. Layout Cache** | Bộ nhớ RAM Client (ELK) | Tọa độ `(x, y)` của các node đã tính | `tree_{tid}:version_{v}:center_{cid}` | Phiên làm việc (Session) | Khi thêm/sửa/xóa node trong cây |

---

## 2. Các Quy tắc Bảo mật & Cách ly Bộ nhớ Đệm (Cache Isolation Rules)

1. **`CACHE-001` (Cấm Cache Công khai Dữ liệu Cá nhân):** Mọi response HTML hoặc JSON chứa thông tin gia phả cá nhân bắt buộc phải có HTTP Header `Cache-Control: private, no-cache, no-store, must-revalidate`.
2. **`CACHE-002` (Khóa Cache Gắn chặt với Định danh):** Bất kỳ cache dữ liệu server-side nào đều phải chứa `auth.uid()` trong cache key để ngăn chặn rò rỉ dữ liệu chéo giữa các người dùng.
3. **`CACHE-003` (Hủy Cache Theo Ngữ cảnh Hẹp - Targeted Invalidation):** Khi người dùng chỉnh sửa thông tin 1 Person, hệ thống chỉ hủy cache của Person đó và lát cắt cây liên quan (`revalidateTag('tree_${treeId}')`), không hủy toàn bộ cache của ứng dụng.
4. **`CACHE-004` (Không Dùng Cache làm Nguồn Dữ liệu):** Cache chỉ là lớp tăng tốc độ đọc. Khi có bất kỳ nghi ngờ nào về tính nhất quán, hệ thống luôn fallback truy vấn trực tiếp vào PostgreSQL.

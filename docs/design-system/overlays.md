# Lớp phủ & Hộp thoại Tương tác (Overlays & Modals) - Phase P10

- **Mã tài liệu:** `DS-OVERLAY-01`
- **Phiên bản:** `v0.1-baseline`

---

## 1. Phân loại Lớp phủ

1. **Modal Dialog (`Dialog`):** Sử dụng cho các hộp thoại xác nhận, thông báo quan trọng trên Desktop/Tablet.
   - Luôn có Focus Trap và phím `Escape` để đóng.
   - Nền ngoài (`backdrop`) được làm mờ nhẹ và `aria-modal="true"`.
2. **Side Drawer (`Drawer`):** Sử dụng cho các bảng thông tin mở rộng hoặc bộ lọc nâng cao trượt từ cạnh phải/trái.
3. **Mobile Bottom Sheet (`BottomSheet`):** Sử dụng cho các thao tác nhanh trên điện thoại di động trượt từ cạnh dưới lên, có nút đóng rõ ràng và hỗ trợ vùng đệm an toàn (`safe-area-bottom`).

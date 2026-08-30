# 08 - Trải Nghiệm Giao Diện Người Dùng (Search UI & UX)

## 1. Thành Phần Giao Diện

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 [ Ô nhập họ tên có dấu hoặc không dấu...              ]  │
├─────────────────────────────────────────────────────────────┤
│ ⚙️ Bộ lọc: [Trạng thái: Tất cả ▼] [Năm sinh: ___] [Hồ sơ thiếu: Không ▼] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ĐẶNG TIẾN ĐẠO  ✓ (Nam | Sinh: 1980 | Còn sống)          │ │
│ │ 📍 Quê quán: Hải Phòng                                  │ │
│ │ 👥 Cha: Đặng Văn Bố - Mẹ: Trần Thị Mẹ                   │ │
│ │ [ Xem hồ sơ (P12) ]               [ Xem trên cây (P15) ]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                [ Xem thêm kết quả (Cursor) ]                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Các Quy Tắc Tương Tác Cốt Lõi
1. **Debounce Thông Minh (300ms):** Tự động kích hoạt tìm kiếm sau 300ms dừng gõ.
2. **IME Composition Safe:** Không gửi request giữa chừng khi người dùng đang gõ tổ hợp tiếng Việt qua Unikey / EVKey / Windows IME (`compositionstart` / `compositionend`).
3. **Phím Tắt:** Nhấn `Enter` để tìm kiếm ngay lập tức; bấm nút `X` để xóa trắng từ khóa.
4. **Highlight An Toàn (100% Zero dangerouslySetInnerHTML):** Tách từ khóa và hiển thị bằng thẻ `<mark>` chuẩn HTML5.
5. **Điều Hướng Tích Hợp:**
   - Nút **"Xem hồ sơ"** điều hướng đến trang chi tiết nhân vật (`/trees/[treeId]/people/[personId]`).
   - Nút **"Xem trên cây"** điều hướng đến sơ đồ cây tương tác P15 (`/trees/[treeId]/tree?centerPersonId=[personId]`).

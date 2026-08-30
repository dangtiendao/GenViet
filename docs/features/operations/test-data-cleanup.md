# Hướng Dẫn Dọn Dẹp Dữ Liệu Kiểm Thử (Test Data Cleanup)

## 1. Công Cụ Dọn Dẹp (`scripts/cleanup/cleanup-test-data.mjs`)

### 1.1. Chế Độ Quét Thử (Dry-Run - Mặc định)
Lệnh quét không xóa dữ liệu:
```bash
node scripts/cleanup/cleanup-test-data.mjs
```

### 1.2. Chế Độ Thực Thi Xóa Thật (Execute Mode)
Chỉ thực thi khi có cờ `--execute`:
```bash
node scripts/cleanup/cleanup-test-data.mjs --execute
```

## 2. Các Lớp Bảo Vệ (Safety Guards)
1. **Chặn Môi Trường Production:** Tự động hủy nếu `NODE_ENV === 'production'` hoặc phát hiện domain production.
2. **Lọc Theo Tiền Tố Kiểm Thử:** Chỉ xóa các cây có tiền tố `[TEST]`, `[FIXTURE]`, `[E2E]`, `[SEED]`, `Test Tree`.
3. **Thứ Tự Xóa An Toàn Khóa Ngoại (FK-Safe):** `union_members` -> `unions` -> `relationships` -> `persons` -> `memberships` -> `family_trees`.
4. **Bảo Vệ Bảng `system_heartbeats`:** Tuyệt đối không chạm vào bảng nhịp tim hoặc dữ liệu người dùng thật.

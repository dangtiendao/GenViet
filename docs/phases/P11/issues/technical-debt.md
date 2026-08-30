# Danh sách Nợ Kỹ thuật (Technical Debt) - Phase P11

- **Mã Phase:** `P11`
- **Tình trạng:** `0 NỢ KỸ THUẬT NGHIÊM TRỌNG`

---

## Ghi nhận Nợ Kỹ thuật & Kế hoạch Nâng cấp
1. **Phân trang Danh sách Cây Gia phả:** Trong phiên bản v0.1, danh sách cây gia phả của một tài khoản được tải trực tiếp (giới hạn thực tế < 100 cây/user). Khi hệ thống mở rộng, sẽ bổ sung cursor-based pagination cho `listAccessibleTrees`.

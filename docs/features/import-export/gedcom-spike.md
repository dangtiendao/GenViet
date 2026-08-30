# Thử Nghiệm Tương Thích GEDCOM (GEDCOM Compatibility Spike - P27-T12)

## 1. Mục Tiêu & Phạm Vi Thử Nghiệm
- Đánh giá khả năng đọc/ghi chuẩn GEDCOM 5.5.1 / 7.0 cho các thẻ cốt lõi (`INDI`, `NAME`, `SEX`, `BIRT`, `DEAT`, `FAM`, `HUSB`, `WIFE`, `CHIL`).
- Đặt sau Feature Flag `NEXT_PUBLIC_ENABLE_GEDCOM` (Prototype status).
- Cảnh báo người dùng về nguy cơ mất mát các trường dữ liệu đặc thù Việt Nam (như tên tự, tên hiệu, ngày âm lịch, ngày giỗ).

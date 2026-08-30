# Đặc Tả Cấu Trúc Tệp Sao Lưu (Backup Format Specification)

## 1. Cấu Trúc Gốc (Root Document Schema)
Tệp sao lưu GenViet v1 chứa các phần bắt buộc sau:
- `schemaVersion`: Số nguyên `1`.
- `exportedAt`: Chuỗi thời gian chuẩn ISO 8601 UTC.
- `generator`: Thông tin ứng dụng tạo file (`{ "name": "GenViet", "version": "0.1.0" }`).
- `tree`: Thông tin cây gia phả (`name`, `description`, `privacyLevel`, `generationAnchorPersonId`, `defaultPersonId`).
- `persons`: Mảng danh sách nhân vật (tối đa 5.000).
- `parentChildRelationships`: Mảng danh sách quan hệ cha/mẹ - con (tối đa 10.000).
- `unions`: Mảng danh sách quan hệ hôn nhân (tối đa 5.000).
- `unionMembers`: Mảng danh sách thành viên hôn nhân (tối đa 10.000).
- `mediaMetadata`: Mảng siêu dữ liệu ảnh đại diện (`binaryIncluded: false`, `availability: "metadata_only"`).
- `manifest`: Tổng kết số lượng các bản ghi phục vụ đối soát toàn vẹn.

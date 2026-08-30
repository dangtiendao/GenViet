# Quy Trình Gắn Thẻ Phát Hành (Release Tagging - P24-T14)

## 1. Điều Kiện Tiên Quyết Để Tạo Release Tag
1. Đã vượt qua 100% Quality Gates của P22 (Format, Lint, Typecheck, Unit, E2E).
2. Đã vượt qua Performance Budget của P23.
3. Không còn bất kỳ lỗi `CRITICAL` hoặc `BLOCKER` nào.
4. Phiên bản phát hành được phê duyệt bởi chủ dự án: `v0.1.0`.

## 2. Cú Pháp Tạo Annotated Tag Cục Bộ
```bash
git tag -a v0.1.0 -m "release(v0.1.0): GenViet initial release baseline"
```

*Lưu ý an toàn: Không thực hiện `git push --tags` khi chưa có phê duyệt từ cấp quản trị.*

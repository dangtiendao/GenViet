# Supabase Automation & Quality Scripts

Thư mục này chứa các scripts Node.js hỗ trợ kiểm tra, kiểm toán migration và bảo vệ quy trình vận hành CSDL:

- `check-migrations.mjs`: Kiểm tra định dạng tên migration `YYYYMMDDHHMMSS_*.sql`, tính duy nhất của timestamp, SQL không rỗng và không chứa secret / schema vi phạm ranh giới phase.
- `verify-generated-types.mjs`: Kiểm tra tính toàn vẹn và hợp lệ của generated TypeScript Database types.
- `backup-before-migrate.mjs`: Quy trình tạo bản sao lưu cục bộ có kiểm soát trước khi áp dụng migration.

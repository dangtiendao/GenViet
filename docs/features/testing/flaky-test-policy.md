# Chính Sách Xử Lý Flaky Test (Flaky-Test Policy)

## 1. Định Nghĩa & Quy Tắc Quản Trị
- **Flaky Test:** Là kiểm thử có kết quả không ổn định (lúc pass lúc fail) trên cùng một mã nguồn và cấu hình.
- **Quy tắc:**
  1. Không sử dụng `test.skip` hoặc `.only` âm thầm.
  2. Thay thế toàn bộ hard sleep (`setTimeout`) bằng waiting theo điều kiện trạng thái (state wait).
  3. Sử dụng fixtures cô lập độc lập giữa các parallel workers.
  4. Số lần retry được giới hạn chặt chẽ (CI: 2 lần, Local: 0 lần để phát hiện lỗi ngay).

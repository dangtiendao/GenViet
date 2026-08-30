# Liên Kết Yêu Cầu Xuyên Suốt (Request Correlation - P25-T05)

## 1. Cơ Chế Lan Truyền Request ID
1. Header `x-request-id` được nhận diện và kiểm tra tính hợp lệ bằng regex `^[a-zA-Z0-9_-]{8,64}$`.
2. Nếu không có hoặc không hợp lệ, hệ thống tự động sinh UUID an toàn qua `crypto.randomUUID()`.
3. Request ID được gắn vào header phản hồi HTTP và xuất hiện trong mọi bản ghi log và event lỗi liên quan.

# Liên Kết Tài Khoản Với Nhân Vật (Account-Person Linkage - P27-T04)

## 1. Tách Biệt Định Danh
- Tài khoản người dùng (`auth.users`) và Nhân vật trong phả hệ (`public.persons`) là hai thực thể hoàn toàn độc lập.
- Việc liên kết chỉ mang ý nghĩa nhận diện "Tôi là nhân vật này trong cây gia phả" và không tự động cấp quyền Owner cho tài khoản.

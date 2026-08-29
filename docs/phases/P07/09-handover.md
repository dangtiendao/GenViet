# Tài liệu Bàn giao Kỹ thuật: Phase P07 sang Phase P08 (Handover - Cổng G7)

- **Phase Bàn giao:** `P07: Thiết kế Cơ sở Dữ liệu Lõi` - Trạng thái: `IMPLEMENTATION_COMPLETE`
- **Phase Tiếp nhận:** `P08: Phân quyền Row Level Security (RLS)`
- **Ngày bàn giao:** 2026-08-29
- **Người bàn giao:** Principal Database Architect & Data Integrity Lead (P07)

---

## 1. Hiện trạng Kỹ thuật Bàn giao cho Phase P08

1. **Danh sách 7 Bảng CSDL Lõi Cần Viết RLS Policies:**
   - `public.profiles`: Policy phân quyền user sở hữu (`id = auth.uid()`).
   - `public.family_trees`: Policy theo vai trò thành viên trong `tree_memberships`.
   - `public.tree_memberships`: Policy quản lý thành viên cây gia phả.
   - `public.persons`: Policy đọc/ghi nhân vật thuộc cây người dùng có quyền.
   - `public.parent_child_relationships`: Policy đọc/ghi quan hệ trực hệ.
   - `public.unions`: Policy đọc/ghi quan hệ hôn nhân.
   - `public.union_members`: Policy đọc/ghi thành viên hôn nhân.

2. **Trạng thái RLS Hiện tại:**
   - Toàn bộ 7 bảng trên đã được chạy `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
   - Hiện tại đang ở trạng thái **`deny-by-default`** (chưa có bất kỳ policy nào được tạo).

3. **Cơ chế Phân quyền & Đường dẫn Sở hữu (Ownership & Membership Paths):**
   - Người dùng đăng nhập được xác thực qua `auth.uid()`.
   - Quyền truy cập vào một Family Tree và các thực thể con bên trong (`persons`, `relationships`, `unions`) được xác định qua bảng `public.tree_memberships` với các vai trò `owner`, `admin`, `editor`, `viewer`.

---

## 2. Các Lệnh Kỹ thuật Phase P08 Nên Chạy Đầu Tiên

```bash
# 1. Kiểm tra trạng thái migration và types hiện tại
npm run supabase:check

# 2. Tạo file migration mới cho RLS Policies
npm run supabase:migrations:new p08_enable_core_rls_policies

# 3. Chạy test runner sau khi viết policies
npm run check
```

---

## 3. Những Việc Phase P08 Không Được Giả Định

- ❌ KHÔNG giả định `anon` hoặc `authenticated` đã có sẵn quyền SELECT/INSERT (hiện đang deny 100%).
- ❌ KHÔNG tạo các policy mở rộng bypass kiểm tra membership.
- ❌ KHÔNG sửa schema bảng P07 ngoài file migration.

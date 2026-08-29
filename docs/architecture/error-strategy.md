# Chiến lược Phân loại & Xử lý Lỗi Hệ thống (Error Handling Strategy)

- **Mã tài liệu:** `ARCH-ERROR-01`
- **Mã Kiến trúc liên quan:** `ERRCAT-001..008`
- **Phiên bản:** `v0.1-baseline`
- **Trạng thái:** `PROVISIONAL`
- **Ngày ban hành:** 2026-08-29

---

## 1. Cấu trúc Đối tượng Lỗi Chuẩn Ứng dụng (Application Error Contract)

Mọi phản hồi lỗi từ Server Actions hoặc Route Handlers đều tuân thủ cấu trúc chuẩn, tách biệt giữa **Thông tin an toàn cho Người dùng** và **Thông tin chẩn đoán Server**:

> [!NOTE]
> Khai báo dưới đây là ví dụ hợp đồng kiến trúc (**`NON-PRODUCTION ARCHITECTURE EXAMPLE`**), không phải mã nguồn production.

```typescript
// NON-PRODUCTION ARCHITECTURE EXAMPLE

export interface ApplicationErrorResponse {
  success: false;
  code: string;                 // Mã lỗi ổn định, ví dụ: 'ERR_DAG_CYCLE_DETECTED'
  message: string;              // Thông điệp tiếng Việt thân thiện theo P03
  category: ErrorCategory;      // 'VALIDATION' | 'AUTH' | 'DOMAIN' | 'EXTERNAL' | 'INTERNAL'
  retryable: boolean;           // Client có thể thử lại ngay không?
  fieldErrors?: Record<string, string>; // Báo lỗi từng ô nhập trong form
  correlationId: string;        // ID truy vết log server (UUID)
}
```

---

## 2. Ma trận Ánh xạ Phân loại Lỗi (Error Mapping Matrix)

| Phân loại Lỗi | Mã Lỗi Chuẩn | Nguồn Phát sinh | Ánh xạ HTTP Status | Hành vi UI (P03) | Cho phép Retry? | Ghi Log Server |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **Lỗi Dữ liệu Form** | `ERR_VALIDATION_FAILED` | Zod Schema Validator | `400 Bad Request` | Báo lỗi đỏ inline dưới ô nhập | ❌ Sửa trước | Level `WARN` |
| **Lỗi Xác thực** | `ERR_UNAUTHENTICATED` | Supabase SSR / Cookie | `401 Unauthorized` | Chuyển hướng về `/login` | ❌ Đăng nhập lại | Level `INFO` |
| **Lỗi Phân quyền** | `ERR_FORBIDDEN_TREE` | RLS Engine / Service | `403 Forbidden` | Màn hình từ chối `SCR-024` | ❌ Không | Level `WARN` (Security Audit) |
| **Không Tìm thấy** | `ERR_NOT_FOUND` | Database Query | `404 Not Found` | Màn hình 404 `SCR-023` | ❌ Không | Level `INFO` |
| **Chu trình Vòng lặp**| `ERR_DAG_CYCLE` | DAG Invariant Validator | `422 Unprocessable` | Hộp thoại chặn lỗi `ERR-002` | ❌ Chọn người khác | Level `WARN` |
| **Cảnh báo Cần Xác nhận**| `WARN_REQUIRES_CONFIRM`| Domain Service Check | `200 / 409 Conflict` | Hộp thoại cảnh báo vàng `WARN-001`| ✅ Người dùng bấm OK | Level `INFO` |
| **Lỗi Storage / S3** | `ERR_STORAGE_FAILURE` | Storage Adapter | `502 Bad Gateway` | Toast lỗi mạng, có nút "Thử lại" | ✅ Có thể thử lại | Level `ERROR` |
| **Lỗi Bất ngờ Hệ thống**| `ERR_INTERNAL_SERVER` | Unhandled Exception | `500 Internal Error` | Global Error Boundary | ✅ Thử lại sau | Level `FATAL` + Stack Trace |

---

## 3. Các Nguyên tắc An toàn khi Xử lý Lỗi

1. **Cấm Lộ Stack Trace & Raw SQL ra Trình duyệt:** Mọi lỗi CSDL (ví dụ: `duplicate key value violates unique constraint "persons_pkey"`) đều phải được bắt và ánh xạ thành mã lỗi ứng dụng thân thiện (`ERR_PERSON_ALREADY_EXISTS`).
2. **Gắn Mã Truy vết `correlationId`:** Mỗi request đều được gán 1 UUID ngẫu nhiên. Khi có lỗi server, client chỉ nhận được `correlationId` để cung cấp cho đội hỗ trợ kỹ thuật tra cứu log nội bộ.
3. **Phân biệt Lỗi Hệ thống vs Cảnh báo Nghiệp vụ:** Cảnh báo quan hệ (ví dụ: khoảng cách tuổi bất thường `WARN-002`) không phải là exception hay lỗi 500, mà được đóng gói trong phản hồi nghiệp vụ để UI hiển thị hộp thoại xác nhận.

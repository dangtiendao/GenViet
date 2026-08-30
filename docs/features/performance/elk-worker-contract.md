# Hợp Đồng Web Worker ELK (ELK Worker Contract - P23-T14 & P23-T15)

## 1. Giao Thức Thông Điệp (Message Protocol)
- **Request:** `{ requestId: string, graph: LayoutGraph, options?: Record<string, string> }`
- **Response Success:** `{ requestId: string, success: true, result: PositionedLayoutGraph, durationMs: number }`
- **Response Error:** `{ requestId: string, success: false, errorCode: string, errorMessage: string }`

## 2. Cơ Chế Chống Layout Cũ (Stale Layout Cancellation)
- Client theo dõi `activeRequestId`. Mọi phản hồi có `requestId !== activeRequestId` sẽ bị loại bỏ ngay lập tức nhằm tránh tình trạng nhấp nháy hoặc áp đặt tọa độ cũ khi người dùng chuyển Center Person nhanh.

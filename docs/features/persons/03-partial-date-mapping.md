# Partial Date Mapping & Invariant INV-002

## 1. Nguyên Tắc Bất Biến INV-002
Trong nghiên cứu gia phả truyền thống Việt Nam, phần lớn tư liệu cổ (văn bia, phả ký, gia phả Hán Nôm) chỉ ghi nhận năm sinh hoặc năm mất (ví dụ: *Cụ sinh năm Canh Tý 1840, mất năm Ất Mùi 1895*).

> [!IMPORTANT]
> **Quy tắc INV-002:** Tuyệt đối cấm tạo ngày giả `01/01` hoặc ngày đầu tháng khi người dùng chỉ nhập năm.
> Hệ thống phân tách rõ rệt cột `date` và cột `year`:
> - Khi biết đầy đủ: Lưu `date = 'YYYY-MM-DD'`, `year = NULL`, `precision = 'exact'`.
> - Khi chỉ biết năm: Lưu `date = NULL`, `year = YYYY`, `precision = 'year'`.
> - Khi chưa rõ: Lưu `date = NULL`, `year = NULL`, `precision = 'unknown'`.

## 2. Bảng Chuyển Đổi Dữ Liệu

| UI Input Form (`PartialDateValue`) | Cột `birth_date` | Cột `birth_year` | Cột `birth_date_precision` | Cột `birth_is_estimated` |
| :--- | :--- | :--- | :--- | :--- |
| `{ precision: 'exact', year: 1990, month: 5, day: 20, isEstimated: false }` | `'1990-05-20'` | `NULL` | `'exact'` | `false` |
| `{ precision: 'year', year: 1850, month: null, day: null, isEstimated: true }` | `NULL` | `1850` | `'year'` | `true` |
| `{ precision: 'unknown', year: null, month: null, day: null, isEstimated: false }`| `NULL` | `NULL` | `'unknown'` | `false` |

## 3. Định Dạng Hiển Thị (`formatGenealogyDate`)
- `exact`: `20/5/1990` hoặc `20/5/1990 (ước tính)`
- `year`: `Năm 1850` hoặc `Năm 1850 (ước tính)`
- `unknown`: `Chưa rõ`

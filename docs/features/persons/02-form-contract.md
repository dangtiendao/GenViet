# Form Contract: Person Validation & Constraints

## 1. Trường Nhập liệu & Ràng buộc Zod

| Tên Trường Form | Bắt Buộc | Ràng Buộc Kỹ Thuật | Thông Báo Lỗi Tiếng Việt |
| :--- | :--- | :--- | :--- |
| `fullName` | Có | 1 - 100 ký tự, Unicode có dấu, cấm ký tự điều khiển/xuống dòng | Họ và tên nhân vật không được để trống |
| `gender` | Không | Enum: `male`, `female`, `other`, `unknown` | Giới tính không hợp lệ |
| `livingStatus` | Không | Enum: `living`, `deceased`, `unknown` | Trạng thái sống không hợp lệ |
| `birthPrecision` | Không | Enum: `exact`, `year`, `unknown` | Mức độ chính xác ngày sinh không hợp lệ |
| `birthDate` | Tùy chọn | Regex `^\d{4}-\d{2}-\d{2}$` khi `precision = 'exact'` | Ngày sinh phải theo định dạng YYYY-MM-DD |
| `birthYear` | Tùy chọn | Số nguyên `100 <= year <= 2500` khi `precision = 'year'` | Năm sinh không hợp lệ |
| `birthIsEstimated` | Không | Boolean (mặc định `false`) | - |
| `deathPrecision` | Không | Enum: `exact`, `year`, `unknown` | Mức độ chính xác ngày mất không hợp lệ |
| `deathDate` | Tùy chọn | Regex `^\d{4}-\d{2}-\d{2}$` khi `precision = 'exact'` | Ngày mất phải theo định dạng YYYY-MM-DD |
| `deathYear` | Tùy chọn | Số nguyên `100 <= year <= 2500` khi `precision = 'year'` | Năm mất không hợp lệ |
| `deathIsEstimated` | Không | Boolean (mặc định `false`) | - |
| `hometownText` | Không | Tối đa 255 ký tự | Quê quán không được vượt quá 255 ký tự |
| `biography` | Không | Tối đa 5000 ký tự (Plain text an toàn) | Tiểu sử không được vượt quá 5000 ký tự |
| `verificationStatus`| Không | Enum: `unverified`, `verified`, `disputed` | Trạng thái xác minh không hợp lệ |

## 2. Cross-Field Date Validation Rules
1. **Rule 1 (Living vs Death Date):** Nếu `livingStatus === 'living'` và `deathPrecision === 'exact'` và có `deathDate` $\rightarrow$ Báo lỗi.
2. **Rule 2 (Exact Death >= Exact Birth):** Nếu cả ngày sinh và ngày mất đều có độ chính xác `exact` $\rightarrow$ Bắt buộc `deathDate >= birthDate` (`AC-P12-075`).
3. **Rule 3 (Year Death >= Year Birth):** Nếu cả năm sinh và năm mất đều ở dạng `year` và không có cờ ước tính $\rightarrow$ Bắt buộc `deathYear >= birthYear` (`AC-P12-076`).

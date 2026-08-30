# Graph Limits & Size Safeguards

## 1. Ngân Sách An Toàn Của Lát Cắt Đồ Thị

| Giới hạn | Giá trị mặc định | Giá trị tối đa | Xử lý khi vượt ngưỡng |
| :--- | :---: | :---: | :--- |
| **Độ sâu tổ tiên (`ancestorDepth`)** | 2 | 5 | Clamp tự động về 5 kèm metadata `appliedAncestorDepth: 5` |
| **Độ sâu hậu duệ (`descendantDepth`)** | 2 | 5 | Clamp tự động về 5 kèm metadata `appliedDescendantDepth: 5` |
| **Số lượng Person tối đa** | - | 250 | Cắt gọt an toàn, gắn cờ `truncated = true` |
| **Số lượng Quan hệ tối đa** | - | 500 | Giới hạn 500 cạnh |
| **Số lượng Union tối đa** | - | 150 | Giới hạn 150 hôn nhân |

## 2. Nguyên Tắc Cắt Gọt An Toàn (Safe Truncation)
- Không bao giờ để sót cạnh mồ côi (Dangling edge) trỏ tới node ngoài danh sách Persons.
- Giữ nguyên vẹn Center Person và các node ở các tầng gần gốc nhất.
- Đính kèm mảng `warnings: ["Graph slice was truncated due to budget constraints"]`.

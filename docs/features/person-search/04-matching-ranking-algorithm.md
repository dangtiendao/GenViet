# 04 - Thuật Toán Xếp Hạng & Độ Khớp (Matching & Ranking Algorithm)

## 1. Phân Tầng Độ Khớp (Match Tiers)

Mỗi kết quả tìm kiếm được gán một phân tầng độ khớp (`match_tier`) từ 1 đến 5 để đảm bảo các kết quả chính xác nhất luôn xuất hiện đầu tiên:

```mermaid
graph TD
    Query["Từ khóa tìm kiếm (Query)"] --> T1["Tier 1: Trùng khớp tuyệt đối (Exact Match)"]
    Query --> T2["Tier 2: Trùng khớp tiền tố (Prefix Match)"]
    Query --> T3["Tier 3: Trùng khớp chứa trong (Containment Match)"]
    Query --> T4["Tier 4: Độ tương đồng Trigram (Fuzzy Similarity >= 0.25)"]
    Query --> T5["Tier 5: Không có từ khóa (Browse all with filters)"]
```

---

## 2. Công Thức Xếp Hạng Deterministic

Thứ tự sắp xếp được tính toán theo 5 tiêu chí:
1. `match_tier ASC`: Ưu tiên phân tầng cao nhất.
2. `similarity_score DESC`: Độ tương đồng trigram cao hơn xếp trước.
3. `normalized_name ASC`: Tên theo bảng chữ cái.
4. `birth_year ASC NULLS LAST`: Năm sinh tăng dần (người lớn tuổi hơn xếp trước).
5. `id ASC`: UUID tie-breaker đảm bảo thứ tự luôn ổn định tuyệt đối.

# Cơ Chế Ánh Xạ ID Cũ Sang UUID Mới (ID Mapping Strategy)

## 1. Nguyên Tắc Ánh Xạ
1. **Sinh Mới 100%:** Tuyệt đối không tái sử dụng các ID nguồn từ file backup làm Primary Key trong cơ sở dữ liệu đích.
2. **Bảng Ánh Xạ Tạm Thời (In-Memory Maps):**
   - `personMap`: `sourceId -> newPersonUuid`
   - `relationshipMap`: `sourceId -> newRelationshipUuid`
   - `unionMap`: `sourceId -> newUnionUuid`
   - `mediaMap`: `sourceId -> newMediaUuid`
3. **Rewrite Toàn Bộ Khóa Ngoại:**
   - `parent_child_relationships.parentId` & `childId`
   - `union_members.unionId` & `personId`
   - `family_trees.generationAnchorPersonId` & `defaultPersonId`
   - `person_avatars.personId`

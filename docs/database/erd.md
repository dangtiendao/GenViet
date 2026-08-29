# Sơ đồ Thực thể Quan hệ CSDL (Entity Relationship Diagram - ERD)

- **Mã tài liệu:** `DB-ERD-01`
- **Phiên bản:** `v0.1-baseline`
- **Migration nguồn:** `20260829154907_p07_create_core_genealogy_schema.sql`
- **Ngày cập nhật:** 2026-08-29

---

## 1. Sơ đồ Quan hệ Tổng thể (Mermaid ERD)

```mermaid
erDiagram
    AUTH_USERS ||--o| PROFILES : "1:1 profile extension"
    AUTH_USERS ||--o{ TREE_MEMBERSHIPS : "participates in"
    
    FAMILY_TREES ||--o{ TREE_MEMBERSHIPS : "manages access"
    FAMILY_TREES ||--o{ PERSONS : "contains nodes"
    FAMILY_TREES ||--o{ PARENT_CHILD_RELATIONSHIPS : "contains lineage"
    FAMILY_TREES ||--o{ UNIONS : "contains marriages"
    FAMILY_TREES ||--o{ UNION_MEMBERS : "contains partners"
    FAMILY_TREES ||--o| PERSONS : "optional generation anchor"
    
    PERSONS ||--o{ PARENT_CHILD_RELATIONSHIPS : "parent_id (same tree)"
    PERSONS ||--o{ PARENT_CHILD_RELATIONSHIPS : "child_id (same tree)"
    
    UNIONS ||--o{ UNION_MEMBERS : "aggregates partners"
    PERSONS ||--o{ UNION_MEMBERS : "person_id (same tree)"

    AUTH_USERS {
        uuid id PK
        string email
    }

    PROFILES {
        uuid id PK,FK "1:1 auth.users"
        string display_name
        string avatar_path
        timestamptz created_at
        timestamptz updated_at
    }

    FAMILY_TREES {
        uuid id PK
        string name
        string description
        tree_status status
        tree_privacy_level privacy_level
        uuid generation_anchor_person_id FK "optional anchor in same tree"
        uuid created_by FK
        uuid updated_by FK
        uuid deleted_by FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
        integer version
    }

    TREE_MEMBERSHIPS {
        uuid id PK
        uuid tree_id FK
        uuid user_id FK
        membership_role role
        membership_status status
        uuid created_by FK
        uuid updated_by FK
        uuid deleted_by FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
        integer version
    }

    PERSONS {
        uuid id PK
        uuid tree_id FK
        string full_name
        string normalized_name
        gender_type gender
        living_status_type living_status
        date birth_date
        smallint birth_year
        date_precision_type birth_date_precision
        boolean birth_is_estimated
        date death_date
        smallint death_year
        date_precision_type death_date_precision
        boolean death_is_estimated
        string birth_place_text
        string death_place_text
        string hometown_text
        string burial_place_text
        string occupation_text
        string biography
        verification_status_type verification_status
        uuid created_by FK
        uuid updated_by FK
        uuid deleted_by FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
        integer version
    }

    PARENT_CHILD_RELATIONSHIPS {
        uuid id PK
        uuid tree_id FK
        uuid parent_id FK "persons(tree_id, id)"
        uuid child_id FK "persons(tree_id, id)"
        parent_role_type parent_role
        relationship_kind_type relationship_kind
        verification_status_type verification_status
        string notes
        uuid created_by FK
        uuid updated_by FK
        uuid deleted_by FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
        integer version
    }

    UNIONS {
        uuid id PK
        uuid tree_id FK
        union_status_type status
        date start_date
        smallint start_year
        date_precision_type start_date_precision
        date end_date
        smallint end_year
        date_precision_type end_date_precision
        string notes
        verification_status_type verification_status
        uuid created_by FK
        uuid updated_by FK
        uuid deleted_by FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
        integer version
    }

    UNION_MEMBERS {
        uuid id PK
        uuid tree_id FK
        uuid union_id FK "unions(tree_id, id)"
        uuid person_id FK "persons(tree_id, id)"
        union_member_role_type member_role
        uuid created_by FK
        timestamptz created_at
        timestamptz deleted_at
        uuid deleted_by FK
    }
```

---

## 2. Ghi chú Ranh giới Kiến trúc & Ràng buộc
1. **Phân quyền RLS:** Toàn bộ 7 bảng trên đã được bật Row Level Security (`deny-by-default`); các policy chi tiết theo vai trò (`owner`, `admin`, `editor`, `viewer`) sẽ được cài đặt trong Phase P08.
2. **Kiểm tra Chu trình (Cycle Detection):** Ràng buộc cấm self-link (`parent_id <> child_id`) được thực thi bằng CHECK constraint; giải thuật cycle-detection toàn đồ thị phân tán sẽ được cài đặt trong Phase P13.

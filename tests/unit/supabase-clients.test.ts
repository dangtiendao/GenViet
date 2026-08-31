import { describe, it, expect } from "vitest";
import { type Database } from "@/lib/supabase/database.types";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

describe("Supabase Client & Schema Foundations (Phase P07)", () => {
  it("should have valid Database TypeScript types for Core Genealogy Entities", () => {
    // 1. Family Tree type check
    const mockTree: Database["public"]["Tables"]["family_trees"]["Row"] = {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Dòng họ Nguyễn",
      description: "Gia phả chi 3 miền Bắc",
      status: "active",
      privacy_level: "private",
      generation_anchor_person_id: null,
      public_slug: null,
      published_at: null,
      public_updated_at: null,
      publication_version: 0,
      privacy_projection_version: 1,
      search_engine_visibility: "NOINDEX",
      living_person_policy: "REDACTED",
      created_by: null,
      updated_by: null,
      deleted_by: null,
      created_at: "2026-08-29T15:00:00Z",
      updated_at: "2026-08-29T15:00:00Z",
      deleted_at: null,
      version: 1,
    };
    expect(mockTree.name).toBe("Dòng họ Nguyễn");
    expect(mockTree.privacy_level).toBe("private");

    // 2. Person type check
    const mockPerson: Database["public"]["Tables"]["persons"]["Row"] = {
      id: "22222222-2222-2222-2222-222222222222",
      tree_id: mockTree.id,
      full_name: "Nguyễn Văn A",
      normalized_name: "nguyễn văn a",
      gender: "male",
      living_status: "deceased",
      birth_date: null,
      birth_year: 1890,
      birth_date_precision: "year",
      birth_is_estimated: false,
      death_date: null,
      death_year: 1965,
      death_date_precision: "year",
      death_is_estimated: false,
      birth_place_text: "Hà Nội",
      death_place_text: null,
      hometown_text: "Nam Định",
      burial_place_text: null,
      occupation_text: null,
      biography: "Cụ tổ đời thứ 4",
      verification_status: "verified",
      avatar_path: null,
      public_visibility: "INHERIT_TREE",
      created_by: null,
      updated_by: null,
      deleted_by: null,
      created_at: "2026-08-29T15:00:00Z",
      updated_at: "2026-08-29T15:00:00Z",
      deleted_at: null,
      version: 1,
    };
    expect(mockPerson.full_name).toBe("Nguyễn Văn A");
    expect(mockPerson.birth_date_precision).toBe("year");

    // 3. Parent-Child Relationship type check
    const mockRel: Database["public"]["Tables"]["parent_child_relationships"]["Row"] = {
      id: "33333333-3333-3333-3333-333333333333",
      tree_id: mockTree.id,
      parent_id: mockPerson.id,
      child_id: "44444444-4444-4444-4444-444444444444",
      parent_role: "father",
      relationship_kind: "biological",
      verification_status: "verified",
      notes: null,
      created_by: null,
      updated_by: null,
      deleted_by: null,
      created_at: "2026-08-29T15:00:00Z",
      updated_at: "2026-08-29T15:00:00Z",
      deleted_at: null,
      version: 1,
    };
    expect(mockRel.parent_role).toBe("father");
    expect(mockRel.relationship_kind).toBe("biological");
  });

  it("should throw error or create client safely without unhandled crashes", () => {
    try {
      const client = createBrowserClient();
      expect(client).toBeDefined();
    } catch (error: any) {
      expect(error.message).toContain("Missing Supabase environment variables");
    }
  });
});

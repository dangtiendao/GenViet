import { createClient } from "@/lib/supabase/server";
import type {
  Person,
  PersonListItem,
  PersonRelationshipSummary,
  SiblingRelationshipItem,
  SimilarPersonCandidate,
} from "../types/person.types";

import type { Database } from "@/lib/supabase/database.types";

type PersonRow = Database["public"]["Tables"]["persons"]["Row"];
type PersonInsert = Database["public"]["Tables"]["persons"]["Insert"];
type PersonUpdate = Database["public"]["Tables"]["persons"]["Update"];

export class PersonRepository {
  /**
   * Chuyển đổi Person Row từ DB sang Domain Person Model
   */
  private static mapRowToPerson(row: PersonRow): Person {
    return {
      id: row.id,
      treeId: row.tree_id,
      fullName: row.full_name,
      normalizedName: row.normalized_name,
      gender: row.gender,
      livingStatus: row.living_status,
      birthDate: row.birth_date,
      birthYear: row.birth_year,
      birthDatePrecision: row.birth_date_precision,
      birthIsEstimated: row.birth_is_estimated,
      deathDate: row.death_date,
      deathYear: row.death_year,
      deathDatePrecision: row.death_date_precision,
      deathIsEstimated: row.death_is_estimated,
      birthPlaceText: row.birth_place_text,
      deathPlaceText: row.death_place_text,
      hometownText: row.hometown_text,
      burialPlaceText: row.burial_place_text,
      occupationText: row.occupation_text,
      biography: row.biography,
      verificationStatus: row.verification_status,
      avatarPath: row.avatar_path,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      deletedBy: row.deleted_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
      version: row.version,
    };
  }

  /**
   * Liệt kê danh sách nhân vật active trong cây gia phả
   */
  static async listActivePeopleByTree(treeId: string): Promise<PersonListItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .select(
        `
        id,
        tree_id,
        full_name,
        gender,
        living_status,
        birth_year,
        birth_date,
        birth_date_precision,
        birth_is_estimated,
        death_year,
        death_date,
        death_date_precision,
        death_is_estimated,
        hometown_text,
        occupation_text,
        verification_status,
        avatar_path,
        version
      `
      )
      .eq("tree_id", treeId)
      .is("deleted_at", null)
      .order("full_name", { ascending: true });

    if (error) {
      console.error("[PersonRepository.listActivePeopleByTree] Error:", error);
      throw error;
    }

    if (!data) return [];

    return data.map((p) => ({
      id: p.id,
      treeId: p.tree_id,
      fullName: p.full_name,
      gender: p.gender,
      livingStatus: p.living_status,
      birthYear: p.birth_year,
      birthDate: p.birth_date,
      birthDatePrecision: p.birth_date_precision,
      birthIsEstimated: p.birth_is_estimated,
      deathYear: p.death_year,
      deathDate: p.death_date,
      deathDatePrecision: p.death_date_precision,
      deathIsEstimated: p.death_is_estimated,
      hometownText: p.hometown_text,
      occupationText: p.occupation_text,
      verificationStatus: p.verification_status,
      avatarPath: p.avatar_path,
      version: p.version,
    }));
  }

  /**
   * Lấy thông tin chi tiết một nhân vật active
   */
  static async getActivePersonById(treeId: string, personId: string): Promise<Person | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .select("*")
      .eq("tree_id", treeId)
      .eq("id", personId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapRowToPerson(data);
  }

  /**
   * Lấy tóm tắt quan hệ gia đình hiện có (Chỉ đọc) của một nhân vật
   */
  static async getPersonRelationships(
    treeId: string,
    personId: string
  ): Promise<PersonRelationshipSummary> {
    const supabase = await createClient();

    // 1. Truy vấn song song tất cả các quan hệ liên quan đến personId
    const [parentRelsRes, childRelsRes, myUnionsRes] = await Promise.all([
      supabase
        .from("parent_child_relationships")
        .select("id, parent_id, child_id, parent_role, relationship_kind, verification_status")
        .eq("tree_id", treeId)
        .eq("child_id", personId)
        .is("deleted_at", null),
      supabase
        .from("parent_child_relationships")
        .select("id, parent_id, child_id, parent_role, relationship_kind, verification_status")
        .eq("tree_id", treeId)
        .eq("parent_id", personId)
        .is("deleted_at", null),
      supabase
        .from("union_members")
        .select("id, union_id, person_id, member_role")
        .eq("tree_id", treeId)
        .eq("person_id", personId)
        .is("deleted_at", null),
    ]);

    const parentRels = parentRelsRes.data || [];
    const childRels = childRelsRes.data || [];
    const myUnions = myUnionsRes.data || [];

    // 2. Lấy partner union members nếu có tham gia union
    const myUnionIds = myUnions.map((u) => u.union_id);
    let partnerMembers: Array<{
      id: string;
      union_id: string;
      person_id: string;
      member_role: "spouse" | "partner" | "unspecified";
    }> = [];
    let unionDetails: Array<{
      id: string;
      status: "active" | "separated" | "divorced" | "widowed" | "former";
    }> = [];

    if (myUnionIds.length > 0) {
      const [partnerRes, unionRes] = await Promise.all([
        supabase
          .from("union_members")
          .select("id, union_id, person_id, member_role")
          .eq("tree_id", treeId)
          .in("union_id", myUnionIds)
          .neq("person_id", personId)
          .is("deleted_at", null),
        supabase
          .from("unions")
          .select("id, status")
          .eq("tree_id", treeId)
          .in("id", myUnionIds)
          .is("deleted_at", null),
      ]);
      partnerMembers = (partnerRes.data as typeof partnerMembers) || [];
      unionDetails = (unionRes.data as typeof unionDetails) || [];
    }

    // 3. Tìm anh/chị/em (những người có chung ít nhất một cha hoặc mẹ)
    const myParentIds = parentRels.map((r) => r.parent_id);
    let siblingRels: Array<{
      id: string;
      parent_id: string;
      child_id: string;
      parent_role: "father" | "mother" | "unspecified";
    }> = [];

    if (myParentIds.length > 0) {
      const { data: sData } = await supabase
        .from("parent_child_relationships")
        .select("id, parent_id, child_id, parent_role")
        .eq("tree_id", treeId)
        .in("parent_id", myParentIds)
        .neq("child_id", personId)
        .is("deleted_at", null);
      siblingRels = (sData as typeof siblingRels) || [];
    }

    const siblingMap = new Map<
      string,
      Array<{ id: string; parent_id: string; parent_role: "father" | "mother" | "unspecified" }>
    >();
    for (const sr of siblingRels) {
      if (!siblingMap.has(sr.child_id)) {
        siblingMap.set(sr.child_id, []);
      }
      siblingMap.get(sr.child_id)!.push(sr);
    }

    // 4. Thu thập tất cả personIds cần lấy thông tin
    const personIdsToFetch = new Set<string>();
    for (const r of parentRels) personIdsToFetch.add(r.parent_id);
    for (const r of childRels) personIdsToFetch.add(r.child_id);
    for (const pm of partnerMembers) personIdsToFetch.add(pm.person_id);
    for (const sChildId of siblingMap.keys()) personIdsToFetch.add(sChildId);

    const personMap = new Map<
      string,
      {
        id: string;
        full_name: string;
        gender: "male" | "female" | "other" | "unknown";
        living_status: "living" | "deceased" | "unknown";
        birth_date: string | null;
        birth_year: number | null;
        birth_date_precision: "exact" | "year" | "unknown";
        birth_is_estimated: boolean;
        death_date: string | null;
        death_year: number | null;
        death_date_precision: "exact" | "year" | "unknown";
        death_is_estimated: boolean;
      }
    >();

    if (personIdsToFetch.size > 0) {
      const { data: persons } = await supabase
        .from("persons")
        .select(
          "id, full_name, gender, living_status, birth_date, birth_year, birth_date_precision, birth_is_estimated, death_date, death_year, death_date_precision, death_is_estimated"
        )
        .eq("tree_id", treeId)
        .in("id", Array.from(personIdsToFetch))
        .is("deleted_at", null);

      if (persons) {
        for (const p of persons) {
          personMap.set(p.id, p as typeof personMap extends Map<string, infer V> ? V : never);
        }
      }
    }

    const unionMap = new Map<string, "active" | "separated" | "divorced" | "widowed" | "former">();
    for (const u of unionDetails) {
      unionMap.set(u.id, u.status);
    }

    // 4. Ghép nối kết quả
    const parents: PersonRelationshipSummary["parents"] = [];
    for (const r of parentRels) {
      const p = personMap.get(r.parent_id);
      if (p) {
        const effectiveBirthYear =
          p.birth_year ?? (p.birth_date ? parseInt(p.birth_date.split("-")[0], 10) : null);
        const effectiveDeathYear =
          p.death_year ?? (p.death_date ? parseInt(p.death_date.split("-")[0], 10) : null);

        parents.push({
          id: r.id,
          parentRole: r.parent_role as "father" | "mother" | "unspecified",
          relationshipKind: r.relationship_kind as "biological" | "adoptive" | "step" | "foster",
          verificationStatus: r.verification_status as "unverified" | "verified" | "disputed",
          parent: {
            id: p.id,
            fullName: p.full_name,
            gender: p.gender,
            livingStatus: p.living_status,
            birthDate: p.birth_date,
            birthYear: effectiveBirthYear,
            birthDatePrecision: p.birth_date_precision,
            birthIsEstimated: p.birth_is_estimated,
            deathDate: p.death_date,
            deathYear: effectiveDeathYear,
            deathDatePrecision: p.death_date_precision,
            deathIsEstimated: p.death_is_estimated,
          },
        });
      }
    }

    const children: PersonRelationshipSummary["children"] = [];
    for (const r of childRels) {
      const c = personMap.get(r.child_id);
      if (c) {
        const effectiveBirthYear =
          c.birth_year ?? (c.birth_date ? parseInt(c.birth_date.split("-")[0], 10) : null);
        const effectiveDeathYear =
          c.death_year ?? (c.death_date ? parseInt(c.death_date.split("-")[0], 10) : null);

        children.push({
          id: r.id,
          parentRole: r.parent_role as "father" | "mother" | "unspecified",
          relationshipKind: r.relationship_kind as "biological" | "adoptive" | "step" | "foster",
          verificationStatus: r.verification_status as "unverified" | "verified" | "disputed",
          child: {
            id: c.id,
            fullName: c.full_name,
            gender: c.gender,
            livingStatus: c.living_status,
            birthDate: c.birth_date,
            birthYear: effectiveBirthYear,
            birthDatePrecision: c.birth_date_precision,
            birthIsEstimated: c.birth_is_estimated,
            deathDate: c.death_date,
            deathYear: effectiveDeathYear,
            deathDatePrecision: c.death_date_precision,
            deathIsEstimated: c.death_is_estimated,
          },
        });
      }
    }

    const spouses: PersonRelationshipSummary["spouses"] = [];
    for (const pm of partnerMembers) {
      const sp = personMap.get(pm.person_id);
      if (sp) {
        const effectiveBirthYear =
          sp.birth_year ?? (sp.birth_date ? parseInt(sp.birth_date.split("-")[0], 10) : null);
        const effectiveDeathYear =
          sp.death_year ?? (sp.death_date ? parseInt(sp.death_date.split("-")[0], 10) : null);

        spouses.push({
          id: pm.id,
          unionId: pm.union_id,
          spouse: {
            id: sp.id,
            fullName: sp.full_name,
            gender: sp.gender,
            livingStatus: sp.living_status,
            birthDate: sp.birth_date,
            birthYear: effectiveBirthYear,
            birthDatePrecision: sp.birth_date_precision,
            birthIsEstimated: sp.birth_is_estimated,
            deathDate: sp.death_date,
            deathYear: effectiveDeathYear,
            deathDatePrecision: sp.death_date_precision,
            deathIsEstimated: sp.death_is_estimated,
          },
          role: pm.member_role,
          unionStatus: unionMap.get(pm.union_id) || "active",
        });
      }
    }

    const siblings: PersonRelationshipSummary["siblings"] = [];
    const myParentRoleMap = new Map<string, "father" | "mother" | "unspecified">();
    for (const pr of parentRels) {
      myParentRoleMap.set(pr.parent_id, pr.parent_role as "father" | "mother" | "unspecified");
    }

    for (const [siblingChildId, sRels] of siblingMap.entries()) {
      const sp = personMap.get(siblingChildId);
      if (sp) {
        const effectiveBirthYear =
          sp.birth_year ?? (sp.birth_date ? parseInt(sp.birth_date.split("-")[0], 10) : null);
        const effectiveDeathYear =
          sp.death_year ?? (sp.death_date ? parseInt(sp.death_date.split("-")[0], 10) : null);

        const sharedParents: SiblingRelationshipItem["sharedParents"] = [];
        let sharesFather = false;
        let sharesMother = false;

        for (const sr of sRels) {
          const pInfo = personMap.get(sr.parent_id);
          const pRole = sr.parent_role || myParentRoleMap.get(sr.parent_id) || "unspecified";
          if (pRole === "father") sharesFather = true;
          if (pRole === "mother") sharesMother = true;

          if (pInfo) {
            sharedParents.push({
              id: pInfo.id,
              fullName: pInfo.full_name,
              role: pRole,
            });
          }
        }

        let sharedType: SiblingRelationshipItem["sharedType"] = "shared";
        if (sharesFather && sharesMother) {
          sharedType = "full";
        } else if (sharesFather && !sharesMother && myParentIds.length > 1) {
          sharedType = "paternal";
        } else if (sharesMother && !sharesFather && myParentIds.length > 1) {
          sharedType = "maternal";
        }

        siblings.push({
          id: siblingChildId,
          sharedType,
          sharedParents,
          sibling: {
            id: sp.id,
            fullName: sp.full_name,
            gender: sp.gender,
            livingStatus: sp.living_status,
            birthDate: sp.birth_date,
            birthYear: effectiveBirthYear,
            birthDatePrecision: sp.birth_date_precision,
            birthIsEstimated: sp.birth_is_estimated,
            deathDate: sp.death_date,
            deathYear: effectiveDeathYear,
            deathDatePrecision: sp.death_date_precision,
            deathIsEstimated: sp.death_is_estimated,
          },
        });
      }
    }

    siblings.sort((a, b) => {
      const aYear =
        a.sibling.birthYear ??
        (a.sibling.birthDate ? parseInt(a.sibling.birthDate.split("-")[0], 10) : 9999);
      const bYear =
        b.sibling.birthYear ??
        (b.sibling.birthDate ? parseInt(b.sibling.birthDate.split("-")[0], 10) : 9999);
      return aYear - bYear;
    });

    return {
      parents,
      children,
      spouses,
      siblings,
    };
  }

  /**
   * Tìm kiếm ứng viên có hồ sơ tương tự trong cùng cây gia phả
   */
  static async findSimilarPeople(
    treeId: string,
    normalizedName: string,
    birthYear?: number | null,
    excludePersonId?: string
  ): Promise<SimilarPersonCandidate[]> {
    const supabase = await createClient();

    let query = supabase
      .from("persons")
      .select("id, full_name, gender, living_status, birth_year, death_year, hometown_text")
      .eq("tree_id", treeId)
      .eq("normalized_name", normalizedName)
      .is("deleted_at", null)
      .limit(5);

    if (excludePersonId) {
      query = query.neq("id", excludePersonId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      fullName: p.full_name,
      gender: p.gender,
      livingStatus: p.living_status,
      birthYear: p.birth_year,
      deathYear: p.death_year,
      hometownText: p.hometown_text,
    }));
  }

  /**
   * Tạo nhân vật mới trong cây gia phả
   */
  static async createPerson(data: PersonInsert): Promise<Person> {
    const supabase = await createClient();

    const { data: created, error } = await supabase
      .from("persons")
      .insert(data)
      .select("*")
      .single();

    if (error || !created) {
      console.error("[PersonRepository.createPerson] Insert error:", error);
      throw error;
    }

    return this.mapRowToPerson(created);
  }

  /**
   * Cập nhật thông tin nhân vật với kiểm tra Optimistic Concurrency version
   */
  static async updatePersonWithVersion(
    personId: string,
    expectedVersion: number,
    updateData: PersonUpdate
  ): Promise<Person | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .update({
        ...updateData,
        version: expectedVersion + 1,
      })
      .eq("id", personId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("[PersonRepository.updatePersonWithVersion] Update error:", error);
      throw error;
    }

    if (!data) return null;
    return this.mapRowToPerson(data);
  }

  /**
   * Xóa mềm nhân vật
   */
  static async softDeletePersonWithVersion(
    personId: string,
    expectedVersion: number,
    userId: string
  ): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
        version: expectedVersion + 1,
        updated_by: userId,
      })
      .eq("id", personId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("id");

    if (error) {
      console.error("[PersonRepository.softDeletePersonWithVersion] Delete error:", error);
      throw error;
    }

    return Boolean(data && data.length > 0);
  }

  /**
   * Lấy danh sách nhân vật đã xóa mềm (Thùng rác)
   */
  static async getDeletedPeopleByTree(treeId: string): Promise<PersonListItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .select(
        `
        id,
        tree_id,
        full_name,
        gender,
        living_status,
        birth_year,
        birth_date,
        birth_date_precision,
        birth_is_estimated,
        death_year,
        death_date,
        death_date_precision,
        death_is_estimated,
        hometown_text,
        occupation_text,
        verification_status,
        version
      `
      )
      .eq("tree_id", treeId)
      .not("deleted_at", "is", null)
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      treeId: p.tree_id,
      fullName: p.full_name,
      gender: p.gender,
      livingStatus: p.living_status,
      birthYear: p.birth_year,
      birthDate: p.birth_date,
      birthDatePrecision: p.birth_date_precision,
      birthIsEstimated: p.birth_is_estimated,
      deathYear: p.death_year,
      deathDate: p.death_date,
      deathDatePrecision: p.death_date_precision,
      deathIsEstimated: p.death_is_estimated,
      hometownText: p.hometown_text,
      occupationText: p.occupation_text,
      verificationStatus: p.verification_status,
      version: p.version,
    }));
  }
}

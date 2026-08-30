import { createClient } from "@/lib/supabase/server";
import type {
  Person,
  PersonListItem,
  PersonRelationshipSummary,
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

    // 1. Lấy danh sách Cha / Mẹ (người này là child)
    const { data: parentRelations } = await supabase
      .from("parent_child_relationships")
      .select(
        `
        id,
        parent_role,
        relationship_kind,
        verification_status,
        parent:persons!parent_child_relationships_parent_id_fkey (
          id,
          full_name,
          gender,
          living_status,
          birth_year,
          death_year
        )
      `
      )
      .eq("tree_id", treeId)
      .eq("child_id", personId)
      .is("deleted_at", null);

    // 2. Lấy danh sách Con (người này là parent)
    const { data: childRelations } = await supabase
      .from("parent_child_relationships")
      .select(
        `
        id,
        parent_role,
        relationship_kind,
        verification_status,
        child:persons!parent_child_relationships_child_id_fkey (
          id,
          full_name,
          gender,
          living_status,
          birth_year,
          death_year
        )
      `
      )
      .eq("tree_id", treeId)
      .eq("parent_id", personId)
      .is("deleted_at", null);

    // 3. Lấy danh sách Vợ / Chồng (thông qua unions và union_members)
    // 3a. Tìm các union_id mà personId tham gia
    const { data: myUnions } = await supabase
      .from("union_members")
      .select("union_id, member_role")
      .eq("tree_id", treeId)
      .eq("person_id", personId)
      .is("deleted_at", null);

    const spouseItems: PersonRelationshipSummary["spouses"] = [];

    if (myUnions && myUnions.length > 0) {
      const unionIds = myUnions.map((u) => u.union_id);

      // 3b. Lấy các union_members khác trong cùng các union đó
      const { data: partnerMembers } = await supabase
        .from("union_members")
        .select(
          `
          id,
          union_id,
          member_role,
          person:persons!union_members_person_id_fkey (
            id,
            full_name,
            gender,
            living_status,
            birth_year,
            death_year
          ),
          union:unions!union_members_union_id_fkey (
            status
          )
        `
        )
        .eq("tree_id", treeId)
        .in("union_id", unionIds)
        .neq("person_id", personId)
        .is("deleted_at", null);

      if (partnerMembers) {
        partnerMembers.forEach((pm: any) => {
          if (pm.person) {
            spouseItems.push({
              id: pm.id,
              unionId: pm.union_id,
              spouse: {
                id: pm.person.id,
                fullName: pm.person.full_name,
                gender: pm.person.gender,
                livingStatus: pm.person.living_status,
                birthYear: pm.person.birth_year,
                deathYear: pm.person.death_year,
              },
              role: pm.member_role,
              unionStatus: pm.union?.status || "active",
            });
          }
        });
      }
    }

    const parents: PersonRelationshipSummary["parents"] = [];
    if (parentRelations) {
      parentRelations.forEach((r: any) => {
        if (r.parent) {
          parents.push({
            id: r.id,
            parentRole: r.parent_role,
            relationshipKind: r.relationship_kind,
            verificationStatus: r.verification_status,
            parent: {
              id: r.parent.id,
              fullName: r.parent.full_name,
              gender: r.parent.gender,
              livingStatus: r.parent.living_status,
              birthYear: r.parent.birth_year,
              deathYear: r.parent.death_year,
            },
          });
        }
      });
    }

    const children: PersonRelationshipSummary["children"] = [];
    if (childRelations) {
      childRelations.forEach((r: any) => {
        if (r.child) {
          children.push({
            id: r.id,
            parentRole: r.parent_role,
            relationshipKind: r.relationship_kind,
            verificationStatus: r.verification_status,
            child: {
              id: r.child.id,
              fullName: r.child.full_name,
              gender: r.child.gender,
              livingStatus: r.child.living_status,
              birthYear: r.child.birth_year,
              deathYear: r.child.death_year,
            },
          });
        }
      });
    }

    return {
      parents,
      children,
      spouses: spouseItems,
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

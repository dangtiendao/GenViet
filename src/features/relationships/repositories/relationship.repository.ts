import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type {
  RelatedPersonCandidate,
  ParentChildRelationship,
  UnionEntity,
  ParentWithDetails,
  SpouseWithDetails,
} from "../types/relationship.types";
import { normalizePersonName } from "@/features/persons/utils/normalize-person-name";

export class RelationshipRepository {
  /**
   * Lấy danh sách vợ/chồng (phối ngẫu) hiện có của nhân vật kèm thông tin chi tiết
   */
  static async getSpousesWithDetails(
    treeId: string,
    personId: string
  ): Promise<SpouseWithDetails[]> {
    const supabase = await createClient();

    // 1. Lấy tất cả union_id mà personId tham gia
    const { data: myMemberships, error: mErr } = await supabase
      .from("union_members")
      .select("union_id")
      .eq("tree_id", treeId)
      .eq("person_id", personId)
      .is("deleted_at", null);

    if (mErr || !myMemberships || myMemberships.length === 0) {
      return [];
    }

    const unionIds = myMemberships.map((m) => m.union_id);

    // 2. Lấy tất cả thành viên khác trong các union này
    const { data: otherMembers, error: oErr } = await supabase
      .from("union_members")
      .select("id, union_id, person_id")
      .eq("tree_id", treeId)
      .in("union_id", unionIds)
      .neq("person_id", personId)
      .is("deleted_at", null);

    if (oErr || !otherMembers || otherMembers.length === 0) {
      return [];
    }

    const spousePersonIds = Array.from(new Set(otherMembers.map((m) => m.person_id)));

    // 3. Lấy thông tin chi tiết người phối ngẫu và union
    const [personsRes, unionsRes] = await Promise.all([
      supabase
        .from("persons")
        .select("id, full_name, gender, living_status")
        .eq("tree_id", treeId)
        .in("id", spousePersonIds)
        .is("deleted_at", null),
      supabase
        .from("unions")
        .select("id, status")
        .eq("tree_id", treeId)
        .in("id", unionIds)
        .is("deleted_at", null),
    ]);

    const personMap = new Map((personsRes.data || []).map((p) => [p.id, p]));
    const unionMap = new Map((unionsRes.data || []).map((u) => [u.id, u]));

    const result: SpouseWithDetails[] = [];
    for (const mem of otherMembers) {
      const p = personMap.get(mem.person_id);
      const u = unionMap.get(mem.union_id);
      if (p) {
        result.push({
          id: mem.id,
          spouseId: p.id,
          spouseName: p.full_name,
          gender: p.gender,
          livingStatus: p.living_status,
          unionId: mem.union_id,
          unionStatus: u?.status || "active",
        });
      }
    }

    return result;
  }

  /**
   * Tìm danh sách các ứng viên trong cùng cây gia phả để liên kết
   */
  static async findPotentialCandidates(
    treeId: string,
    excludePersonId: string,
    searchQuery?: string,
    limit: number = 20
  ): Promise<RelatedPersonCandidate[]> {
    const supabase = await createClient();
    let query = supabase
      .from("persons")
      .select("id, full_name, gender, living_status, birth_year, birth_date")
      .eq("tree_id", treeId)
      .is("deleted_at", null)
      .neq("id", excludePersonId)
      .order("full_name", { ascending: true })
      .limit(limit);

    if (searchQuery && searchQuery.trim().length > 0) {
      const normalized = normalizePersonName(searchQuery);
      query = query.ilike("normalized_name", `%${normalized}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to query person candidates: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      fullName: row.full_name,
      gender: row.gender,
      livingStatus: row.living_status,
      birthYear: row.birth_year,
      birthDate: row.birth_date,
    }));
  }

  /**
   * Lấy các quan hệ cha/mẹ hiện có của nhân vật
   */
  static async getExistingParents(
    treeId: string,
    childId: string
  ): Promise<ParentChildRelationship[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parent_child_relationships")
      .select("*")
      .eq("tree_id", treeId)
      .eq("child_id", childId)
      .is("deleted_at", null);

    if (error) {
      throw new Error(`Failed to query parents: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      treeId: row.tree_id,
      parentId: row.parent_id,
      childId: row.child_id,
      parentRole: row.parent_role,
      relationshipKind: row.relationship_kind,
      verificationStatus: row.verification_status,
      notes: row.notes,
      version: row.version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    }));
  }

  /**
   * Lấy danh sách cha/mẹ kèm thông tin hiển thị (tên, vai trò, giới tính)
   */
  static async getParentsWithDetails(
    treeId: string,
    childId: string
  ): Promise<ParentWithDetails[]> {
    const supabase = await createClient();
    const { data: rels, error: rErr } = await supabase
      .from("parent_child_relationships")
      .select("id, parent_id, parent_role")
      .eq("tree_id", treeId)
      .eq("child_id", childId)
      .is("deleted_at", null);

    if (rErr || !rels || rels.length === 0) {
      return [];
    }

    const parentIds = rels.map((r) => r.parent_id);
    const { data: persons, error: pErr } = await supabase
      .from("persons")
      .select("id, full_name, gender, living_status")
      .eq("tree_id", treeId)
      .in("id", parentIds)
      .is("deleted_at", null);

    if (pErr || !persons) {
      return [];
    }

    const personMap = new Map(persons.map((p) => [p.id, p]));

    return rels
      .map((r) => {
        const p = personMap.get(r.parent_id);
        if (!p) return null;
        return {
          id: r.id,
          parentId: r.parent_id,
          parentName: p.full_name,
          parentRole: r.parent_role,
          gender: p.gender,
          livingStatus: p.living_status,
        };
      })
      .filter((item): item is ParentWithDetails => item !== null);
  }

  /**
   * Gọi RPC create_person_with_parent_relationship
   */
  static async createPersonWithParentRelationship(args: {
    treeId: string;
    childId: string;
    fullName: string;
    gender?: Database["public"]["Enums"]["gender_type"];
    livingStatus?: Database["public"]["Enums"]["living_status_type"];
    birthDate?: string | null;
    birthYear?: number | null;
    birthDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    birthIsEstimated?: boolean;
    deathDate?: string | null;
    deathYear?: number | null;
    deathDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    deathIsEstimated?: boolean;
    hometownText?: string | null;
    occupationText?: string | null;
    biography?: string | null;
    parentRole?: Database["public"]["Enums"]["parent_role_type"];
    relationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    verificationStatus?: Database["public"]["Enums"]["verification_status_type"];
    confirmWarnings?: boolean;
  }): Promise<{ personId: string; relationshipId: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_person_with_parent_relationship", {
      p_tree_id: args.treeId,
      p_child_id: args.childId,
      p_full_name: args.fullName,
      p_gender: args.gender || "unknown",
      p_living_status: args.livingStatus || "unknown",
      p_birth_date: args.birthDate || null,
      p_birth_year: args.birthYear || null,
      p_birth_date_precision: args.birthDatePrecision || "unknown",
      p_birth_is_estimated: args.birthIsEstimated || false,
      p_death_date: args.deathDate || null,
      p_death_year: args.deathYear || null,
      p_death_date_precision: args.deathDatePrecision || "unknown",
      p_death_is_estimated: args.deathIsEstimated || false,
      p_hometown_text: args.hometownText || null,
      p_occupation_text: args.occupationText || null,
      p_biography: args.biography || null,
      p_parent_role: args.parentRole || "unspecified",
      p_relationship_kind: args.relationshipKind || "biological",
      p_verification_status: args.verificationStatus || "unverified",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    const res = data as { person_id: string; relationship_id: string };
    return {
      personId: res.person_id,
      relationshipId: res.relationship_id,
    };
  }

  /**
   * Gọi RPC link_existing_parent
   */
  static async linkExistingParent(args: {
    treeId: string;
    parentId: string;
    childId: string;
    parentRole?: Database["public"]["Enums"]["parent_role_type"];
    relationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    verificationStatus?: Database["public"]["Enums"]["verification_status_type"];
    confirmWarnings?: boolean;
  }): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("link_existing_parent", {
      p_tree_id: args.treeId,
      p_parent_id: args.parentId,
      p_child_id: args.childId,
      p_parent_role: args.parentRole || "unspecified",
      p_relationship_kind: args.relationshipKind || "biological",
      p_verification_status: args.verificationStatus || "unverified",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    return data as string;
  }

  /**
   * Gọi RPC create_person_with_child_relationship
   */
  static async createPersonWithChildRelationship(args: {
    treeId: string;
    parentId: string;
    fullName: string;
    gender?: Database["public"]["Enums"]["gender_type"];
    livingStatus?: Database["public"]["Enums"]["living_status_type"];
    birthDate?: string | null;
    birthYear?: number | null;
    birthDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    birthIsEstimated?: boolean;
    deathDate?: string | null;
    deathYear?: number | null;
    deathDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    deathIsEstimated?: boolean;
    hometownText?: string | null;
    occupationText?: string | null;
    biography?: string | null;
    parentRole?: Database["public"]["Enums"]["parent_role_type"];
    relationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    verificationStatus?: Database["public"]["Enums"]["verification_status_type"];
    otherParentId?: string | null;
    otherParentRole?: Database["public"]["Enums"]["parent_role_type"];
    otherRelationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    confirmWarnings?: boolean;
  }): Promise<{ personId: string; relationshipId: string; otherRelationshipId?: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_person_with_child_relationship", {
      p_tree_id: args.treeId,
      p_parent_id: args.parentId,
      p_full_name: args.fullName,
      p_gender: args.gender || "unknown",
      p_living_status: args.livingStatus || "living",
      p_birth_date: args.birthDate || null,
      p_birth_year: args.birthYear || null,
      p_birth_date_precision: args.birthDatePrecision || "unknown",
      p_birth_is_estimated: args.birthIsEstimated || false,
      p_death_date: args.deathDate || null,
      p_death_year: args.deathYear || null,
      p_death_date_precision: args.deathDatePrecision || "unknown",
      p_death_is_estimated: args.deathIsEstimated || false,
      p_hometown_text: args.hometownText || null,
      p_occupation_text: args.occupationText || null,
      p_biography: args.biography || null,
      p_parent_role: args.parentRole || "unspecified",
      p_relationship_kind: args.relationshipKind || "biological",
      p_verification_status: args.verificationStatus || "unverified",
      p_other_parent_id: args.otherParentId || null,
      p_other_parent_role: args.otherParentRole || "unspecified",
      p_other_relationship_kind: args.otherRelationshipKind || "biological",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    const res = data as {
      person_id: string;
      relationship_id: string;
      other_relationship_id?: string;
    };
    return {
      personId: res.person_id,
      relationshipId: res.relationship_id,
      otherRelationshipId: res.other_relationship_id,
    };
  }

  /**
   * Gọi RPC link_existing_child
   */
  static async linkExistingChild(args: {
    treeId: string;
    parentId: string;
    childId: string;
    parentRole?: Database["public"]["Enums"]["parent_role_type"];
    relationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    verificationStatus?: Database["public"]["Enums"]["verification_status_type"];
    otherParentId?: string | null;
    otherParentRole?: Database["public"]["Enums"]["parent_role_type"];
    otherRelationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    confirmWarnings?: boolean;
  }): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("link_existing_child", {
      p_tree_id: args.treeId,
      p_parent_id: args.parentId,
      p_child_id: args.childId,
      p_parent_role: args.parentRole || "unspecified",
      p_relationship_kind: args.relationshipKind || "biological",
      p_verification_status: args.verificationStatus || "unverified",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    if (args.otherParentId) {
      try {
        await supabase.rpc("link_existing_child", {
          p_tree_id: args.treeId,
          p_parent_id: args.otherParentId,
          p_child_id: args.childId,
          p_parent_role: args.otherParentRole || "unspecified",
          p_relationship_kind: args.otherRelationshipKind || "biological",
          p_verification_status: args.verificationStatus || "unverified",
          p_confirm_warnings: args.confirmWarnings || false,
        });
      } catch (err) {
        console.warn("[linkExistingChild] Warning linking other parent:", err);
      }
    }

    return data as string;
  }

  /**
   * Gọi RPC create_union_with_new_person
   */
  static async createUnionWithNewPerson(args: {
    treeId: string;
    subjectPersonId: string;
    fullName: string;
    gender?: Database["public"]["Enums"]["gender_type"];
    livingStatus?: Database["public"]["Enums"]["living_status_type"];
    birthDate?: string | null;
    birthYear?: number | null;
    birthDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    birthIsEstimated?: boolean;
    deathDate?: string | null;
    deathYear?: number | null;
    deathDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    deathIsEstimated?: boolean;
    hometownText?: string | null;
    occupationText?: string | null;
    biography?: string | null;
    subjectMemberRole?: Database["public"]["Enums"]["union_member_role_type"];
    partnerMemberRole?: Database["public"]["Enums"]["union_member_role_type"];
    unionStatus?: Database["public"]["Enums"]["union_status_type"];
    startDate?: string | null;
    startYear?: number | null;
    startDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    confirmWarnings?: boolean;
  }): Promise<{ personId: string; unionId: string }> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_union_with_new_person", {
      p_tree_id: args.treeId,
      p_subject_person_id: args.subjectPersonId,
      p_full_name: args.fullName,
      p_gender: args.gender || "unknown",
      p_living_status: args.livingStatus || "unknown",
      p_birth_date: args.birthDate || null,
      p_birth_year: args.birthYear || null,
      p_birth_date_precision: args.birthDatePrecision || "unknown",
      p_birth_is_estimated: args.birthIsEstimated || false,
      p_death_date: args.deathDate || null,
      p_death_year: args.deathYear || null,
      p_death_date_precision: args.deathDatePrecision || "unknown",
      p_death_is_estimated: args.deathIsEstimated || false,
      p_hometown_text: args.hometownText || null,
      p_occupation_text: args.occupationText || null,
      p_biography: args.biography || null,
      p_subject_member_role: args.subjectMemberRole || "spouse",
      p_partner_member_role: args.partnerMemberRole || "spouse",
      p_union_status: args.unionStatus || "active",
      p_start_date: args.startDate || null,
      p_start_year: args.startYear || null,
      p_start_date_precision: args.startDatePrecision || "unknown",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    const res = data as { person_id: string; union_id: string };
    return {
      personId: res.person_id,
      unionId: res.union_id,
    };
  }

  /**
   * Gọi RPC create_union_with_existing_person
   */
  static async createUnionWithExistingPerson(args: {
    treeId: string;
    person1Id: string;
    person2Id: string;
    member1Role?: Database["public"]["Enums"]["union_member_role_type"];
    member2Role?: Database["public"]["Enums"]["union_member_role_type"];
    unionStatus?: Database["public"]["Enums"]["union_status_type"];
    startDate?: string | null;
    startYear?: number | null;
    startDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
    confirmWarnings?: boolean;
  }): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_union_with_existing_person", {
      p_tree_id: args.treeId,
      p_person_1_id: args.person1Id,
      p_person_2_id: args.person2Id,
      p_member_1_role: args.member1Role || "spouse",
      p_member_2_role: args.member2Role || "spouse",
      p_union_status: args.unionStatus || "active",
      p_start_date: args.startDate || null,
      p_start_year: args.startYear || null,
      p_start_date_precision: args.startDatePrecision || "unknown",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    return data as string;
  }

  /**
   * Gọi RPC end_union
   */
  static async endUnion(args: {
    unionId: string;
    expectedVersion: number;
    newStatus: Database["public"]["Enums"]["union_status_type"];
    endDate?: string | null;
    endYear?: number | null;
    endDatePrecision?: Database["public"]["Enums"]["date_precision_type"];
  }): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("end_union", {
      p_union_id: args.unionId,
      p_expected_version: args.expectedVersion,
      p_new_status: args.newStatus,
      p_end_date: args.endDate || null,
      p_end_year: args.endYear || null,
      p_end_date_precision: args.endDatePrecision || "unknown",
    });

    if (error) {
      throw error;
    }

    return Boolean(data);
  }

  /**
   * Gọi RPC soft_delete_parent_child_relationship
   */
  static async softDeleteParentChildRelationship(
    relationshipId: string,
    expectedVersion: number
  ): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("soft_delete_parent_child_relationship", {
      p_relationship_id: relationshipId,
      p_expected_version: expectedVersion,
    });

    if (error) {
      throw error;
    }

    return Boolean(data);
  }

  /**
   * Gọi RPC soft_delete_union
   */
  static async softDeleteUnion(unionId: string, expectedVersion: number): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("soft_delete_union", {
      p_union_id: unionId,
      p_expected_version: expectedVersion,
    });

    if (error) {
      throw error;
    }

    return Boolean(data);
  }

  /**
   * Gọi RPC replace_parent_relationship
   */
  static async replaceParentRelationship(args: {
    treeId: string;
    oldRelationshipId: string;
    oldExpectedVersion: number;
    newParentId: string;
    childId: string;
    parentRole?: Database["public"]["Enums"]["parent_role_type"];
    relationshipKind?: Database["public"]["Enums"]["relationship_kind_type"];
    verificationStatus?: Database["public"]["Enums"]["verification_status_type"];
    confirmWarnings?: boolean;
  }): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("replace_parent_relationship", {
      p_tree_id: args.treeId,
      p_old_relationship_id: args.oldRelationshipId,
      p_old_expected_version: args.oldExpectedVersion,
      p_new_parent_id: args.newParentId,
      p_child_id: args.childId,
      p_parent_role: args.parentRole || "unspecified",
      p_relationship_kind: args.relationshipKind || "biological",
      p_verification_status: args.verificationStatus || "unverified",
      p_confirm_warnings: args.confirmWarnings || false,
    });

    if (error) {
      throw error;
    }

    return data as string;
  }

  /**
   * Tự động kiểm tra và thiết lập quan hệ vợ chồng (Spousal Union) giữa các cha mẹ của cùng một người con
   */
  static async ensureSpouseUnionForParents(
    treeId: string,
    childId: string,
    newParentId: string
  ): Promise<string | null> {
    const supabase = await createClient();

    // 1. Tìm các cha/mẹ khác của childId
    const { data: otherParents, error: pErr } = await supabase
      .from("parent_child_relationships")
      .select("parent_id, parent_role")
      .eq("tree_id", treeId)
      .eq("child_id", childId)
      .neq("parent_id", newParentId)
      .is("deleted_at", null);

    if (pErr || !otherParents || otherParents.length === 0) {
      return null;
    }

    for (const other of otherParents) {
      const otherParentId = other.parent_id;

      // 2. Tìm xem newParentId và otherParentId đã có union chung chưa
      const { data: myUnions } = await supabase
        .from("union_members")
        .select("union_id")
        .eq("tree_id", treeId)
        .eq("person_id", newParentId)
        .is("deleted_at", null);

      const myUnionIds = (myUnions || []).map((u) => u.union_id);

      let hasExistingUnion = false;
      if (myUnionIds.length > 0) {
        const { data: partnerInSameUnion } = await supabase
          .from("union_members")
          .select("id")
          .eq("tree_id", treeId)
          .in("union_id", myUnionIds)
          .eq("person_id", otherParentId)
          .is("deleted_at", null)
          .limit(1);

        if (partnerInSameUnion && partnerInSameUnion.length > 0) {
          hasExistingUnion = true;
        }
      }

      // 3. Nếu chưa có union chung, gọi RPC tạo union active giữa 2 người
      if (!hasExistingUnion) {
        try {
          const unionId = await this.createUnionWithExistingPerson({
            treeId,
            person1Id: newParentId,
            person2Id: otherParentId,
            member1Role: "spouse",
            member2Role: "spouse",
            unionStatus: "active",
            confirmWarnings: true,
          });
          return unionId;
        } catch (uErr) {
          console.warn("[ensureSpouseUnionForParents] Warning creating spousal union:", uErr);
        }
      }
    }

    return null;
  }
}

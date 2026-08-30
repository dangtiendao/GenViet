import "server-only";
import { createClient } from "@/lib/supabase/server";
import { TreeGraphDomainError, TREE_GRAPH_ERROR_CODES } from "../errors/tree-graph.errors";
import type { TreeGraphQueryInput } from "../schemas/tree-graph-query.schema";

export class TreeGraphRepository {
  /**
   * Gọi Database RPC get_tree_graph_slice để lấy lát cắt đồ thị phả hệ hoặc truy vấn toàn bộ cây
   */
  static async fetchTreeGraphSlice(input: TreeGraphQueryInput): Promise<Record<string, unknown>> {
    const supabase = await createClient();

    // Nếu yêu cầu xem toàn bộ cây, truy vấn toàn bộ dữ liệu của cây không giới hạn lát cắt
    if (input.fullTree) {
      return this.fetchFullTreeGraph(supabase, input);
    }

    const { data, error } = await supabase.rpc("get_tree_graph_slice", {
      p_tree_id: input.treeId,
      p_center_person_id: input.centerPersonId,
      p_ancestor_depth: input.ancestorDepth,
      p_descendant_depth: input.descendantDepth,
      p_include_spouses: input.includeSpouses,
      p_include_unverified: input.includeUnverified,
    });

    if (error) {
      const msg = error.message || "";
      const code = error.code || "";

      if (msg.includes("TREE_GRAPH_FORBIDDEN") || code === "42501") {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.FORBIDDEN);
      }
      if (msg.includes("TREE_GRAPH_UNAUTHORIZED")) {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.UNAUTHORIZED);
      }
      if (msg.includes("TREE_GRAPH_CENTER_DELETED")) {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.CENTER_DELETED);
      }
      if (msg.includes("TREE_GRAPH_CENTER_NOT_FOUND")) {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.CENTER_NOT_FOUND);
      }
      if (msg.includes("TREE_GRAPH_TREE_MISMATCH") || code === "40003") {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.TREE_MISMATCH);
      }
      if (msg.includes("TREE_GRAPH_DEPTH_INVALID") || code === "22023") {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.DEPTH_INVALID);
      }
      if (msg.includes("TREE_GRAPH_NOT_FOUND") || code === "P0002") {
        throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.NOT_FOUND);
      }

      throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.QUERY_FAILED, msg);
    }

    return (data as Record<string, unknown>) || {};
  }

  /**
   * Truy vấn 100% toàn bộ cây gia phả để mở toàn bộ các node mặc định
   */
  private static async fetchFullTreeGraph(
    supabase: Awaited<ReturnType<typeof createClient>>,
    input: TreeGraphQueryInput
  ): Promise<Record<string, unknown>> {
    const [personsRes, relsRes, unionsRes, membersRes] = await Promise.all([
      supabase
        .from("persons")
        .select(
          "id, full_name, gender, living_status, birth_date, birth_year, birth_date_precision, birth_is_estimated, death_date, death_year, death_date_precision, death_is_estimated, verification_status, avatar_path"
        )
        .eq("tree_id", input.treeId)
        .is("deleted_at", null),
      supabase
        .from("parent_child_relationships")
        .select("id, parent_id, child_id, parent_role, relationship_kind, verification_status")
        .eq("tree_id", input.treeId)
        .is("deleted_at", null),
      supabase
        .from("unions")
        .select(
          "id, status, start_date, start_year, start_date_precision, end_date, end_year, end_date_precision, verification_status"
        )
        .eq("tree_id", input.treeId)
        .is("deleted_at", null),
      supabase
        .from("union_members")
        .select("union_id, person_id, member_role")
        .eq("tree_id", input.treeId)
        .is("deleted_at", null),
    ]);

    if (personsRes.error) {
      throw new TreeGraphDomainError(TREE_GRAPH_ERROR_CODES.QUERY_FAILED, personsRes.error.message);
    }

    const persons = (personsRes.data || []).map((p) => ({
      id: p.id,
      fullName: p.full_name,
      gender: p.gender,
      livingStatus: p.living_status,
      birthDate: p.birth_date,
      birthYear: p.birth_year,
      birthDatePrecision: p.birth_date_precision,
      birthIsEstimated: p.birth_is_estimated,
      deathDate: p.death_date,
      deathYear: p.death_year,
      deathDatePrecision: p.death_date_precision,
      deathIsEstimated: p.death_is_estimated,
      verificationStatus: p.verification_status,
      avatarPath: p.avatar_path,
      isCenter: p.id === input.centerPersonId,
    }));

    const parentChildRelationships = (relsRes.data || []).map((r) => ({
      id: r.id,
      parentId: r.parent_id,
      childId: r.child_id,
      parentRole: r.parent_role,
      relationshipKind: r.relationship_kind,
      verificationStatus: r.verification_status,
    }));

    const unions = (unionsRes.data || []).map((u) => ({
      id: u.id,
      status: u.status,
      startDate: u.start_date,
      startYear: u.start_year,
      startDatePrecision: u.start_date_precision,
      endDate: u.end_date,
      endYear: u.end_year,
      endDatePrecision: u.end_date_precision,
      verificationStatus: u.verification_status,
    }));

    const unionMembers = (membersRes.data || []).map((m) => ({
      unionId: m.union_id,
      personId: m.person_id,
      memberRole: m.member_role,
    }));

    // Mở toàn bộ các node: hasMoreAncestors = false, hasMoreDescendants = false
    const expansion: Record<string, unknown> = {};
    for (const p of persons) {
      expansion[p.id] = {
        hasMoreAncestors: false,
        hasMoreDescendants: false,
        canAddFather: true,
        canAddMother: true,
        canExpandAncestors: false,
        canExpandDescendants: false,
        hasVerifiedBiologicalFather: false,
        hasVerifiedBiologicalMother: false,
      };
    }

    return {
      schemaVersion: 1,
      treeId: input.treeId,
      centerPersonId: input.centerPersonId,
      persons,
      parentChildRelationships,
      unions,
      unionMembers,
      expansion,
      limits: {
        requestedAncestorDepth: input.ancestorDepth,
        requestedDescendantDepth: input.descendantDepth,
        appliedAncestorDepth: input.ancestorDepth,
        appliedDescendantDepth: input.descendantDepth,
        maxAncestorDepth: 5,
        maxDescendantDepth: 5,
        maxPersonsBudget: 1000,
        maxRelationshipsBudget: 2000,
        maxUnionsBudget: 500,
        returnedPersonCount: persons.length,
        returnedRelationshipCount: parentChildRelationships.length,
        returnedUnionCount: unions.length,
        truncated: false,
      },
      truncated: false,
    };
  }
}

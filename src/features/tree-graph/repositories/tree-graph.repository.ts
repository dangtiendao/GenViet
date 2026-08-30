import "server-only";
import { createClient } from "@/lib/supabase/server";
import { TreeGraphDomainError, TREE_GRAPH_ERROR_CODES } from "../errors/tree-graph.errors";
import type { TreeGraphQueryInput } from "../schemas/tree-graph-query.schema";

export class TreeGraphRepository {
  /**
   * Gọi Database RPC get_tree_graph_slice để lấy lát cắt đồ thị phả hệ
   */
  static async fetchTreeGraphSlice(input: TreeGraphQueryInput): Promise<Record<string, unknown>> {
    const supabase = await createClient();

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
}

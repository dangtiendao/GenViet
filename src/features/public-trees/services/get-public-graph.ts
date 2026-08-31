import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import { buildPublicTreeCacheKey } from "../cache/public-tree-cache-key";
import type { PublicGraphDto } from "../contracts/public-graph.dto";

export interface GetPublicGraphParams {
  slug: string;
  centerPersonId?: string | null;
  ancestorDepth?: number;
  descendantDepth?: number;
  includeSpouses?: boolean;
  includeUnverified?: boolean;
  descendantTraversalMode?: string;
  branchBoundaryPersonId?: string | null;
}

export async function getPublicTreeGraph(
  params: GetPublicGraphParams
): Promise<{ data: PublicGraphDto; cacheKey: string }> {
  if (!params.slug) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE);
  }

  const supabase = await createClient();
  const cleanSlug = params.slug.toLowerCase().trim();

  const { data, error } = await supabase.rpc("get_public_tree_graph_slice", {
    p_slug: cleanSlug,
    p_center_person_id: params.centerPersonId || null,
    p_ancestor_depth: params.ancestorDepth ?? 15,
    p_descendant_depth: params.descendantDepth ?? 15,
    p_include_spouses: params.includeSpouses !== false,
    p_include_unverified: params.includeUnverified !== false,
    p_descendant_traversal_mode: params.descendantTraversalMode || "PATERNAL_LINE",
    p_branch_boundary_person_id: params.branchBoundaryPersonId || null,
  });

  if (error) {
    console.error("[getPublicTreeGraph] Supabase RPC Error:", error);
    const msg = error.message || "";
    if (msg.includes("PUBLIC_TREE_NOT_AVAILABLE") || error.code === "P0002") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE);
    }
    if (msg.includes("PUBLIC_GRAPH_CENTER_INVALID") || error.code === "22023") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.GRAPH_CENTER_INVALID);
    }
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.PROJECTION_FAILED, msg);
  }

  if (!data) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE);
  }

  const graphData = data as unknown as PublicGraphDto;
  const cacheKey = buildPublicTreeCacheKey({
    slug: cleanSlug,
    publicationVersion: graphData.tree?.publicationVersion || 0,
    projectionVersion: graphData.tree?.privacyProjectionVersion || 1,
    centerPersonId: graphData.centerPersonId,
    ancestorDepth: params.ancestorDepth,
    descendantDepth: params.descendantDepth,
    traversalMode: params.descendantTraversalMode,
  });

  return { data: graphData, cacheKey };
}

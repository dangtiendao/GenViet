import "server-only";
import { createClient } from "@/lib/supabase/server";
import { validatePublicationInput, type PublishTreePolicyInput } from "./publication-policy";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import { invalidatePublicTreeCache } from "../cache/public-tree-invalidation";

export async function publishFamilyTree(input: PublishTreePolicyInput): Promise<{
  treeId: string;
  publicSlug: string;
  publicationVersion: number;
  publishedAt: string;
  version: number;
}> {
  const { cleanSlug, livingPersonPolicy, searchEngineVisibility } = validatePublicationInput(input);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("publish_family_tree", {
    p_tree_id: input.treeId,
    p_slug: cleanSlug,
    p_living_person_policy: livingPersonPolicy,
    p_search_engine_visibility: searchEngineVisibility,
    p_expected_version: input.expectedVersion ?? null,
  });

  if (error) {
    const msg = error.message || "";
    if (msg.includes("PUBLISH_TREE_FORBIDDEN") || error.code === "42501") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.PUBLISH_FORBIDDEN);
    }
    if (msg.includes("PUBLIC_TREE_SLUG_CONFLICT") || error.code === "23505") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.SLUG_CONFLICT);
    }
    if (msg.includes("PUBLIC_TREE_VERSION_CONFLICT") || error.code === "40001") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.VERSION_CONFLICT);
    }
    if (msg.includes("PUBLIC_TREE_SLUG_INVALID") || msg.includes("PUBLIC_TREE_SLUG_RESERVED")) {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.SLUG_INVALID);
    }
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.UNKNOWN_ERROR, msg);
  }

  // Invalidate any stale cache for this slug
  invalidatePublicTreeCache(cleanSlug);

  return data as {
    treeId: string;
    publicSlug: string;
    publicationVersion: number;
    publishedAt: string;
    version: number;
  };
}

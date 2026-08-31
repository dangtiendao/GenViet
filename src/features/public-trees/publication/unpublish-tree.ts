import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import { invalidatePublicTreeCache } from "../cache/public-tree-invalidation";

export interface UnpublishTreeInput {
  treeId: string;
  expectedVersion?: number;
  currentSlug?: string;
}

export async function unpublishFamilyTree(input: UnpublishTreeInput): Promise<{
  treeId: string;
  privacyLevel: string;
  publicationVersion: number;
  version: number;
}> {
  if (!input.treeId) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_FOUND);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("unpublish_family_tree", {
    p_tree_id: input.treeId,
    p_expected_version: input.expectedVersion ?? null,
  });

  if (error) {
    const msg = error.message || "";
    if (msg.includes("UNPUBLISH_TREE_FORBIDDEN") || error.code === "42501") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.UNPUBLISH_FORBIDDEN);
    }
    if (msg.includes("PUBLIC_TREE_VERSION_CONFLICT") || error.code === "40001") {
      throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.VERSION_CONFLICT);
    }
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.UNKNOWN_ERROR, msg);
  }

  if (input.currentSlug) {
    invalidatePublicTreeCache(input.currentSlug);
  }

  return data as {
    treeId: string;
    privacyLevel: string;
    publicationVersion: number;
    version: number;
  };
}

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import type { PublicTreeDto } from "../contracts/public-tree.dto";

export async function getPublicTreeSummary(slug: string): Promise<PublicTreeDto> {
  if (!slug) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_tree_summary", {
    p_slug: slug.toLowerCase().trim(),
  });

  if (error || !data) {
    if (error) {
      console.error("[getPublicTreeSummary] Supabase RPC Error:", error);
    }
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_AVAILABLE, error?.message);
  }

  const tree = data as Record<string, unknown>;
  return {
    id: tree.id as string,
    slug: tree.slug as string,
    name: tree.name as string,
    description: (tree.description as string) || null,
    rootPersonId: (tree.rootPersonId as string) || null,
    generationAnchorPersonId: (tree.generationAnchorPersonId as string) || null,
    publicationVersion: Number(tree.publicationVersion || 0),
    privacyProjectionVersion: Number(tree.privacyProjectionVersion || 1),
    searchEngineVisibility: (tree.searchEngineVisibility as "NOINDEX" | "INDEX") || "NOINDEX",
    livingPersonPolicy: (tree.livingPersonPolicy as "REDACTED" | "STRICT") || "REDACTED",
    publishedAt: (tree.publishedAt as string) || null,
    publicUpdatedAt: (tree.publicUpdatedAt as string) || null,
  };
}

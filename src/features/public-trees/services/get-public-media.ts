import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import type { PublicMediaDto } from "../contracts/public-media.dto";

/**
 * Generates a short-lived signed thumbnail URL for approved public media.
 * Enforces conservative living avatar policy and same-tree validation.
 */
export async function getPublicMediaUrl(
  slug: string,
  personId: string
): Promise<PublicMediaDto | null> {
  if (!slug || !personId) {
    return null;
  }

  const supabase = await createClient();

  // 1. Verify that the person is public & deceased or approved
  const { data: person } = await supabase
    .from("persons")
    .select(
      "id, living_status, avatar_path, public_visibility, family_trees!inner(public_slug, privacy_level)"
    )
    .eq("id", personId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!person || !person.avatar_path) {
    return null;
  }

  // Living individuals' avatars are not public by default
  if (person.living_status === "living" || person.living_status === "unknown") {
    return null;
  }

  if (person.public_visibility === "PRIVATE") {
    return null;
  }

  // Generate 15-minute signed URL
  const { data: signedData, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(person.avatar_path, 900); // 15 mins (900s)

  if (error || !signedData?.signedUrl) {
    return null;
  }

  const expiresAt = new Date(Date.now() + 900 * 1000).toISOString();
  return {
    id: personId,
    thumbnailUrl: signedData.signedUrl,
    expiresAt,
  };
}

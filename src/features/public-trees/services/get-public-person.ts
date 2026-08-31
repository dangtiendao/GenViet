import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import type { PublicPersonProfileDto } from "../contracts/public-person.dto";

export async function getPublicPersonProfile(
  slug: string,
  personId: string
): Promise<PublicPersonProfileDto> {
  if (!slug || !personId) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.PERSON_NOT_AVAILABLE);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_person_profile", {
    p_slug: slug.toLowerCase().trim(),
    p_person_id: personId,
  });

  if (error || !data) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.PERSON_NOT_AVAILABLE);
  }

  return data as unknown as PublicPersonProfileDto;
}

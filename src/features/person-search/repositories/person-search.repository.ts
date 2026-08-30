import { createClient } from "@/lib/supabase/server";
import type { PersonSearchQueryParams } from "../types/person-search.types";
import { decodeSearchCursor } from "../utils/search-cursor";
import type { RawSearchRow } from "../mappers/person-search.mapper";
import { PersonSearchDomainError, PERSON_SEARCH_ERROR_CODES } from "../errors/person-search.errors";

export class PersonSearchRepository {
  /**
   * Gọi RPC search_persons_in_tree dưới quyền user session hiện tại
   */
  static async searchPersonsInTree(params: PersonSearchQueryParams): Promise<RawSearchRow[]> {
    const supabase = await createClient();

    const cursorPayload = decodeSearchCursor(params.cursor);

    const { data, error } = await (supabase.rpc as any)("search_persons_in_tree", {
      p_tree_id: params.treeId,
      p_query: params.query || null,
      p_birth_year: params.birthYear || null,
      p_living_status: params.livingStatus || null,
      p_missing_information: params.missingInformation || null,
      p_cursor_rank_tier: cursorPayload?.rankTier ?? null,
      p_cursor_similarity: cursorPayload?.similarity ?? null,
      p_cursor_normalized_name: cursorPayload?.normalizedName ?? null,
      p_cursor_birth_year: cursorPayload?.birthYear ?? null,
      p_cursor_id: cursorPayload?.id ?? null,
      p_limit: params.limit || 20,
    });

    if (error) {
      const msg = error.message || "";
      if (
        error.code === "42501" ||
        msg.includes("PERSON_SEARCH_FORBIDDEN") ||
        msg.includes("permission denied")
      ) {
        throw new PersonSearchDomainError(PERSON_SEARCH_ERROR_CODES.FORBIDDEN);
      }
      if (msg.includes("unaccent") || msg.includes("pg_trgm")) {
        throw new PersonSearchDomainError(PERSON_SEARCH_ERROR_CODES.EXTENSION_UNAVAILABLE);
      }
      throw new PersonSearchDomainError(
        PERSON_SEARCH_ERROR_CODES.QUERY_FAILED,
        `Truy vấn tìm kiếm thất bại: ${msg}`
      );
    }

    return (data as unknown as RawSearchRow[]) || [];
  }
}

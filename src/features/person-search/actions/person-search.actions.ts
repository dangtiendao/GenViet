"use server";

import { requireUser } from "@/lib/auth/require-user";
import { PersonSearchService } from "../services/person-search.service";
import type { PersonSearchQueryParams, PersonSearchResponse } from "../types/person-search.types";
import { PersonSearchDomainError } from "../errors/person-search.errors";

export type SearchActionResult =
  | { success: true; data: PersonSearchResponse }
  | { success: false; error: { code: string; message: string } };

export async function searchPeopleAction(
  params: PersonSearchQueryParams
): Promise<SearchActionResult> {
  try {
    await requireUser();

    const data = await PersonSearchService.searchPeople(params);
    return {
      success: true,
      data,
    };
  } catch (err) {
    if (err instanceof PersonSearchDomainError) {
      return {
        success: false,
        error: { code: err.code, message: err.message },
      };
    }
    return {
      success: false,
      error: {
        code: "PERSON_SEARCH_UNKNOWN_ERROR",
        message: err instanceof Error ? err.message : "Lỗi tìm kiếm nhân vật.",
      },
    };
  }
}

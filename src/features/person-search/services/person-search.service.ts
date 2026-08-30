import { personSearchQuerySchema } from "../schemas/person-search.schema";
import { PersonSearchRepository } from "../repositories/person-search.repository";
import { mapSearchResultsToResponse } from "../mappers/person-search.mapper";
import { normalizeVietnamese } from "../utils/normalize-vietnamese";
import type { PersonSearchQueryParams, PersonSearchResponse } from "../types/person-search.types";
import { PersonSearchDomainError, PERSON_SEARCH_ERROR_CODES } from "../errors/person-search.errors";

export class PersonSearchService {
  /**
   * Thực thi tìm kiếm nhân vật và áp dụng bộ lọc theo Tree
   */
  static async searchPeople(rawInput: PersonSearchQueryParams): Promise<PersonSearchResponse> {
    const parseResult = personSearchQuerySchema.safeParse(rawInput);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      throw new PersonSearchDomainError(
        PERSON_SEARCH_ERROR_CODES.QUERY_INVALID,
        firstIssue?.message || "Tham số tìm kiếm không hợp lệ."
      );
    }

    const validated = parseResult.data;
    const normalizedQuery = normalizeVietnamese(validated.query);

    const rawRows = await PersonSearchRepository.searchPersonsInTree({
      treeId: validated.treeId,
      query: validated.query,
      birthYear: validated.birthYear,
      livingStatus: validated.livingStatus,
      missingInformation: validated.missingInformation,
      cursor: validated.cursor,
      limit: validated.limit,
    });

    return mapSearchResultsToResponse(
      rawRows,
      validated.limit,
      {
        query: validated.query,
        birthYear: validated.birthYear,
        livingStatus: validated.livingStatus,
        missingInformation: validated.missingInformation,
      },
      normalizedQuery
    );
  }
}

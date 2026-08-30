import type {
  TreeGraphDto,
  GraphPersonDto,
  ParentChildRelationshipDto,
  UnionDto,
  UnionMemberDto,
  ExpansionDto,
  LimitsDto,
} from "../types/tree-graph.types";
import { TreeGraphDomainError, TREE_GRAPH_ERROR_CODES } from "../errors/tree-graph.errors";

/**
 * Ánh xạ và kiểm tra tính toàn vẹn của dữ liệu lát cắt đồ thị (Graph Consistency Validator)
 */
export class TreeGraphMapper {
  /**
   * Chuyển đổi payload thô từ Database RPC sang TreeGraphDto chuẩn mực
   */
  static mapToTreeGraphDto(raw: Record<string, unknown>): TreeGraphDto {
    if (!raw || typeof raw !== "object") {
      throw new TreeGraphDomainError(
        TREE_GRAPH_ERROR_CODES.INCONSISTENT,
        "Dữ liệu đồ thị thô không hợp lệ."
      );
    }

    const schemaVersion = Number(raw.schemaVersion) || 1;
    const treeId = String(raw.treeId || "");
    const centerPersonId = String(raw.centerPersonId || "");

    const rawPersons = Array.isArray(raw.persons) ? raw.persons : [];
    const rawRels = Array.isArray(raw.parentChildRelationships) ? raw.parentChildRelationships : [];
    const rawUnions = Array.isArray(raw.unions) ? raw.unions : [];
    const rawUnionMembers = Array.isArray(raw.unionMembers) ? raw.unionMembers : [];
    const rawExpansion = typeof raw.expansion === "object" && raw.expansion ? raw.expansion : {};
    const rawLimits =
      typeof raw.limits === "object" && raw.limits ? (raw.limits as Record<string, unknown>) : {};

    // 1. Map và khử trùng lặp Persons
    const personMap = new Map<string, GraphPersonDto>();
    for (const p of rawPersons) {
      if (!p || typeof p !== "object") continue;
      const pObj = p as Record<string, unknown>;
      const id = String(pObj.id || "");
      if (!id || personMap.has(id)) continue;

      personMap.set(id, {
        id,
        fullName: String(pObj.fullName || ""),
        gender: (pObj.gender as GraphPersonDto["gender"]) || "unknown",
        livingStatus: (pObj.livingStatus as GraphPersonDto["livingStatus"]) || "unknown",
        birthDate: pObj.birthDate ? String(pObj.birthDate) : null,
        birthYear:
          pObj.birthYear !== null && pObj.birthYear !== undefined ? Number(pObj.birthYear) : null,
        birthDatePrecision:
          (pObj.birthDatePrecision as GraphPersonDto["birthDatePrecision"]) || "unknown",
        birthIsEstimated: Boolean(pObj.birthIsEstimated),
        deathDate: pObj.deathDate ? String(pObj.deathDate) : null,
        deathYear:
          pObj.deathYear !== null && pObj.deathYear !== undefined ? Number(pObj.deathYear) : null,
        deathDatePrecision:
          (pObj.deathDatePrecision as GraphPersonDto["deathDatePrecision"]) || "unknown",
        deathIsEstimated: Boolean(pObj.deathIsEstimated),
        verificationStatus:
          (pObj.verificationStatus as GraphPersonDto["verificationStatus"]) || "unverified",
        isCenter: Boolean(pObj.isCenter),
      });
    }

    const persons = Array.from(personMap.values()).sort(
      (a, b) => a.fullName.localeCompare(b.fullName, "vi") || a.id.localeCompare(b.id)
    );

    // Kiểm tra Center Person phải nằm trong danh sách persons
    if (centerPersonId && !personMap.has(centerPersonId)) {
      throw new TreeGraphDomainError(
        TREE_GRAPH_ERROR_CODES.INCONSISTENT,
        "Nhân vật trung tâm không tồn tại trong danh sách persons của lát cắt."
      );
    }

    // 2. Map và loại bỏ quan hệ mồ côi (Dangling Relationships)
    const relMap = new Map<string, ParentChildRelationshipDto>();
    for (const r of rawRels) {
      if (!r || typeof r !== "object") continue;
      const rObj = r as Record<string, unknown>;
      const id = String(rObj.id || "");
      const parentId = String(rObj.parentId || "");
      const childId = String(rObj.childId || "");

      // Chỉ giữ các cạnh mà cả parent và child đều nằm trong persons DTO
      if (
        id &&
        parentId &&
        childId &&
        personMap.has(parentId) &&
        personMap.has(childId) &&
        !relMap.has(id)
      ) {
        relMap.set(id, {
          id,
          parentId,
          childId,
          parentRole:
            (rObj.parentRole as ParentChildRelationshipDto["parentRole"]) || "unspecified",
          relationshipKind:
            (rObj.relationshipKind as ParentChildRelationshipDto["relationshipKind"]) ||
            "biological",
          verificationStatus:
            (rObj.verificationStatus as ParentChildRelationshipDto["verificationStatus"]) ||
            "unverified",
        });
      }
    }

    const parentChildRelationships = Array.from(relMap.values()).sort(
      (a, b) =>
        a.parentId.localeCompare(b.parentId) ||
        a.childId.localeCompare(b.childId) ||
        a.id.localeCompare(b.id)
    );

    // 3. Map Unions
    const unionMap = new Map<string, UnionDto>();
    for (const u of rawUnions) {
      if (!u || typeof u !== "object") continue;
      const uObj = u as Record<string, unknown>;
      const id = String(uObj.id || "");
      if (!id || unionMap.has(id)) continue;

      unionMap.set(id, {
        id,
        status: (uObj.status as UnionDto["status"]) || "active",
        startDate: uObj.startDate ? String(uObj.startDate) : null,
        startYear:
          uObj.startYear !== null && uObj.startYear !== undefined ? Number(uObj.startYear) : null,
        startDatePrecision:
          (uObj.startDatePrecision as UnionDto["startDatePrecision"]) || "unknown",
        endDate: uObj.endDate ? String(uObj.endDate) : null,
        endYear: uObj.endYear !== null && uObj.endYear !== undefined ? Number(uObj.endYear) : null,
        endDatePrecision: (uObj.endDatePrecision as UnionDto["endDatePrecision"]) || "unknown",
        verificationStatus:
          (uObj.verificationStatus as UnionDto["verificationStatus"]) || "unverified",
      });
    }

    const unions = Array.from(unionMap.values()).sort((a, b) => a.id.localeCompare(b.id));

    // 4. Map Union Members (chỉ giữ nếu Union và Person đều tồn tại)
    const unionMemberMap = new Map<string, UnionMemberDto>();
    for (const um of rawUnionMembers) {
      if (!um || typeof um !== "object") continue;
      const umObj = um as Record<string, unknown>;
      const unionId = String(umObj.unionId || "");
      const personId = String(umObj.personId || "");
      const pairKey = `${unionId}:${personId}`;

      if (
        unionId &&
        personId &&
        unionMap.has(unionId) &&
        personMap.has(personId) &&
        !unionMemberMap.has(pairKey)
      ) {
        unionMemberMap.set(pairKey, {
          unionId,
          personId,
          memberRole: (umObj.memberRole as UnionMemberDto["memberRole"]) || "spouse",
        });
      }
    }

    const unionMembers = Array.from(unionMemberMap.values()).sort(
      (a, b) => a.unionId.localeCompare(b.unionId) || a.personId.localeCompare(b.personId)
    );

    // 5. Map Expansion Metadata
    const expansion: Record<string, ExpansionDto> = {};
    const expansionObj = rawExpansion as Record<string, Record<string, unknown>>;
    for (const [pId, exp] of Object.entries(expansionObj)) {
      if (personMap.has(pId) && exp && typeof exp === "object") {
        expansion[pId] = {
          hasMoreAncestors: Boolean(exp.hasMoreAncestors),
          hasMoreDescendants: Boolean(exp.hasMoreDescendants),
          canAddFather: Boolean(exp.canAddFather),
          canAddMother: Boolean(exp.canAddMother),
          canExpandAncestors: Boolean(exp.canExpandAncestors),
          canExpandDescendants: Boolean(exp.canExpandDescendants),
          hasVerifiedBiologicalFather: Boolean(exp.hasVerifiedBiologicalFather),
          hasVerifiedBiologicalMother: Boolean(exp.hasVerifiedBiologicalMother),
        };
      }
    }

    // 6. Map Limits Metadata
    const limits: LimitsDto = {
      requestedAncestorDepth: Number(rawLimits.requestedAncestorDepth) || 2,
      requestedDescendantDepth: Number(rawLimits.requestedDescendantDepth) || 2,
      appliedAncestorDepth: Number(rawLimits.appliedAncestorDepth) || 2,
      appliedDescendantDepth: Number(rawLimits.appliedDescendantDepth) || 2,
      maxAncestorDepth: Number(rawLimits.maxAncestorDepth) || 5,
      maxDescendantDepth: Number(rawLimits.maxDescendantDepth) || 5,
      maxPersonsBudget: Number(rawLimits.maxPersonsBudget) || 250,
      maxRelationshipsBudget: Number(rawLimits.maxRelationshipsBudget) || 500,
      maxUnionsBudget: Number(rawLimits.maxUnionsBudget) || 150,
      returnedPersonCount: persons.length,
      returnedRelationshipCount: parentChildRelationships.length,
      returnedUnionCount: unions.length,
      truncated: Boolean(raw.truncated || rawLimits.truncated),
      truncatedReason: rawLimits.truncatedReason ? String(rawLimits.truncatedReason) : null,
    };

    const warnings: string[] = Array.isArray(raw.warnings) ? raw.warnings.map(String) : [];

    return {
      schemaVersion,
      treeId,
      centerPersonId,
      persons,
      parentChildRelationships,
      unions,
      unionMembers,
      expansion,
      limits,
      truncated: limits.truncated,
      warnings,
    };
  }
}

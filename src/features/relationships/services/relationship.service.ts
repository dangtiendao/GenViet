import "server-only";
import { RelationshipRepository } from "../repositories/relationship.repository";
import { RelationshipDomainError, RELATIONSHIP_ERROR_CODES } from "../errors/relationship.errors";
import { PersonRepository } from "@/features/persons/repositories/person.repository";
import { mapPartialDateToDatabase } from "@/features/persons/utils/partial-date-mapper";
import { normalizePersonName } from "@/features/persons/utils/normalize-person-name";
import type {
  AddNewParentInput,
  LinkExistingParentInput,
  AddNewChildInput,
  LinkExistingChildInput,
  AddNewSiblingInput,
  LinkExistingSiblingInput,
  CreateUnionWithNewPersonInput,
  CreateUnionWithExistingPersonInput,
  EndUnionInput,
  SoftDeleteRelationshipInput,
  SoftDeleteUnionInput,
  ReplaceParentRelationshipInput,
} from "../schemas/relationship.schema";
import type {
  RelatedPersonCandidate,
  ParentWithDetails,
  SpouseWithDetails,
} from "../types/relationship.types";

function mapDatabaseError(error: unknown): never {
  if (error instanceof RelationshipDomainError) {
    throw error;
  }

  const err = error as { message?: string; code?: string };
  const msg = err?.message || "";

  if (msg.includes("RELATIONSHIP_CYCLE") || err?.code === "40002") {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.CYCLE);
  }
  if (msg.includes("RELATIONSHIP_SELF_LINK") || msg.includes("chk_parent_child_not_self")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.SELF_LINK);
  }
  if (msg.includes("UNION_SELF_LINK")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.UNION_SELF_LINK);
  }
  if (msg.includes("RELATIONSHIP_DUPLICATE") || msg.includes("idx_parent_child_active_unique")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.DUPLICATE);
  }
  if (msg.includes("idx_union_members_active_unique")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.UNION_DUPLICATE);
  }
  if (msg.includes("WARNING_EXISTING_VERIFIED_PARENT")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.EXISTING_VERIFIED_FATHER);
  }
  if (msg.includes("RELATIONSHIP_VERSION_CONFLICT") || msg.includes("UNION_VERSION_CONFLICT")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.VERSION_CONFLICT);
  }
  if (msg.includes("RELATIONSHIP_TREE_MISMATCH")) {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.TREE_MISMATCH);
  }
  if (msg.includes("Forbidden") || err?.code === "42501") {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.FORBIDDEN);
  }
  if (msg.includes("not found") || err?.code === "P0002") {
    throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.NOT_FOUND);
  }

  throw new RelationshipDomainError(RELATIONSHIP_ERROR_CODES.UNKNOWN_ERROR, msg);
}

export class RelationshipService {
  /**
   * Tìm kiếm ứng viên để liên kết trong cùng cây
   */
  static async findPotentialCandidates(
    treeId: string,
    excludePersonId: string,
    searchQuery?: string
  ): Promise<RelatedPersonCandidate[]> {
    try {
      return await RelationshipRepository.findPotentialCandidates(
        treeId,
        excludePersonId,
        searchQuery
      );
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Thêm cha/mẹ mới (Tạo Person + Quan hệ trong 1 transaction)
   */
  static async addNewParent(
    userId: string,
    input: AddNewParentInput
  ): Promise<{ personId: string; relationshipId: string }> {
    try {
      const result = await RelationshipRepository.createPersonWithParentRelationship({
        treeId: input.treeId,
        childId: input.childId,
        fullName: input.fullName,
        gender: input.gender,
        livingStatus: input.livingStatus,
        birthDate: input.birthDate,
        birthYear: input.birthYear,
        birthDatePrecision: input.birthPrecision,
        birthIsEstimated: input.birthIsEstimated,
        deathDate: input.deathDate,
        deathYear: input.deathYear,
        deathDatePrecision: input.deathPrecision,
        deathIsEstimated: input.deathIsEstimated,
        hometownText: input.hometownText,
        occupationText: input.occupationText,
        biography: input.biography,
        parentRole: input.parentRole,
        relationshipKind: input.relationshipKind,
        verificationStatus: input.verificationStatus,
        confirmWarnings: input.confirmWarnings,
      });

      // Tự động kiểm tra và tạo liên kết hôn phối giữa các cha mẹ của cùng một người con
      await RelationshipRepository.ensureSpouseUnionForParents(
        input.treeId,
        input.childId,
        result.personId
      );

      return result;
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Liên kết cha/mẹ có sẵn
   */
  static async linkExistingParent(userId: string, input: LinkExistingParentInput): Promise<string> {
    try {
      const relId = await RelationshipRepository.linkExistingParent({
        treeId: input.treeId,
        parentId: input.parentId,
        childId: input.childId,
        parentRole: input.parentRole,
        relationshipKind: input.relationshipKind,
        verificationStatus: input.verificationStatus,
        confirmWarnings: input.confirmWarnings,
      });

      // Tự động kiểm tra và tạo liên kết hôn phối giữa các cha mẹ của cùng một người con
      await RelationshipRepository.ensureSpouseUnionForParents(
        input.treeId,
        input.childId,
        input.parentId
      );

      return relId;
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Thêm con mới (Tạo Person con + Quan hệ với cha/mẹ trong 1 transaction)
   */
  static async addNewChild(
    userId: string,
    input: AddNewChildInput
  ): Promise<{ personId: string; relationshipId: string; otherRelationshipId?: string }> {
    try {
      return await RelationshipRepository.createPersonWithChildRelationship({
        treeId: input.treeId,
        parentId: input.parentId,
        fullName: input.fullName,
        gender: input.gender,
        livingStatus: input.livingStatus,
        birthDate: input.birthDate,
        birthYear: input.birthYear,
        birthDatePrecision: input.birthPrecision,
        birthIsEstimated: input.birthIsEstimated,
        deathDate: input.deathDate,
        deathYear: input.deathYear,
        deathDatePrecision: input.deathPrecision,
        deathIsEstimated: input.deathIsEstimated,
        hometownText: input.hometownText,
        occupationText: input.occupationText,
        biography: input.biography,
        parentRole: input.parentRole,
        relationshipKind: input.relationshipKind,
        verificationStatus: input.verificationStatus,
        otherParentId: input.otherParentId,
        otherParentRole: input.otherParentRole,
        otherRelationshipKind: input.otherRelationshipKind,
        confirmWarnings: input.confirmWarnings,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Liên kết con có sẵn
   */
  static async linkExistingChild(userId: string, input: LinkExistingChildInput): Promise<string> {
    try {
      return await RelationshipRepository.linkExistingChild({
        treeId: input.treeId,
        parentId: input.parentId,
        childId: input.childId,
        parentRole: input.parentRole,
        relationshipKind: input.relationshipKind,
        verificationStatus: input.verificationStatus,
        otherParentId: input.otherParentId,
        otherParentRole: input.otherParentRole,
        otherRelationshipKind: input.otherRelationshipKind,
        confirmWarnings: input.confirmWarnings,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Lấy danh sách cha/mẹ hiện có của nhân vật kèm tên và giới tính
   */
  static async getParentsWithDetails(
    treeId: string,
    personId: string
  ): Promise<ParentWithDetails[]> {
    try {
      return await RelationshipRepository.getParentsWithDetails(treeId, personId);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Lấy danh sách vợ/chồng (phối ngẫu) hiện có của nhân vật kèm tên và giới tính
   */
  static async getSpousesWithDetails(
    treeId: string,
    personId: string
  ): Promise<SpouseWithDetails[]> {
    try {
      return await RelationshipRepository.getSpousesWithDetails(treeId, personId);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Thêm anh/chị/em mới và tự động liên kết với các cha mẹ được chọn
   */
  static async addNewSibling(
    userId: string,
    input: AddNewSiblingInput
  ): Promise<{ personId: string; relationshipIds: string[] }> {
    try {
      const birthDb = mapPartialDateToDatabase(
        input.birthPrecision === "exact" && input.birthDate
          ? {
              precision: "exact",
              year: parseInt(input.birthDate.split("-")[0], 10),
              month: parseInt(input.birthDate.split("-")[1], 10),
              day: parseInt(input.birthDate.split("-")[2], 10),
              isEstimated: input.birthIsEstimated,
            }
          : input.birthPrecision === "year" && input.birthYear
            ? {
                precision: "year",
                year: input.birthYear,
                month: null,
                day: null,
                isEstimated: input.birthIsEstimated,
              }
            : {
                precision: "unknown",
                year: null,
                month: null,
                day: null,
                isEstimated: false,
              }
      );

      const deathDb = mapPartialDateToDatabase(
        input.deathPrecision === "exact" && input.deathDate
          ? {
              precision: "exact",
              year: parseInt(input.deathDate.split("-")[0], 10),
              month: parseInt(input.deathDate.split("-")[1], 10),
              day: parseInt(input.deathDate.split("-")[2], 10),
              isEstimated: input.deathIsEstimated,
            }
          : input.deathPrecision === "year" && input.deathYear
            ? {
                precision: "year",
                year: input.deathYear,
                month: null,
                day: null,
                isEstimated: input.deathIsEstimated,
              }
            : {
                precision: "unknown",
                year: null,
                month: null,
                day: null,
                isEstimated: false,
              }
      );

      // 1. Tạo nhân vật mới
      const newPerson = await PersonRepository.createPerson({
        tree_id: input.treeId,
        full_name: input.fullName,
        normalized_name: normalizePersonName(input.fullName),
        gender: input.gender,
        living_status: input.livingStatus,
        birth_date: birthDb.date,
        birth_year: birthDb.year,
        birth_date_precision: birthDb.precision,
        birth_is_estimated: birthDb.isEstimated,
        death_date: deathDb.date,
        death_year: deathDb.year,
        death_date_precision: deathDb.precision,
        death_is_estimated: deathDb.isEstimated,
        hometown_text: input.hometownText,
        occupation_text: input.occupationText,
        biography: input.biography,
        verification_status: input.verificationStatus,
        created_by: userId,
        updated_by: userId,
      });

      const relationshipIds: string[] = [];

      // 2. Lấy thông tin vai trò của các cha mẹ của siblingId
      const existingParents = await RelationshipRepository.getParentsWithDetails(
        input.treeId,
        input.siblingId
      );
      const roleMap = new Map(existingParents.map((p) => [p.parentId, p.parentRole]));

      // 3. Liên kết với từng cha mẹ được chọn
      for (const parentId of input.parentIds) {
        const parentRole = roleMap.get(parentId) || "unspecified";
        const relId = await RelationshipRepository.linkExistingChild({
          treeId: input.treeId,
          parentId,
          childId: newPerson.id,
          parentRole,
          relationshipKind: input.relationshipKind,
          verificationStatus: input.verificationStatus,
          confirmWarnings: input.confirmWarnings,
        });
        relationshipIds.push(relId);
      }

      return {
        personId: newPerson.id,
        relationshipIds,
      };
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Liên kết một người có sẵn làm anh/chị/em (gắn vào các cha mẹ được chọn)
   */
  static async linkExistingSibling(
    userId: string,
    input: LinkExistingSiblingInput
  ): Promise<{ relationshipIds: string[] }> {
    try {
      const relationshipIds: string[] = [];

      const existingParents = await RelationshipRepository.getParentsWithDetails(
        input.treeId,
        input.siblingId
      );
      const roleMap = new Map(existingParents.map((p) => [p.parentId, p.parentRole]));

      for (const parentId of input.parentIds) {
        const parentRole = roleMap.get(parentId) || "unspecified";
        const relId = await RelationshipRepository.linkExistingChild({
          treeId: input.treeId,
          parentId,
          childId: input.targetPersonId,
          parentRole,
          relationshipKind: input.relationshipKind,
          verificationStatus: input.verificationStatus,
          confirmWarnings: input.confirmWarnings,
        });
        relationshipIds.push(relId);
      }

      return { relationshipIds };
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Tạo Union với phối ngẫu mới
   */
  static async createUnionWithNewPerson(
    userId: string,
    input: CreateUnionWithNewPersonInput
  ): Promise<{ personId: string; unionId: string }> {
    try {
      return await RelationshipRepository.createUnionWithNewPerson({
        treeId: input.treeId,
        subjectPersonId: input.subjectPersonId,
        fullName: input.fullName,
        gender: input.gender,
        livingStatus: input.livingStatus,
        birthDate: input.birthDate,
        birthYear: input.birthYear,
        birthDatePrecision: input.birthPrecision,
        birthIsEstimated: input.birthIsEstimated,
        deathDate: input.deathDate,
        deathYear: input.deathYear,
        deathDatePrecision: input.deathPrecision,
        deathIsEstimated: input.deathIsEstimated,
        hometownText: input.hometownText,
        occupationText: input.occupationText,
        biography: input.biography,
        subjectMemberRole: input.subjectMemberRole,
        partnerMemberRole: input.partnerMemberRole,
        unionStatus: input.unionStatus,
        startDate: input.startDate,
        startYear: input.startYear,
        startDatePrecision: input.startDatePrecision,
        confirmWarnings: input.confirmWarnings,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Tạo Union giữa 2 Person có sẵn
   */
  static async createUnionWithExistingPerson(
    userId: string,
    input: CreateUnionWithExistingPersonInput
  ): Promise<string> {
    try {
      return await RelationshipRepository.createUnionWithExistingPerson({
        treeId: input.treeId,
        person1Id: input.person1Id,
        person2Id: input.person2Id,
        member1Role: input.member1Role,
        member2Role: input.member2Role,
        unionStatus: input.unionStatus,
        startDate: input.startDate,
        startYear: input.startYear,
        startDatePrecision: input.startDatePrecision,
        confirmWarnings: input.confirmWarnings,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Kết thúc quan hệ hôn nhân
   */
  static async endUnion(userId: string, treeId: string, input: EndUnionInput): Promise<boolean> {
    try {
      return await RelationshipRepository.endUnion({
        unionId: input.unionId,
        expectedVersion: input.expectedVersion,
        newStatus: input.newStatus,
        endDate: input.endDate,
        endYear: input.endYear,
        endDatePrecision: input.endDatePrecision,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Xóa mềm quan hệ cha-con
   */
  static async softDeleteRelationship(
    userId: string,
    treeId: string,
    input: SoftDeleteRelationshipInput
  ): Promise<boolean> {
    try {
      return await RelationshipRepository.softDeleteParentChildRelationship(
        input.relationshipId,
        input.expectedVersion
      );
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Xóa mềm Union
   */
  static async softDeleteUnion(
    userId: string,
    treeId: string,
    input: SoftDeleteUnionInput
  ): Promise<boolean> {
    try {
      return await RelationshipRepository.softDeleteUnion(input.unionId, input.expectedVersion);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Thay thế nguyên tử quan hệ cha/mẹ
   */
  static async replaceParentRelationship(
    userId: string,
    input: ReplaceParentRelationshipInput
  ): Promise<string> {
    try {
      return await RelationshipRepository.replaceParentRelationship({
        treeId: input.treeId,
        oldRelationshipId: input.oldRelationshipId,
        oldExpectedVersion: input.oldExpectedVersion,
        newParentId: input.newParentId,
        childId: input.childId,
        parentRole: input.parentRole,
        relationshipKind: input.relationshipKind,
        verificationStatus: input.verificationStatus,
        confirmWarnings: input.confirmWarnings,
      });
    } catch (error) {
      return mapDatabaseError(error);
    }
  }
}

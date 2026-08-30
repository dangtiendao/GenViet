import "server-only";
import { RelationshipRepository } from "../repositories/relationship.repository";
import {
  RelationshipDomainError,
  RELATIONSHIP_ERROR_CODES,
} from "../errors/relationship.errors";
import type {
  AddNewParentInput,
  LinkExistingParentInput,
  AddNewChildInput,
  LinkExistingChildInput,
  CreateUnionWithNewPersonInput,
  CreateUnionWithExistingPersonInput,
  EndUnionInput,
  SoftDeleteRelationshipInput,
  SoftDeleteUnionInput,
  ReplaceParentRelationshipInput,
} from "../schemas/relationship.schema";
import type { RelatedPersonCandidate } from "../types/relationship.types";

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
      return await RelationshipRepository.createPersonWithParentRelationship({
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
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  /**
   * Liên kết cha/mẹ có sẵn
   */
  static async linkExistingParent(userId: string, input: LinkExistingParentInput): Promise<string> {
    try {
      return await RelationshipRepository.linkExistingParent({
        treeId: input.treeId,
        parentId: input.parentId,
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
        confirmWarnings: input.confirmWarnings,
      });
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

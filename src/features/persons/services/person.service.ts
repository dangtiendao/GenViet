import { createClient } from "@/lib/supabase/server";
import { PersonRepository } from "../repositories/person.repository";
import {
  minimalCreatePersonSchema,
  createPersonSchema,
  updatePersonSchema,
  softDeletePersonSchema,
  restorePersonSchema,
  type MinimalCreatePersonInput,
  type CreatePersonInput,
  type UpdatePersonInput,
  type SoftDeletePersonInput,
  type RestorePersonInput,
} from "../schemas/person.schema";
import { PersonError, PERSON_ERROR_CODES } from "../errors/person.errors";
import { mapPartialDateToDatabase } from "../utils/partial-date-mapper";
import { normalizePersonName } from "../utils/normalize-person-name";
import type { Person, PersonDetail, SimilarPersonCandidate } from "../types/person.types";

export interface CreatePersonResult {
  isWarning?: boolean;
  warningCandidates?: SimilarPersonCandidate[];
  person?: Person;
}

export class PersonService {
  /**
   * Tạo nhân vật tối giản (Minimal Create)
   */
  static async createMinimalPerson(
    userId: string,
    rawInput: MinimalCreatePersonInput
  ): Promise<CreatePersonResult> {
    const parseResult = minimalCreatePersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new PersonError(PERSON_ERROR_CODES.NAME_INVALID, parseResult.error.errors[0]?.message);
    }

    const {
      treeId,
      fullName,
      gender,
      livingStatus,
      birthPrecision,
      birthDate,
      birthYear,
      birthIsEstimated,
      confirmSimilar,
    } = parseResult.data;

    // 1. Kiểm tra ứng viên tương tự nếu chưa xác nhận bỏ qua cảnh báo
    if (!confirmSimilar) {
      const normName = normalizePersonName(fullName);
      const candidates = await PersonRepository.findSimilarPeople(treeId, normName, birthYear);
      if (candidates.length > 0) {
        return {
          isWarning: true,
          warningCandidates: candidates,
        };
      }
    }

    // 2. Map Partial Date
    const birthDb = mapPartialDateToDatabase(
      birthPrecision === "exact" && birthDate
        ? {
            precision: "exact",
            year: parseInt(birthDate.split("-")[0], 10),
            month: parseInt(birthDate.split("-")[1], 10),
            day: parseInt(birthDate.split("-")[2], 10),
            isEstimated: birthIsEstimated,
          }
        : birthPrecision === "year" && birthYear
          ? {
              precision: "year",
              year: birthYear,
              month: null,
              day: null,
              isEstimated: birthIsEstimated,
            }
          : {
              precision: "unknown",
              year: null,
              month: null,
              day: null,
              isEstimated: false,
            }
    );

    // 3. Thực hiện insert
    const person = await PersonRepository.createPerson({
      tree_id: treeId,
      full_name: fullName,
      normalized_name: normalizePersonName(fullName),
      gender,
      living_status: livingStatus,
      birth_date: birthDb.date,
      birth_year: birthDb.year,
      birth_date_precision: birthDb.precision,
      birth_is_estimated: birthDb.isEstimated,
      created_by: userId,
      updated_by: userId,
    });

    return { person };
  }

  /**
   * Tạo nhân vật đầy đủ (Full Create)
   */
  static async createFullPerson(
    userId: string,
    rawInput: CreatePersonInput
  ): Promise<CreatePersonResult> {
    const parseResult = createPersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new PersonError(PERSON_ERROR_CODES.NAME_INVALID, parseResult.error.errors[0]?.message);
    }

    const data = parseResult.data;

    // 1. Kiểm tra ứng viên tương tự
    if (!data.confirmSimilar) {
      const normName = normalizePersonName(data.fullName);
      const candidates = await PersonRepository.findSimilarPeople(
        data.treeId,
        normName,
        data.birthYear
      );
      if (candidates.length > 0) {
        return {
          isWarning: true,
          warningCandidates: candidates,
        };
      }
    }

    // 2. Map dates
    const birthDb = mapPartialDateToDatabase(
      data.birthPrecision === "exact" && data.birthDate
        ? {
            precision: "exact",
            year: parseInt(data.birthDate.split("-")[0], 10),
            month: parseInt(data.birthDate.split("-")[1], 10),
            day: parseInt(data.birthDate.split("-")[2], 10),
            isEstimated: data.birthIsEstimated,
          }
        : data.birthPrecision === "year" && data.birthYear
          ? {
              precision: "year",
              year: data.birthYear,
              month: null,
              day: null,
              isEstimated: data.birthIsEstimated,
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
      data.deathPrecision === "exact" && data.deathDate
        ? {
            precision: "exact",
            year: parseInt(data.deathDate.split("-")[0], 10),
            month: parseInt(data.deathDate.split("-")[1], 10),
            day: parseInt(data.deathDate.split("-")[2], 10),
            isEstimated: data.deathIsEstimated,
          }
        : data.deathPrecision === "year" && data.deathYear
          ? {
              precision: "year",
              year: data.deathYear,
              month: null,
              day: null,
              isEstimated: data.deathIsEstimated,
            }
          : {
              precision: "unknown",
              year: null,
              month: null,
              day: null,
              isEstimated: false,
            }
    );

    // 3. Thực hiện insert
    const person = await PersonRepository.createPerson({
      tree_id: data.treeId,
      full_name: data.fullName,
      normalized_name: normalizePersonName(data.fullName),
      gender: data.gender,
      living_status: data.livingStatus,
      birth_date: birthDb.date,
      birth_year: birthDb.year,
      birth_date_precision: birthDb.precision,
      birth_is_estimated: birthDb.isEstimated,
      death_date: deathDb.date,
      death_year: deathDb.year,
      death_date_precision: deathDb.precision,
      death_is_estimated: deathDb.isEstimated,
      birth_place_text: data.birthPlaceText,
      death_place_text: data.deathPlaceText,
      hometown_text: data.hometownText,
      burial_place_text: data.burialPlaceText,
      occupation_text: data.occupationText,
      biography: data.biography,
      verification_status: data.verificationStatus,
      created_by: userId,
      updated_by: userId,
    });

    return { person };
  }

  /**
   * Cập nhật thông tin nhân vật kèm Optimistic Concurrency versioning
   */
  static async updatePerson(userId: string, rawInput: UpdatePersonInput): Promise<Person> {
    const parseResult = updatePersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new PersonError(PERSON_ERROR_CODES.NAME_INVALID, parseResult.error.errors[0]?.message);
    }

    const data = parseResult.data;

    const birthDb = mapPartialDateToDatabase(
      data.birthPrecision === "exact" && data.birthDate
        ? {
            precision: "exact",
            year: parseInt(data.birthDate.split("-")[0], 10),
            month: parseInt(data.birthDate.split("-")[1], 10),
            day: parseInt(data.birthDate.split("-")[2], 10),
            isEstimated: data.birthIsEstimated,
          }
        : data.birthPrecision === "year" && data.birthYear
          ? {
              precision: "year",
              year: data.birthYear,
              month: null,
              day: null,
              isEstimated: data.birthIsEstimated,
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
      data.deathPrecision === "exact" && data.deathDate
        ? {
            precision: "exact",
            year: parseInt(data.deathDate.split("-")[0], 10),
            month: parseInt(data.deathDate.split("-")[1], 10),
            day: parseInt(data.deathDate.split("-")[2], 10),
            isEstimated: data.deathIsEstimated,
          }
        : data.deathPrecision === "year" && data.deathYear
          ? {
              precision: "year",
              year: data.deathYear,
              month: null,
              day: null,
              isEstimated: data.deathIsEstimated,
            }
          : {
              precision: "unknown",
              year: null,
              month: null,
              day: null,
              isEstimated: false,
            }
    );

    const updated = await PersonRepository.updatePersonWithVersion(
      data.personId,
      data.expectedVersion,
      {
        full_name: data.fullName,
        normalized_name: normalizePersonName(data.fullName),
        gender: data.gender,
        living_status: data.livingStatus,
        birth_date: birthDb.date,
        birth_year: birthDb.year,
        birth_date_precision: birthDb.precision,
        birth_is_estimated: birthDb.isEstimated,
        death_date: deathDb.date,
        death_year: deathDb.year,
        death_date_precision: deathDb.precision,
        death_is_estimated: deathDb.isEstimated,
        birth_place_text: data.birthPlaceText,
        death_place_text: data.deathPlaceText,
        hometown_text: data.hometownText,
        burial_place_text: data.burialPlaceText,
        occupation_text: data.occupationText,
        biography: data.biography,
        verification_status: data.verificationStatus,
        updated_by: userId,
      }
    );

    if (!updated) {
      // Kiểm tra nguyên nhân update thất bại (Not found / version conflict / forbidden)
      const current = await PersonRepository.getActivePersonById(data.treeId, data.personId);
      if (!current) {
        throw new PersonError(PERSON_ERROR_CODES.NOT_FOUND);
      }
      if (current.version !== data.expectedVersion) {
        throw new PersonError(PERSON_ERROR_CODES.VERSION_CONFLICT);
      }
      throw new PersonError(PERSON_ERROR_CODES.FORBIDDEN);
    }

    return updated;
  }

  /**
   * Lấy chi tiết nhân vật kèm danh sách quan hệ chỉ đọc
   */
  static async getPersonDetail(
    userId: string,
    treeId: string,
    personId: string
  ): Promise<PersonDetail | null> {
    const supabase = await createClient();

    // 1. Kiểm tra quyền của user trên cây gia phả
    const { data: membership } = await supabase
      .from("tree_memberships")
      .select("role")
      .eq("tree_id", treeId)
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (!membership) return null;

    // 2. Lấy thông tin Person
    const person = await PersonRepository.getActivePersonById(treeId, personId);
    if (!person) return null;

    // 3. Lấy thông tin quan hệ gia đình (Chỉ đọc)
    const relationships = await PersonRepository.getPersonRelationships(treeId, personId);

    const isOwner = membership.role === "owner";
    const canEdit = isOwner || membership.role === "admin" || membership.role === "editor";

    return {
      ...person,
      isOwner,
      canEdit,
      relationships,
    };
  }

  /**
   * Xóa mềm nhân vật
   */
  static async softDeletePerson(userId: string, rawInput: SoftDeletePersonInput): Promise<void> {
    const parseResult = softDeletePersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new PersonError(PERSON_ERROR_CODES.NOT_FOUND);
    }

    const { treeId, personId, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    // 1. Kiểm tra nếu person đang là Generation Anchor (Mốc số đời) của cây
    const { data: anchorTree } = await supabase
      .from("family_trees")
      .select("id, name")
      .eq("id", treeId)
      .eq("generation_anchor_person_id", personId)
      .is("deleted_at", null)
      .maybeSingle();

    if (anchorTree) {
      throw new PersonError(PERSON_ERROR_CODES.GENERATION_ANCHOR_CONFLICT);
    }

    // 2. Thực hiện xóa mềm
    const success = await PersonRepository.softDeletePersonWithVersion(
      personId,
      expectedVersion,
      userId
    );

    if (!success) {
      const current = await PersonRepository.getActivePersonById(treeId, personId);
      if (!current) {
        throw new PersonError(PERSON_ERROR_CODES.ALREADY_DELETED);
      }
      if (current.version !== expectedVersion) {
        throw new PersonError(PERSON_ERROR_CODES.VERSION_CONFLICT);
      }
      throw new PersonError(PERSON_ERROR_CODES.SOFT_DELETE_FAILED);
    }
  }

  /**
   * Khôi phục nhân vật đã xóa mềm
   */
  static async restorePerson(userId: string, rawInput: RestorePersonInput): Promise<void> {
    const parseResult = restorePersonSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new PersonError(PERSON_ERROR_CODES.NOT_FOUND);
    }

    const { personId, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc("restore_person", {
      p_person_id: personId,
      p_expected_version: expectedVersion,
    });

    if (error || !success) {
      console.error("[PersonService.restorePerson] RPC Error:", error);
      throw new PersonError(PERSON_ERROR_CODES.RESTORE_FAILED);
    }
  }

  /**
   * Tìm kiếm hồ sơ tương tự theo tên
   */
  static async checkSimilarPeople(
    treeId: string,
    fullName: string,
    birthYear?: number | null,
    excludePersonId?: string
  ): Promise<SimilarPersonCandidate[]> {
    const norm = normalizePersonName(fullName);
    if (!norm) return [];
    return PersonRepository.findSimilarPeople(treeId, norm, birthYear, excludePersonId);
  }
}

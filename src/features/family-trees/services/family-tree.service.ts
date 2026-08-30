import { createClient } from "@/lib/supabase/server";
import {
  createFamilyTreeSchema,
  updateFamilyTreeBasicsSchema,
  updateFamilyTreePrivacySchema,
  setGenerationAnchorSchema,
  deleteFamilyTreeSchema,
  restoreFamilyTreeSchema,
  type CreateFamilyTreeInput,
  type UpdateFamilyTreeBasicsInput,
  type UpdateFamilyTreePrivacyInput,
  type SetGenerationAnchorInput,
  type DeleteFamilyTreeInput,
  type RestoreFamilyTreeInput,
} from "../schemas/family-tree.schema";
import { FamilyTreeError, FAMILY_TREE_ERROR_CODES } from "../errors/family-tree.errors";

export class FamilyTreeService {
  /**
   * Tạo cây gia phả mới kèm Owner Membership qua Atomic RPC
   */
  static async createFamilyTree(
    userId: string,
    rawInput: CreateFamilyTreeInput
  ): Promise<{ treeId: string }> {
    const parseResult = createFamilyTreeSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.NAME_INVALID,
        parseResult.error.errors[0]?.message
      );
    }

    const { name, description, privacyLevel } = parseResult.data;
    const supabase = await createClient();

    const { data: treeId, error } = await supabase.rpc("create_family_tree", {
      p_name: name,
      p_description: description,
      p_privacy_level: privacyLevel,
    });

    if (error || !treeId) {
      console.error("[FamilyTreeService.createFamilyTree] RPC error:", error);
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.CREATE_FAILED);
    }

    return { treeId: treeId as string };
  }

  /**
   * Cập nhật thông tin cơ bản (Tên, Mô tả) có kiểm tra Optimistic Locking
   */
  static async updateBasics(userId: string, rawInput: UpdateFamilyTreeBasicsInput): Promise<void> {
    const parseResult = updateFamilyTreeBasicsSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.NAME_INVALID,
        parseResult.error.errors[0]?.message
      );
    }

    const { treeId, name, description, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    // 1. Thực hiện update với điều kiện version
    const { data, error } = await supabase
      .from("family_trees")
      .update({
        name,
        description,
        version: expectedVersion + 1,
        updated_by: userId,
      })
      .eq("id", treeId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("id, version");

    if (error) {
      console.error("[FamilyTreeService.updateBasics] Update error:", error);
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.UPDATE_FAILED);
    }

    // 2. Nếu không có row nào được update -> kiểm tra nguyên nhân (Not Found, Forbidden hay Version Conflict)
    if (!data || data.length === 0) {
      const { data: currentTree } = await supabase
        .from("family_trees")
        .select("id, version")
        .eq("id", treeId)
        .is("deleted_at", null)
        .maybeSingle();

      if (!currentTree) {
        throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.NOT_FOUND);
      }

      if (currentTree.version !== expectedVersion) {
        throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.VERSION_CONFLICT);
      }

      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.FORBIDDEN);
    }
  }

  /**
   * Cập nhật mức độ riêng tư (Privacy Level)
   */
  static async updatePrivacy(
    userId: string,
    rawInput: UpdateFamilyTreePrivacyInput
  ): Promise<void> {
    const parseResult = updateFamilyTreePrivacySchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.PRIVACY_INVALID,
        parseResult.error.errors[0]?.message
      );
    }

    const { treeId, privacyLevel, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("family_trees")
      .update({
        privacy_level: privacyLevel,
        version: expectedVersion + 1,
        updated_by: userId,
      })
      .eq("id", treeId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("id");

    if (error || !data || data.length === 0) {
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.UPDATE_FAILED);
    }
  }

  /**
   * Cập nhật mốc số đời (Generation Anchor Person)
   */
  static async setGenerationAnchor(
    userId: string,
    rawInput: SetGenerationAnchorInput
  ): Promise<void> {
    const parseResult = setGenerationAnchorSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.GENERATION_ANCHOR_INVALID,
        parseResult.error.errors[0]?.message
      );
    }

    const { treeId, generationAnchorPersonId, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    // Nếu có truyền person ID, xác minh nhân vật thuộc đúng cây gia phả này
    if (generationAnchorPersonId) {
      const { data: person } = await supabase
        .from("persons")
        .select("id")
        .eq("id", generationAnchorPersonId)
        .eq("tree_id", treeId)
        .is("deleted_at", null)
        .maybeSingle();

      if (!person) {
        throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.GENERATION_ANCHOR_INVALID);
      }
    }

    const { data, error } = await supabase
      .from("family_trees")
      .update({
        generation_anchor_person_id: generationAnchorPersonId || null,
        version: expectedVersion + 1,
        updated_by: userId,
      })
      .eq("id", treeId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("id");

    if (error || !data || data.length === 0) {
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.UPDATE_FAILED);
    }
  }

  /**
   * Xóa mềm cây gia phả (Soft Delete)
   */
  static async softDelete(userId: string, rawInput: DeleteFamilyTreeInput): Promise<void> {
    const parseResult = deleteFamilyTreeSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.CONFIRMATION_MISMATCH,
        parseResult.error.errors[0]?.message
      );
    }

    const { treeId, confirmationName, expectedVersion } = parseResult.data;
    const supabase = await createClient();

    // 1. Lấy thông tin cây để kiểm tra tên xác nhận
    const { data: tree } = await supabase
      .from("family_trees")
      .select("name, deleted_at")
      .eq("id", treeId)
      .maybeSingle();

    if (!tree) {
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.NOT_FOUND);
    }

    if (tree.deleted_at !== null) {
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.ALREADY_DELETED);
    }

    if (tree.name.trim() !== confirmationName.trim()) {
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.CONFIRMATION_MISMATCH);
    }

    // 2. Thực hiện xóa mềm
    const { data, error } = await supabase
      .from("family_trees")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
        version: expectedVersion + 1,
        updated_by: userId,
      })
      .eq("id", treeId)
      .eq("version", expectedVersion)
      .is("deleted_at", null)
      .select("id");

    if (error || !data || data.length === 0) {
      console.error("[FamilyTreeService.softDelete] Update error:", error);
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.SOFT_DELETE_FAILED);
    }
  }

  /**
   * Khôi phục cây gia phả đã xóa mềm qua RPC
   */
  static async restore(userId: string, rawInput: RestoreFamilyTreeInput): Promise<void> {
    const parseResult = restoreFamilyTreeSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new FamilyTreeError(
        FAMILY_TREE_ERROR_CODES.NOT_FOUND,
        parseResult.error.errors[0]?.message
      );
    }

    const { treeId } = parseResult.data;
    const supabase = await createClient();

    const { data: success, error } = await supabase.rpc("restore_family_tree", {
      p_tree_id: treeId,
    });

    if (error || !success) {
      console.error("[FamilyTreeService.restore] RPC error:", error);
      throw new FamilyTreeError(FAMILY_TREE_ERROR_CODES.RESTORE_FAILED);
    }
  }
}

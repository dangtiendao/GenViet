import { createClient } from "@/lib/supabase/server";
import { RECOVERY_ERROR_CODES, RecoveryDomainError } from "../errors/recovery.errors";
import type { TrashItemDto, RestoreConflictPreview } from "../types/recovery.types";

export class RecoveryRepository {
  /**
   * Lấy danh sách toàn bộ các thực thể đang nằm trong thùng rác của cây gia phả
   */
  static async listTrashItems(treeId: string): Promise<TrashItemDto[]> {
    const supabase = await createClient();

    // 1. Lấy danh sách Persons đã xóa mềm
    const { data: personsData, error: personsError } = await supabase
      .from("persons")
      .select("id, full_name, gender, birth_year, death_year, deleted_at, deleted_by, version")
      .eq("tree_id", treeId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (personsError) {
      console.error("[RecoveryRepository.listTrashItems] persons error:", personsError);
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.UNKNOWN_ERROR,
        "Không thể tải danh sách nhân vật trong thùng rác.",
        500
      );
    }

    // 2. Lấy danh sách Relationships đã xóa mềm
    const { data: relsData, error: relsError } = await supabase
      .from("parent_child_relationships")
      .select(
        "id, parent_id, child_id, parent_role, relationship_kind, deleted_at, deleted_by, version, parent:persons!parent_child_relationships_parent_id_fkey(full_name), child:persons!parent_child_relationships_child_id_fkey(full_name)"
      )
      .eq("tree_id", treeId)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (relsError) {
      console.error("[RecoveryRepository.listTrashItems] rels error:", relsError);
    }

    const items: TrashItemDto[] = [];

    // Map Persons
    for (const p of personsData || []) {
      const lifespan = p.birth_year
        ? `${p.birth_year} - ${p.death_year || "?"}`
        : p.death_year
          ? `Mất ${p.death_year}`
          : "Chưa rõ năm";
      items.push({
        id: p.id,
        treeId,
        itemType: "person",
        itemTypeLabel: "Nhân vật",
        displayName: p.full_name,
        detailSummary: `${p.gender === "male" ? "Nam" : p.gender === "female" ? "Nữ" : "Khác"} • ${lifespan}`,
        deletedAt: p.deleted_at!,
        deletedBy: p.deleted_by,
        version: p.version,
        canRestore: true,
      });
    }

    // Map Relationships
    for (const r of (relsData as any[]) || []) {
      const parentName = r.parent?.full_name || "Nhân vật không xác định";
      const childName = r.child?.full_name || "Nhân vật không xác định";
      const roleText =
        r.parent_role === "father" ? "Cha" : r.parent_role === "mother" ? "Mẹ" : "Phụ huynh";
      items.push({
        id: r.id,
        treeId,
        itemType: "parent_child_relationship",
        itemTypeLabel: "Quan hệ Cha/Mẹ - Con",
        displayName: `${parentName} (${roleText}) → ${childName}`,
        detailSummary: `Loại quan hệ: ${r.relationship_kind === "biological" ? "Ruột thịt" : "Nuôi/Khác"}`,
        deletedAt: r.deleted_at!,
        deletedBy: r.deleted_by,
        version: r.version,
        canRestore: true,
      });
    }

    // Sắp xếp theo thời điểm xóa mới nhất
    return items.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  }

  /**
   * Khôi phục Person thông qua RPC atomic
   */
  static async restorePerson(personId: string, expectedVersion?: number): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)("restore_person", {
      p_person_id: personId,
      p_expected_version: expectedVersion || null,
    });

    if (error) {
      console.error("[RecoveryRepository.restorePerson] RPC error:", error);
      if (error.code === "40001") {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.VERSION_CONFLICT,
          "Dữ liệu nhân vật đã thay đổi. Vui lòng tải lại trang và thử lại."
        );
      }
      if (error.code === "42501") {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.FORBIDDEN,
          "Bạn không có quyền khôi phục nhân vật này."
        );
      }
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.RESTORE_FAILED,
        error.message || "Khôi phục nhân vật thất bại."
      );
    }

    return !!data;
  }

  /**
   * Khôi phục Parent-Child Relationship thông qua RPC atomic
   */
  static async restoreRelationship(
    relationshipId: string,
    expectedVersion?: number
  ): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)("restore_parent_child_relationship", {
      p_relationship_id: relationshipId,
      p_expected_version: expectedVersion || null,
    });

    if (error) {
      console.error("[RecoveryRepository.restoreRelationship] RPC error:", error);
      if (error.code === "23503" || error.message.includes("DEPENDENCY_DELETED")) {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.DEPENDENCY_DELETED,
          "Không thể khôi phục quan hệ do cha/mẹ hoặc con vẫn đang nằm trong thùng rác. Vui lòng khôi phục nhân vật trước."
        );
      }
      if (error.code === "23505" || error.message.includes("DUPLICATE_RELATIONSHIP")) {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.DUPLICATE_CONFLICT,
          "Đã tồn tại một quan hệ đang hoạt động giữa hai nhân vật này."
        );
      }
      if (error.message.includes("CYCLE_CONFLICT")) {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.CYCLE_CONFLICT,
          "Khôi phục quan hệ này sẽ tạo chu trình phả hệ tổ tiên - hậu duệ không hợp lệ."
        );
      }
      if (error.message.includes("BIOLOGICAL_PARENT_EXISTS")) {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.VERIFIED_PARENT_CONFLICT,
          "Người con đã có đủ cha/mẹ ruột đang hoạt động trong cây."
        );
      }
      if (error.code === "40001") {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.VERSION_CONFLICT,
          "Quan hệ đã bị thay đổi bởi phiên làm việc khác."
        );
      }
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.RESTORE_FAILED,
        error.message || "Khôi phục quan hệ thất bại."
      );
    }

    return !!data;
  }

  /**
   * Khôi phục Hôn nhân thông qua RPC atomic
   */
  static async restoreUnion(unionId: string, expectedVersion?: number): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await (supabase.rpc as any)("restore_union", {
      p_union_id: unionId,
      p_expected_version: expectedVersion || null,
    });

    if (error) {
      console.error("[RecoveryRepository.restoreUnion] RPC error:", error);
      if (error.code === "23503") {
        throw new RecoveryDomainError(
          RECOVERY_ERROR_CODES.DEPENDENCY_DELETED,
          "Không thể khôi phục hôn nhân vì một trong hai người phối ngẫu đang bị xóa."
        );
      }
      throw new RecoveryDomainError(
        RECOVERY_ERROR_CODES.RESTORE_FAILED,
        error.message || "Khôi phục hôn nhân thất bại."
      );
    }

    return !!data;
  }

  /**
   * Kiểm tra trước các xung đột khi khôi phục Person
   */
  static async previewPersonRestoreConflict(
    treeId: string,
    personId: string
  ): Promise<RestoreConflictPreview> {
    const supabase = await createClient();

    const { data: person, error } = await supabase
      .from("persons")
      .select("id, tree_id, full_name, birth_year, deleted_at")
      .eq("id", personId)
      .single();

    if (error || !person) {
      return {
        hasBlockingConflict: true,
        hasWarnings: false,
        blockingReasons: ["Không tìm thấy nhân vật cần khôi phục."],
        warningMessages: [],
        blockingCode: RECOVERY_ERROR_CODES.NOT_FOUND,
      };
    }

    if (!person.deleted_at) {
      return {
        hasBlockingConflict: true,
        hasWarnings: false,
        blockingReasons: [
          "Nhân vật này hiện đang hoạt động bình thường, không nằm trong thùng rác.",
        ],
        warningMessages: [],
        blockingCode: RECOVERY_ERROR_CODES.ENTITY_NOT_DELETED,
      };
    }

    // Kiểm tra cảnh báo trùng tên
    const { data: similarPersons } = await supabase
      .from("persons")
      .select("id, full_name")
      .eq("tree_id", treeId)
      .is("deleted_at", null)
      .ilike("full_name", person.full_name)
      .neq("id", personId)
      .limit(3);

    const warnings: string[] = [];
    if (similarPersons && similarPersons.length > 0) {
      warnings.push(
        `Phát hiện ${similarPersons.length} nhân vật cùng tên "${person.full_name}" đang hoạt động trong cây.`
      );
    }

    return {
      hasBlockingConflict: false,
      hasWarnings: warnings.length > 0,
      blockingReasons: [],
      warningMessages: warnings,
    };
  }

  /**
   * Kiểm tra trước các xung đột khi khôi phục Quan hệ Cha/Mẹ - Con
   */
  static async previewRelationshipRestoreConflict(
    treeId: string,
    relationshipId: string
  ): Promise<RestoreConflictPreview> {
    const supabase = await createClient();

    const { data: rel, error } = await supabase
      .from("parent_child_relationships")
      .select("id, tree_id, parent_id, child_id, parent_role, relationship_kind, deleted_at")
      .eq("id", relationshipId)
      .single();

    if (error || !rel) {
      return {
        hasBlockingConflict: true,
        hasWarnings: false,
        blockingReasons: ["Không tìm thấy quan hệ cần khôi phục."],
        warningMessages: [],
        blockingCode: RECOVERY_ERROR_CODES.NOT_FOUND,
      };
    }

    const blocking: string[] = [];

    // 1. Kiểm tra parent và child có active không
    const { data: parent } = await supabase
      .from("persons")
      .select("id, full_name, deleted_at")
      .eq("id", rel.parent_id)
      .single();

    const { data: child } = await supabase
      .from("persons")
      .select("id, full_name, deleted_at")
      .eq("id", rel.child_id)
      .single();

    if (!parent || parent.deleted_at) {
      blocking.push(
        `Người cha/mẹ (${parent?.full_name || rel.parent_id}) đang bị xóa trong thùng rác.`
      );
    }

    if (!child || child.deleted_at) {
      blocking.push(`Người con (${child?.full_name || rel.child_id}) đang bị xóa trong thùng rác.`);
    }

    // 2. Kiểm tra trùng lặp
    const { data: duplicate } = await supabase
      .from("parent_child_relationships")
      .select("id")
      .eq("tree_id", treeId)
      .eq("parent_id", rel.parent_id)
      .eq("child_id", rel.child_id)
      .is("deleted_at", null)
      .neq("id", relationshipId)
      .limit(1);

    if (duplicate && duplicate.length > 0) {
      blocking.push("Đã có quan hệ hoạt động giữa hai nhân vật này.");
    }

    return {
      hasBlockingConflict: blocking.length > 0,
      hasWarnings: false,
      blockingReasons: blocking,
      warningMessages: [],
      blockingCode: blocking.length > 0 ? RECOVERY_ERROR_CODES.DEPENDENCY_DELETED : undefined,
    };
  }
}

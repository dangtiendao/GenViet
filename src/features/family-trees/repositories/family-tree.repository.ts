import { createClient } from "@/lib/supabase/server";
import type {
  FamilyTreeListItem,
  FamilyTreeOverview,
  FamilyTreeSettings,
  TreePersonOption,
} from "../types/family-tree.types";

export class FamilyTreeRepository {
  /**
   * Liệt kê danh sách các cây gia phả mà user hiện tại có quyền truy cập (Active)
   */
  static async listAccessibleTrees(userId: string): Promise<FamilyTreeListItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tree_memberships")
      .select(
        `
        role,
        status,
        family_trees!inner (
          id,
          name,
          description,
          status,
          privacy_level,
          created_at,
          updated_at,
          deleted_at,
          generation_anchor_person_id
        )
      `
      )
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .is("family_trees.deleted_at", null)
      .order("updated_at", { referencedTable: "family_trees", ascending: false });

    if (error) {
      console.error("[FamilyTreeRepository.listAccessibleTrees] Query error:", error);
      throw error;
    }

    if (!data) return [];

    return data
      .filter((row) => row.family_trees !== null)
      .map((row) => {
        const tree = row.family_trees as unknown as {
          id: string;
          name: string;
          description: string | null;
          status: FamilyTreeListItem["status"];
          privacy_level: FamilyTreeListItem["privacyLevel"];
          created_at: string;
          updated_at: string;
          generation_anchor_person_id: string | null;
        };

        return {
          id: tree.id,
          name: tree.name,
          description: tree.description,
          status: tree.status,
          privacyLevel: tree.privacy_level,
          role: row.role,
          createdAt: tree.created_at,
          updatedAt: tree.updated_at,
          generationAnchorPersonId: tree.generation_anchor_person_id,
        };
      });
  }

  /**
   * Lấy thông tin tổng quan cây gia phả kèm theo quyền hạn của user
   */
  static async getTreeOverview(treeId: string, userId: string): Promise<FamilyTreeOverview | null> {
    const supabase = await createClient();

    // 1. Lấy thông tin cây và membership
    const { data, error } = await supabase
      .from("tree_memberships")
      .select(
        `
        role,
        status,
        family_trees!inner (
          id,
          name,
          description,
          status,
          privacy_level,
          version,
          generation_anchor_person_id,
          created_at,
          updated_at,
          deleted_at
        )
      `
      )
      .eq("tree_id", treeId)
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .is("family_trees.deleted_at", null)
      .maybeSingle();

    if (error || !data || !data.family_trees) {
      return null;
    }

    const tree = data.family_trees as unknown as {
      id: string;
      name: string;
      description: string | null;
      status: FamilyTreeOverview["status"];
      privacy_level: FamilyTreeOverview["privacyLevel"];
      version: number;
      generation_anchor_person_id: string | null;
      created_at: string;
      updated_at: string;
    };

    // 2. Lấy tên nhân vật mốc số đời nếu có
    let anchorPersonName: string | null = null;
    if (tree.generation_anchor_person_id) {
      const { data: personData } = await supabase
        .from("persons")
        .select("full_name")
        .eq("id", tree.generation_anchor_person_id)
        .eq("tree_id", treeId)
        .is("deleted_at", null)
        .maybeSingle();

      if (personData) {
        anchorPersonName = personData.full_name;
      }
    }

    const isOwner = data.role === "owner";
    const canEdit = isOwner || data.role === "admin" || data.role === "editor";

    return {
      id: tree.id,
      name: tree.name,
      description: tree.description,
      status: tree.status,
      privacyLevel: tree.privacy_level,
      role: data.role,
      version: tree.version,
      generationAnchorPersonId: tree.generation_anchor_person_id,
      generationAnchorPersonName: anchorPersonName,
      createdAt: tree.created_at,
      updatedAt: tree.updated_at,
      isOwner,
      canEdit,
    };
  }

  /**
   * Lấy dữ liệu cài đặt cây gia phả
   */
  static async getTreeSettings(treeId: string, userId: string): Promise<FamilyTreeSettings | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tree_memberships")
      .select(
        `
        role,
        family_trees!inner (
          id,
          name,
          description,
          status,
          privacy_level,
          version,
          generation_anchor_person_id
        )
      `
      )
      .eq("tree_id", treeId)
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .is("family_trees.deleted_at", null)
      .maybeSingle();

    if (error || !data || !data.family_trees) {
      return null;
    }

    const tree = data.family_trees as unknown as {
      id: string;
      name: string;
      description: string | null;
      status: FamilyTreeSettings["status"];
      privacy_level: FamilyTreeSettings["privacyLevel"];
      version: number;
      generation_anchor_person_id: string | null;
    };

    return {
      id: tree.id,
      name: tree.name,
      description: tree.description,
      status: tree.status,
      privacyLevel: tree.privacy_level,
      version: tree.version,
      generationAnchorPersonId: tree.generation_anchor_person_id,
      role: data.role,
    };
  }

  /**
   * Lấy danh sách nhân vật tối thiểu trong cây để phục vụ bộ chọn (Generation Anchor Selector)
   */
  static async listTreePeopleForSelector(treeId: string): Promise<TreePersonOption[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("persons")
      .select("id, full_name, birth_year, death_year, gender")
      .eq("tree_id", treeId)
      .is("deleted_at", null)
      .order("full_name", { ascending: true })
      .limit(100);

    if (error || !data) return [];

    return data.map((p) => ({
      id: p.id,
      fullName: p.full_name,
      birthYear: p.birth_year,
      deathYear: p.death_year,
      gender: p.gender,
    }));
  }

  /**
   * Lấy danh sách cây đã xóa mềm dành riêng cho Owner (Thùng rác)
   */
  static async getDeletedTreesForOwner(userId: string): Promise<FamilyTreeListItem[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tree_memberships")
      .select(
        `
        role,
        family_trees!inner (
          id,
          name,
          description,
          status,
          privacy_level,
          created_at,
          updated_at,
          deleted_at,
          generation_anchor_person_id
        )
      `
      )
      .eq("user_id", userId)
      .eq("role", "owner")
      .eq("status", "active")
      .is("deleted_at", null)
      .not("family_trees.deleted_at", "is", null)
      .order("updated_at", { referencedTable: "family_trees", ascending: false });

    if (error || !data) return [];

    return data.map((row) => {
      const tree = row.family_trees as unknown as {
        id: string;
        name: string;
        description: string | null;
        status: FamilyTreeListItem["status"];
        privacy_level: FamilyTreeListItem["privacyLevel"];
        created_at: string;
        updated_at: string;
        generation_anchor_person_id: string | null;
      };

      return {
        id: tree.id,
        name: tree.name,
        description: tree.description,
        status: tree.status,
        privacyLevel: tree.privacy_level,
        role: row.role,
        createdAt: tree.created_at,
        updatedAt: tree.updated_at,
        generationAnchorPersonId: tree.generation_anchor_person_id,
      };
    });
  }
}

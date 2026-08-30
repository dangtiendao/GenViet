import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AvatarMetadata, AvatarStatus } from "../types/media.types";
import { MediaDomainError, MEDIA_ERROR_CODES } from "../errors/media.errors";

export class MediaRepository {
  /**
   * Lấy metadata ảnh đại diện active hiện tại của nhân vật
   */
  static async getActiveAvatar(personId: string): Promise<AvatarMetadata | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("person_avatars")
      .select("*")
      .eq("person_id", personId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      treeId: data.tree_id,
      personId: data.person_id,
      bucketId: data.bucket_id,
      objectPath: data.object_path,
      thumbnailPath: data.thumbnail_path,
      originalFilename: data.original_filename,
      mimeType: data.mime_type,
      sizeBytes: data.size_bytes,
      width: data.width,
      height: data.height,
      status: data.status as AvatarStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Ghi mới bản ghi metadata ảnh đại diện
   */
  static async insertAvatarMetadata(input: {
    treeId: string;
    personId: string;
    objectPath: string;
    thumbnailPath: string;
    originalFilename?: string | null;
    mimeType: string;
    sizeBytes: number;
    width?: number | null;
    height?: number | null;
    status?: AvatarStatus;
    createdBy?: string | null;
  }): Promise<AvatarMetadata> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("person_avatars")
      .insert({
        tree_id: input.treeId,
        person_id: input.personId,
        object_path: input.objectPath,
        thumbnail_path: input.thumbnailPath,
        original_filename: input.originalFilename || null,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        width: input.width || null,
        height: input.height || null,
        status: input.status || "active",
        created_by: input.createdBy || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.FINALIZE_FAILED,
        `Không thể lưu metadata ảnh: ${error?.message || "Lỗi không xác định"}`
      );
    }

    return {
      id: data.id,
      treeId: data.tree_id,
      personId: data.person_id,
      bucketId: data.bucket_id,
      objectPath: data.object_path,
      thumbnailPath: data.thumbnail_path,
      originalFilename: data.original_filename,
      mimeType: data.mime_type,
      sizeBytes: data.size_bytes,
      width: data.width,
      height: data.height,
      status: data.status as AvatarStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Cập nhật avatar_path trên bảng persons
   */
  static async updatePersonAvatarPath(
    personId: string,
    avatarPath: string | null,
    expectedVersion?: number | null
  ): Promise<void> {
    const supabase = await createClient();

    let query = supabase.from("persons").update({ avatar_path: avatarPath }).eq("id", personId);

    if (expectedVersion !== undefined && expectedVersion !== null) {
      query = query.eq("version", expectedVersion);
    }

    const { error, count } = await query;

    if (error) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.FINALIZE_FAILED,
        `Lỗi cập nhật ảnh đại diện nhân vật: ${error.message}`
      );
    }

    if (expectedVersion !== undefined && expectedVersion !== null && count === 0) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.VERSION_CONFLICT);
    }
  }

  /**
   * Đánh dấu các bản ghi avatar cũ là 'replaced'
   */
  static async markPreviousAvatarsReplaced(
    personId: string,
    currentActiveId: string
  ): Promise<string[]> {
    const supabase = await createClient();

    // 1. Tìm các object path cũ cần dọn dẹp
    const { data: oldAvatars } = await supabase
      .from("person_avatars")
      .select("id, object_path, thumbnail_path")
      .eq("person_id", personId)
      .neq("id", currentActiveId)
      .eq("status", "active");

    if (!oldAvatars || oldAvatars.length === 0) {
      return [];
    }

    // 2. Chuyển trạng thái sang replaced
    const oldIds = oldAvatars.map((a) => a.id);
    await supabase.from("person_avatars").update({ status: "replaced" }).in("id", oldIds);

    const oldPaths: string[] = [];
    for (const a of oldAvatars) {
      if (a.object_path) oldPaths.push(a.object_path);
      if (a.thumbnail_path) oldPaths.push(a.thumbnail_path);
    }

    return oldPaths;
  }

  /**
   * Đánh dấu xóa toàn bộ avatar của một nhân vật (khi người dùng chủ động xóa avatar)
   */
  static async markAllAvatarsDeleted(personId: string): Promise<string[]> {
    const supabase = await createClient();

    const { data: activeAvatars } = await supabase
      .from("person_avatars")
      .select("id, object_path, thumbnail_path")
      .eq("person_id", personId)
      .in("status", ["active", "temporary"]);

    if (!activeAvatars || activeAvatars.length === 0) {
      return [];
    }

    const ids = activeAvatars.map((a) => a.id);
    await supabase
      .from("person_avatars")
      .update({ status: "deleted", deleted_at: new Date().toISOString() })
      .in("id", ids);

    const paths: string[] = [];
    for (const a of activeAvatars) {
      if (a.object_path) paths.push(a.object_path);
      if (a.thumbnail_path) paths.push(a.thumbnail_path);
    }

    return paths;
  }
}

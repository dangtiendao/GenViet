import "server-only";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import {
  prepareAvatarUploadSchema,
  finalizeAvatarUploadSchema,
  getAvatarSignedUrlSchema,
  deleteAvatarSchema,
  type PrepareAvatarUploadInput,
  type FinalizeAvatarUploadInput,
  type GetAvatarSignedUrlInput,
  type DeleteAvatarInput,
} from "../schemas/avatar-upload.schema";
import { buildActiveAvatarPath, buildTemporaryAvatarPath } from "../utils/object-path";
import { SupabaseStorageAdapter } from "../adapters/supabase-storage.adapter";
import { MediaRepository } from "../repositories/media.repository";
import { MediaDomainError, MEDIA_ERROR_CODES } from "../errors/media.errors";
import type {
  AvatarUploadAuthorization,
  AvatarMetadata,
  AvatarSignedUrlResponse,
} from "../types/media.types";

export class AvatarService {
  /**
   * 1. Xác thực quyền ghi và cấp quyền upload file tạm (Prepare Upload)
   */
  static async prepareAvatarUpload(
    userId: string,
    rawInput: PrepareAvatarUploadInput
  ): Promise<AvatarUploadAuthorization> {
    const parseResult = prepareAvatarUploadSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.FILE_REQUIRED,
        parseResult.error.issues[0]?.message
      );
    }

    const { treeId, personId, mimeType } = parseResult.data;

    // Kiểm tra quyền ghi trên cây gia phả
    await this.verifyWriterPermission(userId, treeId);

    const mediaId = randomUUID();
    const uploadId = randomUUID();

    const tempAvatarPath = buildTemporaryAvatarPath(treeId, personId, uploadId, "avatar");
    const tempThumbPath = buildTemporaryAvatarPath(treeId, personId, uploadId, "thumb");

    // Sinh Signed Upload URLs để client upload trực tiếp
    const [avatarAuth, thumbAuth] = await Promise.all([
      SupabaseStorageAdapter.createSignedUploadUrl(tempAvatarPath),
      SupabaseStorageAdapter.createSignedUploadUrl(tempThumbPath),
    ]);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return {
      uploadId,
      mediaId,
      treeId,
      personId,
      avatarPath: tempAvatarPath,
      thumbnailPath: tempThumbPath,
      avatarUploadUrl: avatarAuth.signedUrl,
      thumbnailUploadUrl: thumbAuth.signedUrl,
      expiresAt,
    };
  }

  /**
   * 2. Hoàn tất upload và kích hoạt ảnh đại diện (Finalize Upload)
   */
  static async finalizeAvatarUpload(
    userId: string,
    rawInput: FinalizeAvatarUploadInput
  ): Promise<AvatarMetadata> {
    const parseResult = finalizeAvatarUploadSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.FINALIZE_FAILED,
        parseResult.error.issues[0]?.message
      );
    }

    const {
      treeId,
      personId,
      uploadId,
      mediaId,
      sizeBytes,
      width,
      height,
      originalFilename,
      expectedVersion,
    } = parseResult.data;

    // Kiểm tra quyền ghi
    await this.verifyWriterPermission(userId, treeId);

    const tempAvatarPath = buildTemporaryAvatarPath(treeId, personId, uploadId, "avatar");
    const tempThumbPath = buildTemporaryAvatarPath(treeId, personId, uploadId, "thumb");

    const activeAvatarPath = buildActiveAvatarPath(treeId, personId, mediaId, "avatar");
    const activeThumbPath = buildActiveAvatarPath(treeId, personId, mediaId, "thumb");

    // Sao chép từ thư mục tạm sang thư mục active
    await Promise.all([
      SupabaseStorageAdapter.copyObject(tempAvatarPath, activeAvatarPath),
      SupabaseStorageAdapter.copyObject(tempThumbPath, activeThumbPath),
    ]);

    // Ghi metadata CSDL
    const metadata = await MediaRepository.insertAvatarMetadata({
      treeId,
      personId,
      objectPath: activeAvatarPath,
      thumbnailPath: activeThumbPath,
      originalFilename,
      mimeType: "image/webp",
      sizeBytes,
      width,
      height,
      status: "active",
      createdBy: userId,
    });

    // Cập nhật trường avatar_path trên bảng persons
    await MediaRepository.updatePersonAvatarPath(personId, activeAvatarPath, expectedVersion);

    // Đánh dấu và dọn dẹp các avatar cũ
    const oldPaths = await MediaRepository.markPreviousAvatarsReplaced(personId, metadata.id);

    // Xóa file tạm và file cũ khỏi storage trong background
    const pathsToDelete = [tempAvatarPath, tempThumbPath, ...oldPaths];
    SupabaseStorageAdapter.deleteObjects(pathsToDelete).catch((err) => {
      console.error("Cleanup error after avatar finalize:", err);
    });

    return metadata;
  }

  /**
   * 3. Sinh Signed Read URL cho ảnh đại diện hoặc thumbnail
   */
  static async getAvatarSignedUrl(
    userId: string,
    rawInput: GetAvatarSignedUrlInput
  ): Promise<AvatarSignedUrlResponse | null> {
    const parseResult = getAvatarSignedUrlSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.SIGNED_URL_FAILED,
        parseResult.error.issues[0]?.message
      );
    }

    const { treeId, personId, variant, ttlSeconds } = parseResult.data;

    // Kiểm tra quyền đọc trên cây gia phả
    await this.verifyReaderPermission(userId, treeId);

    // Lấy metadata active của person
    const activeAvatar = await MediaRepository.getActiveAvatar(personId);
    if (!activeAvatar) {
      return null;
    }

    const targetPath = variant === "thumb" ? activeAvatar.thumbnailPath : activeAvatar.objectPath;

    const signedUrl = await SupabaseStorageAdapter.createSignedReadUrl(targetPath, ttlSeconds);

    const expiresAt = Date.now() + ttlSeconds * 1000;

    return {
      url: signedUrl,
      variant,
      expiresAt,
    };
  }

  /**
   * 4. Xóa ảnh đại diện của nhân vật
   */
  static async removeAvatar(userId: string, rawInput: DeleteAvatarInput): Promise<void> {
    const parseResult = deleteAvatarSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.DELETE_FAILED,
        parseResult.error.issues[0]?.message
      );
    }

    const { treeId, personId, expectedVersion } = parseResult.data;

    // Kiểm tra quyền ghi
    await this.verifyWriterPermission(userId, treeId);

    // Cập nhật avatar_path = null trên bảng persons
    await MediaRepository.updatePersonAvatarPath(personId, null, expectedVersion);

    // Đánh dấu xóa toàn bộ avatar của nhân vật
    const oldPaths = await MediaRepository.markAllAvatarsDeleted(personId);

    // Xóa file trên Storage
    if (oldPaths.length > 0) {
      SupabaseStorageAdapter.deleteObjects(oldPaths).catch((err) => {
        console.error("Cleanup error after avatar delete:", err);
      });
    }
  }

  /**
   * Helper: Kiểm tra quyền Ghi (Owner, Admin, Editor)
   */
  private static async verifyWriterPermission(userId: string, treeId: string): Promise<void> {
    const supabase = await createClient();
    const { data: membership } = await supabase
      .from("tree_memberships")
      .select("role, status")
      .eq("tree_id", treeId)
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (!membership || !["owner", "admin", "editor"].includes(membership.role)) {
      throw new MediaDomainError(MEDIA_ERROR_CODES.UPLOAD_FORBIDDEN);
    }
  }

  /**
   * Helper: Kiểm tra quyền Đọc (Member bất kỳ hoặc Tree Public)
   */
  private static async verifyReaderPermission(userId: string, treeId: string): Promise<void> {
    const supabase = await createClient();

    const { data: membership } = await supabase
      .from("tree_memberships")
      .select("role, status")
      .eq("tree_id", treeId)
      .eq("user_id", userId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (membership) return;

    // Kiểm tra xem tree có public không
    const { data: tree } = await supabase
      .from("family_trees")
      .select("privacy_level, status")
      .eq("id", treeId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle();

    if (!tree || tree.privacy_level !== "public") {
      throw new MediaDomainError(MEDIA_ERROR_CODES.SIGNED_URL_FORBIDDEN);
    }
  }
}

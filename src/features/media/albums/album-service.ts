import { PhotoAlbum, CreateAlbumInput } from "./album.types";

/**
 * Quản lý Album ảnh riêng tư theo cây gia phả (P27-T08)
 * Không nhân bản tệp ảnh nhị phân khi thêm vào album
 */
export function buildPhotoAlbum(
  input: CreateAlbumInput,
  id: string = crypto.randomUUID()
): PhotoAlbum {
  const now = new Date().toISOString();
  return {
    id,
    treeId: input.treeId,
    title: input.title.trim(),
    description: input.description?.trim(),
    coverMediaId: input.coverMediaId,
    mediaCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

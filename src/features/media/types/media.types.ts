export type AvatarVariant = "avatar" | "thumb";

export type AvatarStatus = "temporary" | "active" | "replaced" | "deleted";

export interface AvatarPathComponents {
  treeId: string;
  personId: string;
  mediaId: string;
  variant: AvatarVariant;
  extension: "webp" | "jpg" | "png";
  isTemporary: boolean;
}

export interface AvatarUploadAuthorization {
  uploadId: string;
  mediaId: string;
  treeId: string;
  personId: string;
  avatarPath: string;
  thumbnailPath: string;
  avatarUploadUrl?: string;
  thumbnailUploadUrl?: string;
  expiresAt: string;
}

export interface AvatarMetadata {
  id: string;
  treeId: string;
  personId: string;
  bucketId: string;
  objectPath: string;
  thumbnailPath: string;
  originalFilename?: string | null;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  status: AvatarStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarSignedUrlResponse {
  url: string;
  variant: AvatarVariant;
  expiresAt: number; // unix timestamp ms
}

export interface ProcessedAvatarResult {
  avatarBlob: Blob;
  thumbnailBlob: Blob;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: "image/webp";
}

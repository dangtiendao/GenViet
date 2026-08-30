import { z } from "zod";

export const MEDIA_LIMITS = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  MAX_DIMENSION_PX: 8000,
  MAX_PIXEL_BUDGET: 40_000_000, // 40 MP
  AVATAR_OUTPUT_MAX_PX: 512,
  THUMBNAIL_OUTPUT_PX: 128,
  DEFAULT_SIGNED_URL_TTL_SECONDS: 900, // 15 phút
} as const;

export const ALLOWED_INPUT_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const prepareAvatarUploadSchema = z.object({
  treeId: z.string().uuid({ message: "Mã cây gia phả không hợp lệ." }),
  personId: z.string().uuid({ message: "Mã nhân vật không hợp lệ." }),
  mimeType: z.enum(ALLOWED_INPUT_MIME_TYPES, {
    message: "Định dạng ảnh chỉ chấp nhận JPEG, PNG hoặc WebP.",
  }),
  sizeBytes: z.number().int().positive().max(MEDIA_LIMITS.MAX_FILE_SIZE_BYTES, {
    message: "Dung lượng ảnh tối đa 10 MB.",
  }),
  originalFilename: z.string().max(255).optional().nullable(),
});

export const finalizeAvatarUploadSchema = z.object({
  treeId: z.string().uuid({ message: "Mã cây gia phả không hợp lệ." }),
  personId: z.string().uuid({ message: "Mã nhân vật không hợp lệ." }),
  uploadId: z.string().min(1, { message: "Mã upload không hợp lệ." }),
  mediaId: z.string().uuid({ message: "Mã media không hợp lệ." }),
  sizeBytes: z.number().int().positive().max(MEDIA_LIMITS.MAX_FILE_SIZE_BYTES),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  originalFilename: z.string().max(255).optional().nullable(),
  expectedVersion: z.number().int().positive().optional().nullable(),
});

export const getAvatarSignedUrlSchema = z.object({
  treeId: z.string().uuid({ message: "Mã cây gia phả không hợp lệ." }),
  personId: z.string().uuid({ message: "Mã nhân vật không hợp lệ." }),
  variant: z.enum(["avatar", "thumb"]).default("thumb"),
  ttlSeconds: z
    .number()
    .int()
    .min(60)
    .max(3600)
    .default(MEDIA_LIMITS.DEFAULT_SIGNED_URL_TTL_SECONDS),
});

export const deleteAvatarSchema = z.object({
  treeId: z.string().uuid({ message: "Mã cây gia phả không hợp lệ." }),
  personId: z.string().uuid({ message: "Mã nhân vật không hợp lệ." }),
  expectedVersion: z.number().int().positive().optional().nullable(),
});

export type PrepareAvatarUploadInput = z.infer<typeof prepareAvatarUploadSchema>;
export type FinalizeAvatarUploadInput = z.infer<typeof finalizeAvatarUploadSchema>;
export type GetAvatarSignedUrlInput = z.infer<typeof getAvatarSignedUrlSchema>;
export type DeleteAvatarInput = z.infer<typeof deleteAvatarSchema>;

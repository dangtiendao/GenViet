import { z } from "zod";

export const backupTreeSchema = z
  .object({
    sourceId: z.string().uuid().optional(),
    name: z.string().min(1, "Tên cây gia phả không được để trống").max(255),
    description: z.string().max(2000).nullable().optional(),
    privacyLevel: z.enum(["private", "public"]).default("private"),
    generationAnchorPersonId: z.string().uuid().nullable().optional(),
    defaultPersonId: z.string().uuid().nullable().optional(),
  })
  .strict();

export const backupPersonSchema = z
  .object({
    sourceId: z.string().uuid("Person sourceId phải là UUID hợp lệ"),
    fullName: z.string().min(1, "Họ và tên nhân vật không được để trống").max(255),
    gender: z.enum(["male", "female", "other", "unknown"]),
    livingStatus: z.enum(["living", "deceased", "unknown"]),
    birthDate: z.string().nullable().optional(),
    birthYear: z.number().int().min(0).max(9999).nullable().optional(),
    birthDatePrecision: z.enum(["exact", "year", "unknown"]).default("unknown"),
    birthIsEstimated: z.boolean().default(false),
    deathDate: z.string().nullable().optional(),
    deathYear: z.number().int().min(0).max(9999).nullable().optional(),
    deathDatePrecision: z.enum(["exact", "year", "unknown"]).default("unknown"),
    deathIsEstimated: z.boolean().default(false),
    birthPlaceText: z.string().max(500).nullable().optional(),
    deathPlaceText: z.string().max(500).nullable().optional(),
    hometownText: z.string().max(500).nullable().optional(),
    burialPlaceText: z.string().max(500).nullable().optional(),
    occupationText: z.string().max(255).nullable().optional(),
    biography: z.string().max(5000).nullable().optional(),
    verificationStatus: z.enum(["unverified", "verified", "disputed"]).default("unverified"),
    avatarPath: z.string().nullable().optional(),
  })
  .strict();

export const backupRelationshipSchema = z
  .object({
    sourceId: z.string().uuid("Relationship sourceId phải là UUID hợp lệ"),
    parentId: z.string().uuid("parentId phải là UUID hợp lệ"),
    childId: z.string().uuid("childId phải là UUID hợp lệ"),
    parentRole: z.enum(["father", "mother", "unspecified"]),
    relationshipKind: z.enum(["biological", "adoptive", "step", "foster"]),
    verificationStatus: z.enum(["unverified", "verified", "disputed"]).default("unverified"),
  })
  .strict();

export const backupUnionSchema = z
  .object({
    sourceId: z.string().uuid("Union sourceId phải là UUID hợp lệ"),
    status: z.enum(["active", "separated", "divorced", "widowed", "former"]),
    startDate: z.string().nullable().optional(),
    startYear: z.number().int().min(0).max(9999).nullable().optional(),
    startDatePrecision: z.enum(["exact", "year", "unknown"]).default("unknown"),
    startIsEstimated: z.boolean().default(false),
    endDate: z.string().nullable().optional(),
    endYear: z.number().int().min(0).max(9999).nullable().optional(),
    endDatePrecision: z.enum(["exact", "year", "unknown"]).default("unknown"),
    endIsEstimated: z.boolean().default(false),
    notes: z.string().max(2000).nullable().optional(),
    verificationStatus: z.enum(["unverified", "verified", "disputed"]).default("unverified"),
  })
  .strict();

export const backupUnionMemberSchema = z
  .object({
    sourceId: z.string().uuid().nullable().optional(),
    unionId: z.string().uuid("unionId phải là UUID hợp lệ"),
    personId: z.string().uuid("personId phải là UUID hợp lệ"),
    memberRole: z.enum(["spouse", "partner", "unspecified"]),
  })
  .strict();

export const backupMediaMetadataSchema = z
  .object({
    sourceId: z.string().uuid("Media sourceId phải là UUID hợp lệ"),
    personId: z.string().uuid("personId phải là UUID hợp lệ"),
    mimeType: z.string().max(100),
    fileSizeBytes: z.number().int().min(0).nullable().optional(),
    binaryIncluded: z.literal(false),
    availability: z.enum(["metadata_only", "unavailable", "detached"]).default("metadata_only"),
  })
  .strict();

export const backupManifestSchema = z
  .object({
    personCount: z.number().int().min(0),
    relationshipCount: z.number().int().min(0),
    unionCount: z.number().int().min(0),
    mediaCount: z.number().int().min(0),
  })
  .strict();

export const backupDocumentSchema = z
  .object({
    schemaVersion: z.literal(1, {
      errorMap: () => ({ message: "schemaVersion không hợp lệ (yêu cầu là 1)" }),
    }),
    exportedAt: z.string().datetime({ message: "exportedAt phải theo chuẩn ISO 8601 UTC" }),
    generator: z
      .object({
        name: z.literal("GenViet"),
        version: z.string().max(50),
      })
      .strict(),
    tree: backupTreeSchema,
    persons: z.array(backupPersonSchema).max(5000, "Số lượng nhân vật vượt quá giới hạn 5.000"),
    parentChildRelationships: z
      .array(backupRelationshipSchema)
      .max(10000, "Số lượng quan hệ cha/mẹ - con vượt quá 10.000"),
    unions: z.array(backupUnionSchema).max(5000, "Số lượng quan hệ hôn nhân vượt quá 5.000"),
    unionMembers: z
      .array(backupUnionMemberSchema)
      .max(10000, "Số lượng thành viên hôn nhân vượt quá 10.000"),
    mediaMetadata: z.array(backupMediaMetadataSchema).max(10000, "Số lượng media vượt quá 10.000"),
    manifest: backupManifestSchema,
  })
  .strict();

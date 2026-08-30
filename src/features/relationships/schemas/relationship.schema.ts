import { z } from "zod";

const GENDER_ENUM = z.enum(["male", "female", "other", "unknown"]);
const LIVING_STATUS_ENUM = z.enum(["living", "deceased", "unknown"]);
const DATE_PRECISION_ENUM = z.enum(["exact", "year", "unknown"]);
const VERIFICATION_STATUS_ENUM = z.enum(["unverified", "verified", "disputed"]);
const PARENT_ROLE_ENUM = z.enum(["father", "mother", "unspecified"]);
const RELATIONSHIP_KIND_ENUM = z.enum(["biological", "adoptive", "step", "foster"]);
const UNION_STATUS_ENUM = z.enum(["active", "separated", "divorced", "widowed", "former"]);
const UNION_MEMBER_ROLE_ENUM = z.enum(["spouse", "partner", "unspecified"]);

export const addNewParentSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  childId: z.string().uuid("Child ID không hợp lệ"),
  fullName: z
    .string({ required_error: "Họ và tên không được để trống" })
    .trim()
    .min(1, "Họ và tên không được để trống")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .refine(
      (val) => !/[\r\n\t\x00-\x1F\x7F]/.test(val),
      "Họ và tên không được chứa ký tự điều khiển"
    ),
  gender: GENDER_ENUM.default("unknown"),
  livingStatus: LIVING_STATUS_ENUM.default("unknown"),
  birthPrecision: DATE_PRECISION_ENUM.default("unknown"),
  birthDate: z.string().nullable().optional(),
  birthYear: z.number().int().min(100).max(2500).nullable().optional(),
  birthIsEstimated: z.boolean().default(false),
  deathPrecision: DATE_PRECISION_ENUM.default("unknown"),
  deathDate: z.string().nullable().optional(),
  deathYear: z.number().int().min(100).max(2500).nullable().optional(),
  deathIsEstimated: z.boolean().default(false),
  hometownText: z.string().max(255).nullable().optional(),
  occupationText: z.string().max(255).nullable().optional(),
  biography: z.string().max(5000).nullable().optional(),
  parentRole: PARENT_ROLE_ENUM.default("unspecified"),
  relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
  verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
  confirmWarnings: z.boolean().default(false),
});

export const linkExistingParentSchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    parentId: z.string().uuid("Parent ID không hợp lệ"),
    childId: z.string().uuid("Child ID không hợp lệ"),
    parentRole: PARENT_ROLE_ENUM.default("unspecified"),
    relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
    verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
    confirmWarnings: z.boolean().default(false),
  })
  .refine((data) => data.parentId !== data.childId, {
    message: "Một nhân vật không thể tự làm cha/mẹ của chính mình",
    path: ["parentId"],
  });

export const addNewChildSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  parentId: z.string().uuid("Parent ID không hợp lệ"),
  fullName: z
    .string({ required_error: "Họ và tên con không được để trống" })
    .trim()
    .min(1, "Họ và tên con không được để trống")
    .max(100, "Họ và tên con không được vượt quá 100 ký tự")
    .refine(
      (val) => !/[\r\n\t\x00-\x1F\x7F]/.test(val),
      "Họ và tên không được chứa ký tự điều khiển"
    ),
  gender: GENDER_ENUM.default("unknown"),
  livingStatus: LIVING_STATUS_ENUM.default("living"),
  birthPrecision: DATE_PRECISION_ENUM.default("unknown"),
  birthDate: z.string().nullable().optional(),
  birthYear: z.number().int().min(100).max(2500).nullable().optional(),
  birthIsEstimated: z.boolean().default(false),
  deathPrecision: DATE_PRECISION_ENUM.default("unknown"),
  deathDate: z.string().nullable().optional(),
  deathYear: z.number().int().min(100).max(2500).nullable().optional(),
  deathIsEstimated: z.boolean().default(false),
  hometownText: z.string().max(255).nullable().optional(),
  occupationText: z.string().max(255).nullable().optional(),
  biography: z.string().max(5000).nullable().optional(),
  parentRole: PARENT_ROLE_ENUM.default("unspecified"),
  relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
  verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
  otherParentId: z.string().uuid().nullable().optional(),
  otherParentRole: PARENT_ROLE_ENUM.default("unspecified"),
  otherRelationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
  confirmWarnings: z.boolean().default(false),
});

export const linkExistingChildSchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    parentId: z.string().uuid("Parent ID không hợp lệ"),
    childId: z.string().uuid("Child ID không hợp lệ"),
    parentRole: PARENT_ROLE_ENUM.default("unspecified"),
    relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
    verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
    otherParentId: z.string().uuid().nullable().optional(),
    otherParentRole: PARENT_ROLE_ENUM.default("unspecified"),
    otherRelationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
    confirmWarnings: z.boolean().default(false),
  })
  .refine((data) => data.parentId !== data.childId, {
    message: "Một nhân vật không thể tự làm con của chính mình",
    path: ["childId"],
  })
  .refine((data) => !data.otherParentId || data.otherParentId !== data.childId, {
    message: "Một nhân vật không thể tự làm con của chính mình",
    path: ["otherParentId"],
  });

export const createUnionWithNewPersonSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  subjectPersonId: z.string().uuid("Subject Person ID không hợp lệ"),
  fullName: z
    .string({ required_error: "Họ và tên phối ngẫu không được để trống" })
    .trim()
    .min(1, "Họ và tên phối ngẫu không được để trống")
    .max(100, "Họ và tên phối ngẫu không được vượt quá 100 ký tự")
    .refine(
      (val) => !/[\r\n\t\x00-\x1F\x7F]/.test(val),
      "Họ và tên không được chứa ký tự điều khiển"
    ),
  gender: GENDER_ENUM.default("unknown"),
  livingStatus: LIVING_STATUS_ENUM.default("unknown"),
  birthPrecision: DATE_PRECISION_ENUM.default("unknown"),
  birthDate: z.string().nullable().optional(),
  birthYear: z.number().int().min(100).max(2500).nullable().optional(),
  birthIsEstimated: z.boolean().default(false),
  deathPrecision: DATE_PRECISION_ENUM.default("unknown"),
  deathDate: z.string().nullable().optional(),
  deathYear: z.number().int().min(100).max(2500).nullable().optional(),
  deathIsEstimated: z.boolean().default(false),
  hometownText: z.string().max(255).nullable().optional(),
  occupationText: z.string().max(255).nullable().optional(),
  biography: z.string().max(5000).nullable().optional(),
  subjectMemberRole: UNION_MEMBER_ROLE_ENUM.default("spouse"),
  partnerMemberRole: UNION_MEMBER_ROLE_ENUM.default("spouse"),
  unionStatus: UNION_STATUS_ENUM.default("active"),
  startDate: z.string().nullable().optional(),
  startYear: z.number().int().min(100).max(2500).nullable().optional(),
  startDatePrecision: DATE_PRECISION_ENUM.default("unknown"),
  confirmWarnings: z.boolean().default(false),
});

export const createUnionWithExistingPersonSchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    person1Id: z.string().uuid("Person 1 ID không hợp lệ"),
    person2Id: z.string().uuid("Person 2 ID không hợp lệ"),
    member1Role: UNION_MEMBER_ROLE_ENUM.default("spouse"),
    member2Role: UNION_MEMBER_ROLE_ENUM.default("spouse"),
    unionStatus: UNION_STATUS_ENUM.default("active"),
    startDate: z.string().nullable().optional(),
    startYear: z.number().int().min(100).max(2500).nullable().optional(),
    startDatePrecision: DATE_PRECISION_ENUM.default("unknown"),
    confirmWarnings: z.boolean().default(false),
  })
  .refine((data) => data.person1Id !== data.person2Id, {
    message: "Một nhân vật không thể tự kết hôn với chính mình",
    path: ["person2Id"],
  });

export const endUnionSchema = z.object({
  unionId: z.string().uuid("Union ID không hợp lệ"),
  expectedVersion: z.number().int().min(1, "Expected version không hợp lệ"),
  newStatus: UNION_STATUS_ENUM.refine(
    (s) => s !== "active",
    "Trạng thái mới phải là trạng thái đã kết thúc"
  ),
  endDate: z.string().nullable().optional(),
  endYear: z.number().int().min(100).max(2500).nullable().optional(),
  endDatePrecision: DATE_PRECISION_ENUM.default("unknown"),
});

export const softDeleteRelationshipSchema = z.object({
  relationshipId: z.string().uuid("Relationship ID không hợp lệ"),
  expectedVersion: z.number().int().min(1, "Expected version không hợp lệ"),
});

export const softDeleteUnionSchema = z.object({
  unionId: z.string().uuid("Union ID không hợp lệ"),
  expectedVersion: z.number().int().min(1, "Expected version không hợp lệ"),
});

export const replaceParentRelationshipSchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    oldRelationshipId: z.string().uuid("Old Relationship ID không hợp lệ"),
    oldExpectedVersion: z.number().int().min(1, "Expected version không hợp lệ"),
    newParentId: z.string().uuid("New Parent ID không hợp lệ"),
    childId: z.string().uuid("Child ID không hợp lệ"),
    parentRole: PARENT_ROLE_ENUM.default("unspecified"),
    relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
    verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
    confirmWarnings: z.boolean().default(false),
  })
  .refine((data) => data.newParentId !== data.childId, {
    message: "Một nhân vật không thể tự làm cha/mẹ của chính mình",
    path: ["newParentId"],
  });

export const addNewSiblingSchema = z.object({
  treeId: z.string().uuid("Tree ID không hợp lệ"),
  siblingId: z.string().uuid("Sibling ID không hợp lệ"),
  fullName: z
    .string({ required_error: "Họ và tên không được để trống" })
    .trim()
    .min(1, "Họ và tên không được để trống")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .refine(
      (val) => !/[\r\n\t\x00-\x1F\x7F]/.test(val),
      "Họ và tên không được chứa ký tự điều khiển"
    ),
  gender: GENDER_ENUM.default("unknown"),
  livingStatus: LIVING_STATUS_ENUM.default("living"),
  birthPrecision: DATE_PRECISION_ENUM.default("unknown"),
  birthDate: z.string().nullable().optional(),
  birthYear: z.number().int().min(100).max(2500).nullable().optional(),
  birthIsEstimated: z.boolean().default(false),
  deathPrecision: DATE_PRECISION_ENUM.default("unknown"),
  deathDate: z.string().nullable().optional(),
  deathYear: z.number().int().min(100).max(2500).nullable().optional(),
  deathIsEstimated: z.boolean().default(false),
  hometownText: z.string().max(255).nullable().optional(),
  occupationText: z.string().max(255).nullable().optional(),
  biography: z.string().max(5000).nullable().optional(),
  parentIds: z.array(z.string().uuid("Parent ID không hợp lệ")).default([]),
  relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
  verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
  confirmWarnings: z.boolean().default(false),
});

export const linkExistingSiblingSchema = z
  .object({
    treeId: z.string().uuid("Tree ID không hợp lệ"),
    siblingId: z.string().uuid("Sibling ID không hợp lệ"),
    targetPersonId: z.string().uuid("Target Person ID không hợp lệ"),
    parentIds: z.array(z.string().uuid("Parent ID không hợp lệ")).default([]),
    relationshipKind: RELATIONSHIP_KIND_ENUM.default("biological"),
    verificationStatus: VERIFICATION_STATUS_ENUM.default("unverified"),
    confirmWarnings: z.boolean().default(false),
  })
  .refine((data) => data.siblingId !== data.targetPersonId, {
    message: "Một nhân vật không thể tự làm anh/em của chính mình",
    path: ["targetPersonId"],
  });

export type AddNewParentInput = z.infer<typeof addNewParentSchema>;
export type LinkExistingParentInput = z.infer<typeof linkExistingParentSchema>;
export type AddNewChildInput = z.infer<typeof addNewChildSchema>;
export type LinkExistingChildInput = z.infer<typeof linkExistingChildSchema>;
export type AddNewSiblingInput = z.infer<typeof addNewSiblingSchema>;
export type LinkExistingSiblingInput = z.infer<typeof linkExistingSiblingSchema>;
export type CreateUnionWithNewPersonInput = z.infer<typeof createUnionWithNewPersonSchema>;
export type CreateUnionWithExistingPersonInput = z.infer<
  typeof createUnionWithExistingPersonSchema
>;
export type EndUnionInput = z.infer<typeof endUnionSchema>;
export type SoftDeleteRelationshipInput = z.infer<typeof softDeleteRelationshipSchema>;
export type SoftDeleteUnionInput = z.infer<typeof softDeleteUnionSchema>;
export type ReplaceParentRelationshipInput = z.infer<typeof replaceParentRelationshipSchema>;

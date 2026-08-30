import { z } from "zod";

// Regular expression to check for control characters
const CONTROL_CHARS_REGEX = /[\x00-\x1F\x7F]/;

export const familyTreeNameSchema = z
  .string({ required_error: "Tên cây gia phả không được để trống" })
  .trim()
  .min(1, "Tên cây gia phả không được để trống")
  .max(100, "Tên cây gia phả không được vượt quá 100 ký tự")
  .refine((val) => !CONTROL_CHARS_REGEX.test(val), {
    message: "Tên cây gia phả không được chứa ký tự điều khiển",
  })
  .refine((val) => !val.includes("\n") && !val.includes("\r"), {
    message: "Tên cây gia phả không được chứa ký tự xuống dòng",
  });

export const familyTreeDescriptionSchema = z
  .string()
  .max(1000, "Mô tả không được vượt quá 1000 ký tự")
  .optional()
  .nullable()
  .transform((val) => {
    if (!val) return null;
    const trimmed = val.trim();
    return trimmed.length === 0 ? null : trimmed;
  });

export const treePrivacyLevelSchema = z.enum(["private", "public"], {
  errorMap: () => ({ message: "Mức độ riêng tư không hợp lệ" }),
});

export const createFamilyTreeSchema = z.object({
  name: familyTreeNameSchema,
  description: familyTreeDescriptionSchema,
  privacyLevel: treePrivacyLevelSchema.default("private"),
});

export const updateFamilyTreeBasicsSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  name: familyTreeNameSchema,
  description: familyTreeDescriptionSchema,
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
});

export const updateFamilyTreePrivacySchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  privacyLevel: treePrivacyLevelSchema,
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
});

export const setGenerationAnchorSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  generationAnchorPersonId: z
    .string()
    .uuid("ID nhân vật mốc số đời không hợp lệ")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
});

export const deleteFamilyTreeSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
  confirmationName: z.string().trim().min(1, "Vui lòng nhập tên cây gia phả để xác nhận xóa"),
});

export const restoreFamilyTreeSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
});

export type CreateFamilyTreeInput = z.infer<typeof createFamilyTreeSchema>;
export type UpdateFamilyTreeBasicsInput = z.infer<typeof updateFamilyTreeBasicsSchema>;
export type UpdateFamilyTreePrivacyInput = z.infer<typeof updateFamilyTreePrivacySchema>;
export type SetGenerationAnchorInput = z.infer<typeof setGenerationAnchorSchema>;
export type DeleteFamilyTreeInput = z.infer<typeof deleteFamilyTreeSchema>;
export type RestoreFamilyTreeInput = z.infer<typeof restoreFamilyTreeSchema>;

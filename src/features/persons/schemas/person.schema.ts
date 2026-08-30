import { z } from "zod";

const CONTROL_CHARS_REGEX = /[\x00-\x1F\x7F]/;
const EXACT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const personNameSchema = z
  .string({ required_error: "Họ và tên nhân vật không được để trống" })
  .trim()
  .min(1, "Họ và tên nhân vật không được để trống")
  .max(100, "Họ và tên không được vượt quá 100 ký tự")
  .refine((val) => !CONTROL_CHARS_REGEX.test(val), {
    message: "Họ và tên không được chứa ký tự điều khiển",
  })
  .refine((val) => !val.includes("\n") && !val.includes("\r"), {
    message: "Họ và tên không được chứa ký tự xuống dòng",
  });

export const genderSchema = z.enum(["male", "female", "other", "unknown"], {
  errorMap: () => ({ message: "Giới tính không hợp lệ" }),
});

export const livingStatusSchema = z.enum(["living", "deceased", "unknown"], {
  errorMap: () => ({ message: "Trạng thái sống không hợp lệ" }),
});

export const datePrecisionSchema = z.enum(["exact", "year", "unknown"], {
  errorMap: () => ({ message: "Mức độ chính xác ngày tháng không hợp lệ" }),
});

export const verificationStatusSchema = z.enum(["unverified", "verified", "disputed"], {
  errorMap: () => ({ message: "Trạng thái xác minh không hợp lệ" }),
});

export const optionalTextSchema = (maxLength = 255, fieldName = "Trường này") =>
  z
    .string()
    .max(maxLength, `${fieldName} không được vượt quá ${maxLength} ký tự`)
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      const trimmed = val.trim();
      return trimmed.length === 0 ? null : trimmed;
    });

export const rawPersonFieldsSchema = z.object({
  fullName: personNameSchema,
  gender: genderSchema.default("unknown"),
  livingStatus: livingStatusSchema.default("unknown"),

  // Ngày sinh
  birthPrecision: datePrecisionSchema.default("unknown"),
  birthDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || EXACT_DATE_REGEX.test(val), {
      message: "Ngày sinh phải theo định dạng YYYY-MM-DD",
    }),
  birthYear: z.coerce
    .number()
    .int()
    .min(100, "Năm sinh không thể nhỏ hơn 100")
    .max(2500, "Năm sinh không thể lớn hơn 2500")
    .optional()
    .nullable(),
  birthIsEstimated: z.boolean().default(false),

  // Ngày mất
  deathPrecision: datePrecisionSchema.default("unknown"),
  deathDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || EXACT_DATE_REGEX.test(val), {
      message: "Ngày mất phải theo định dạng YYYY-MM-DD",
    }),
  deathYear: z.coerce
    .number()
    .int()
    .min(100, "Năm mất không thể nhỏ hơn 100")
    .max(2500, "Năm mất không thể lớn hơn 2500")
    .optional()
    .nullable(),
  deathIsEstimated: z.boolean().default(false),

  // Thông tin bổ sung
  birthPlaceText: optionalTextSchema(255, "Nơi sinh"),
  deathPlaceText: optionalTextSchema(255, "Nơi mất"),
  hometownText: optionalTextSchema(255, "Quê quán"),
  burialPlaceText: optionalTextSchema(255, "Nơi an táng"),
  occupationText: optionalTextSchema(255, "Nghề nghiệp"),
  biography: optionalTextSchema(5000, "Tiểu sử"),
  verificationStatus: verificationStatusSchema.default("unverified"),
});

function applyDateRefinements<T extends z.ZodTypeAny>(schema: T) {
  return schema
    .refine(
      (data: any) => {
        // 1. Kiểm tra living status vs exact death date
        if (data.livingStatus === "living" && data.deathPrecision === "exact" && data.deathDate) {
          return false;
        }
        return true;
      },
      {
        message: "Nhân vật được đánh dấu 'Còn sống' không thể có ngày mất chính xác.",
        path: ["deathDate"],
      }
    )
    .refine(
      (data: any) => {
        // 2. Chặn Exact Death trước Exact Birth (AC-P12-075)
        if (
          data.birthPrecision === "exact" &&
          data.birthDate &&
          data.deathPrecision === "exact" &&
          data.deathDate
        ) {
          return data.deathDate >= data.birthDate;
        }
        return true;
      },
      {
        message: "Ngày mất không thể diễn ra trước ngày sinh.",
        path: ["deathDate"],
      }
    )
    .refine(
      (data: any) => {
        // 3. Chặn Year Death trước Year Birth khi không ước tính (AC-P12-076)
        const bYear =
          data.birthPrecision === "year"
            ? data.birthYear
            : data.birthPrecision === "exact" && data.birthDate
              ? parseInt(data.birthDate.split("-")[0], 10)
              : null;

        const dYear =
          data.deathPrecision === "year"
            ? data.deathYear
            : data.deathPrecision === "exact" && data.deathDate
              ? parseInt(data.deathDate.split("-")[0], 10)
              : null;

        if (bYear && dYear && !data.birthIsEstimated && !data.deathIsEstimated) {
          return dYear >= bYear;
        }
        return true;
      },
      {
        message: "Năm mất không thể diễn ra trước năm sinh.",
        path: ["deathYear"],
      }
    );
}

export const basePersonFormSchema = applyDateRefinements(rawPersonFieldsSchema);

// Schema tạo Person tối giản
export const minimalCreatePersonSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  fullName: personNameSchema,
  gender: genderSchema.default("unknown"),
  livingStatus: livingStatusSchema.default("unknown"),
  birthPrecision: datePrecisionSchema.default("unknown"),
  birthDate: z.string().optional().nullable(),
  birthYear: z.coerce.number().int().min(100).max(2500).optional().nullable(),
  birthIsEstimated: z.boolean().default(false),
  confirmSimilar: z.boolean().default(false),
});

// Schema tạo Person đầy đủ
export const createPersonSchema = applyDateRefinements(
  rawPersonFieldsSchema.extend({
    treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
    confirmSimilar: z.boolean().default(false),
  })
);

// Schema chỉnh sửa Person
export const updatePersonSchema = applyDateRefinements(
  rawPersonFieldsSchema.extend({
    treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
    personId: z.string().uuid("ID nhân vật không hợp lệ"),
    expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
  })
);

// Schema xóa mềm Person
export const softDeletePersonSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  personId: z.string().uuid("ID nhân vật không hợp lệ"),
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
});

// Schema khôi phục Person
export const restorePersonSchema = z.object({
  treeId: z.string().uuid("ID cây gia phả không hợp lệ"),
  personId: z.string().uuid("ID nhân vật không hợp lệ"),
  expectedVersion: z.coerce.number().int().positive("Version phải là số nguyên dương"),
});

export type MinimalCreatePersonInput = z.infer<typeof minimalCreatePersonSchema>;
export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type SoftDeletePersonInput = z.infer<typeof softDeletePersonSchema>;
export type RestorePersonInput = z.infer<typeof restorePersonSchema>;

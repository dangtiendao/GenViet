import { z } from "zod";

export const SEARCH_LIMITS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
  MIN_QUERY_LENGTH_FOR_FUZZY: 3,
} as const;

export const personSearchQuerySchema = z.object({
  treeId: z.string().uuid({ message: "Mã cây gia phả không hợp lệ." }),
  query: z
    .string()
    .max(100, { message: "Từ khóa tìm kiếm tối đa 100 ký tự." })
    .optional()
    .default(""),
  birthYear: z.coerce
    .number()
    .int()
    .min(100, { message: "Năm sinh không được nhỏ hơn 100." })
    .max(2500, { message: "Năm sinh không được lớn hơn 2500." })
    .optional()
    .nullable(),
  livingStatus: z
    .enum(["all", "living", "deceased", "unknown"], {
      message: "Trạng thái sống không hợp lệ.",
    })
    .optional()
    .default("all"),
  missingInformation: z
    .enum(
      [
        "none",
        "missing_birth",
        "missing_death_for_deceased",
        "missing_hometown",
        "missing_any_core",
      ],
      {
        message: "Bộ lọc thông tin thiếu không hợp lệ.",
      }
    )
    .optional()
    .default("none"),
  cursor: z.string().max(300).optional().nullable(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(SEARCH_LIMITS.MAX_LIMIT)
    .optional()
    .default(SEARCH_LIMITS.DEFAULT_LIMIT),
});

export type PersonSearchQueryInput = z.infer<typeof personSearchQuerySchema>;

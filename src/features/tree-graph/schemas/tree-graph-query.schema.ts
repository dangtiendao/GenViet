import { z } from "zod";

export const TREE_GRAPH_LIMITS = {
  DEFAULT_ANCESTOR_DEPTH: 2,
  DEFAULT_DESCENDANT_DEPTH: 2,
  MAX_ANCESTOR_DEPTH: 5,
  MAX_DESCENDANT_DEPTH: 5,
  MAX_PERSONS_BUDGET: 250,
  MAX_RELATIONSHIPS_BUDGET: 500,
  MAX_UNIONS_BUDGET: 150,
} as const;

export const treeGraphQuerySchema = z
  .object({
    treeId: z
      .string({ required_error: "Mã cây gia phả (treeId) là bắt buộc." })
      .uuid({ message: "Mã cây gia phả không đúng định dạng UUID." }),
    centerPersonId: z
      .string({ required_error: "Mã nhân vật trung tâm (centerPersonId) là bắt buộc." })
      .uuid({ message: "Mã nhân vật trung tâm không đúng định dạng UUID." }),
    ancestorDepth: z
      .number({ invalid_type_error: "Độ sâu tổ tiên phải là số nguyên." })
      .int({ message: "Độ sâu tổ tiên phải là số nguyên." })
      .min(0, { message: "Độ sâu tổ tiên không thể âm." })
      .max(TREE_GRAPH_LIMITS.MAX_ANCESTOR_DEPTH, {
        message: `Độ sâu tổ tiên tối đa là ${TREE_GRAPH_LIMITS.MAX_ANCESTOR_DEPTH}.`,
      })
      .default(TREE_GRAPH_LIMITS.DEFAULT_ANCESTOR_DEPTH),
    descendantDepth: z
      .number({ invalid_type_error: "Độ sâu hậu duệ phải là số nguyên." })
      .int({ message: "Độ sâu hậu duệ phải là số nguyên." })
      .min(0, { message: "Độ sâu hậu duệ không thể âm." })
      .max(TREE_GRAPH_LIMITS.MAX_DESCENDANT_DEPTH, {
        message: `Độ sâu hậu duệ tối đa là ${TREE_GRAPH_LIMITS.MAX_DESCENDANT_DEPTH}.`,
      })
      .default(TREE_GRAPH_LIMITS.DEFAULT_DESCENDANT_DEPTH),
    includeSpouses: z
      .boolean({ invalid_type_error: "Tùy chọn includeSpouses phải là boolean." })
      .default(true),
    includeUnverified: z
      .boolean({ invalid_type_error: "Tùy chọn includeUnverified phải là boolean." })
      .default(true),
    fullTree: z.boolean({ invalid_type_error: "Tùy chọn fullTree phải là boolean." }).optional(),
  })
  .strict({ message: "Không chấp nhận các trường truy vấn không xác định." });

export type TreeGraphQueryInput = z.infer<typeof treeGraphQuerySchema>;

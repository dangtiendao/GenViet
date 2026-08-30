import { z } from "zod";

export const PdfExportOptionsSchema = z.object({
  pageSize: z.enum(["A4", "A3", "Letter"]).default("A4"),
  orientation: z.enum(["portrait", "landscape"]).default("portrait"),
  hideLivingPersons: z.boolean().default(false),
  hideDates: z.boolean().default(false),
  hideAvatars: z.boolean().default(false),
  maxPages: z.number().int().min(1).max(100).default(50),
});

export type PdfExportOptions = z.infer<typeof PdfExportOptionsSchema>;

import { z } from "zod";

export const DocumentTypeSchema = z.enum([
  "birth_certificate",
  "death_certificate",
  "genealogy_book",
  "royal_decree",
  "certificate",
  "letter",
  "other",
]);

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const CreateDocumentSchema = z.object({
  treeId: z.string().uuid(),
  personId: z.string().uuid().optional(),
  documentType: DocumentTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  storagePath: z.string().min(1),
  mimeType: z.string(),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(20 * 1024 * 1024), // Max 20MB
  pageCount: z.number().int().positive().optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;

export interface ScannedDocument {
  id: string;
  treeId: string;
  personId?: string;
  documentType: DocumentType;
  title: string;
  description?: string;
  storagePath: string;
  mimeType: string;
  fileSizeBytes: number;
  pageCount?: number;
  createdAt: string;
}

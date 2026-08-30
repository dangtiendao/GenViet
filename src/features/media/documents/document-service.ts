import { ScannedDocument, CreateDocumentInput } from "./document.types";

const ALLOWED_DOCUMENT_MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export function validateDocumentFile(
  mimeType: string,
  fileSizeBytes: number
): { isValid: boolean; error?: string } {
  if (!ALLOWED_DOCUMENT_MIMES.includes(mimeType)) {
    return {
      isValid: false,
      error: `Invalid document format: ${mimeType}. Allowed formats: PDF, JPEG, PNG, WEBP.`,
    };
  }

  if (fileSizeBytes > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: "File exceeds 20MB maximum limit for documents.",
    };
  }

  return { isValid: true };
}

export function buildScannedDocument(
  input: CreateDocumentInput,
  id: string = crypto.randomUUID()
): ScannedDocument {
  return {
    id,
    treeId: input.treeId,
    personId: input.personId,
    documentType: input.documentType,
    title: input.title.trim(),
    description: input.description?.trim(),
    storagePath: input.storagePath,
    mimeType: input.mimeType,
    fileSizeBytes: input.fileSizeBytes,
    pageCount: input.pageCount,
    createdAt: new Date().toISOString(),
  };
}

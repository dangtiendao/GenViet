import { createHash } from "crypto";
import { backupDocumentSchema } from "../schemas/backup-document.schema";
import { detectSchemaVersion } from "../versioning/version-detector";
import { scanForSecretsAndTokens } from "../mappers/backup-redaction";
import { BACKUP_ERROR_CODES } from "../errors/backup.errors";
import type {
  BackupDocumentDto,
  BackupImportPreviewDto,
  BackupValidationErrorItem,
  BackupValidationReport,
} from "../types/backup.types";

export const MAX_IMPORT_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_REPORTED_ERRORS = 20;

/**
 * Kiểm tra chu trình phả hệ tổ tiên - hậu duệ (Cycle Detection) bằng thuật toán Kahn
 */
function detectGenealogicalCycles(
  personIds: Set<string>,
  relationships: { parentId: string; childId: string }[]
): boolean {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const id of personIds) {
    inDegree.set(id, 0);
    adj.set(id, []);
  }

  for (const r of relationships) {
    if (personIds.has(r.parentId) && personIds.has(r.childId)) {
      adj.get(r.parentId)!.push(r.childId);
      inDegree.set(r.childId, (inDegree.get(r.childId) || 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  let visitedCount = 0;
  while (queue.length > 0) {
    const u = queue.shift()!;
    visitedCount++;

    for (const v of adj.get(u) || []) {
      const newDeg = (inDegree.get(v) || 0) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) {
        queue.push(v);
      }
    }
  }

  return visitedCount !== personIds.size;
}

/**
 * Pipeline xác thực đa tầng tệp sao lưu JSON
 */
export function validateBackupFile(fileContent: string): {
  isValid: boolean;
  doc: BackupDocumentDto | null;
  preview: BackupImportPreviewDto | null;
  report: BackupValidationReport;
} {
  const errors: BackupValidationErrorItem[] = [];
  const warnings: BackupValidationErrorItem[] = [];

  // Tính mã băm SHA-256
  const digestSha256 = createHash("sha256").update(fileContent, "utf8").digest("hex");

  // 1. Kiểm tra dung lượng
  const byteLength = Buffer.byteLength(fileContent, "utf8");
  if (byteLength > MAX_IMPORT_FILE_SIZE_BYTES) {
    errors.push({
      section: "file",
      code: BACKUP_ERROR_CODES.FILE_TOO_LARGE,
      message: `Dung lượng tệp (${(byteLength / (1024 * 1024)).toFixed(2)} MB) vượt quá giới hạn tối đa cho phép là 10 MB.`,
      severity: "error",
      blocking: true,
    });
    return {
      isValid: false,
      doc: null,
      preview: null,
      report: { isValid: false, errors, warnings },
    };
  }

  // 2. Parse JSON & Chống Prototype Pollution
  let parsed: any;
  try {
    if (fileContent.includes('"__proto__"') || fileContent.includes('"constructor"')) {
      errors.push({
        section: "file",
        code: BACKUP_ERROR_CODES.JSON_INVALID,
        message: "Tệp chứa các từ khóa đối tượng không an toàn (__proto__).",
        severity: "error",
        blocking: true,
      });
      return {
        isValid: false,
        doc: null,
        preview: null,
        report: { isValid: false, errors, warnings },
      };
    }
    parsed = JSON.parse(fileContent);
  } catch (err: any) {
    errors.push({
      section: "file",
      code: BACKUP_ERROR_CODES.JSON_INVALID,
      message: `Cú pháp JSON không hợp lệ: ${err.message}`,
      severity: "error",
      blocking: true,
    });
    return {
      isValid: false,
      doc: null,
      preview: null,
      report: { isValid: false, errors, warnings },
    };
  }

  // 3. Kiểm tra Version
  const versionInfo = detectSchemaVersion(parsed);
  if (!versionInfo.isSupported) {
    errors.push({
      section: "file",
      fieldPath: "schemaVersion",
      code:
        versionInfo.status === "future"
          ? BACKUP_ERROR_CODES.VERSION_TOO_NEW
          : versionInfo.status === "missing"
            ? BACKUP_ERROR_CODES.SCHEMA_VERSION_MISSING
            : BACKUP_ERROR_CODES.VERSION_UNSUPPORTED,
      message: versionInfo.message,
      severity: "error",
      blocking: true,
    });
  }

  // 4. Validate cấu trúc bằng Zod Schema
  const schemaResult = backupDocumentSchema.safeParse(parsed);
  if (!schemaResult.success) {
    for (const issue of schemaResult.error.issues) {
      const pathStr = issue.path.join(".");
      const sectionName = (issue.path[0] as any) || "file";
      const recordIdx = typeof issue.path[1] === "number" ? issue.path[1] : undefined;

      errors.push({
        section: sectionName,
        recordIndex: recordIdx,
        fieldPath: pathStr,
        code: BACKUP_ERROR_CODES.SCHEMA_INVALID,
        message: `${pathStr ? `[${pathStr}] ` : ""}${issue.message}`,
        severity: "error",
        blocking: true,
      });
    }
  }

  // Nếu đã có lỗi schema cơ bản, dừng và trả báo cáo sớm
  if (errors.length > 0) {
    const limitedErrors = errors.slice(0, MAX_REPORTED_ERRORS);
    const additionalErrorsCount =
      errors.length > MAX_REPORTED_ERRORS ? errors.length - MAX_REPORTED_ERRORS : 0;
    return {
      isValid: false,
      doc: null,
      preview: null,
      report: {
        isValid: false,
        errors: limitedErrors,
        warnings,
        additionalErrorsCount,
      },
    };
  }

  const doc = schemaResult.data as BackupDocumentDto;

  // 5. Semantic & Reference Validation
  const personIds = new Set<string>();
  for (let i = 0; i < doc.persons.length; i++) {
    const p = doc.persons[i];
    if (personIds.has(p.sourceId)) {
      errors.push({
        section: "persons",
        recordIndex: i,
        sourceId: p.sourceId,
        fieldPath: `persons[${i}].sourceId`,
        code: BACKUP_ERROR_CODES.DUPLICATE_ID,
        message: `Trùng lặp sourceId nhân vật: "${p.sourceId}" (${p.fullName}).`,
        severity: "error",
        blocking: true,
      });
    }
    personIds.add(p.sourceId);

    // Date Invariant
    if (p.birthYear && p.deathYear && p.deathYear < p.birthYear) {
      errors.push({
        section: "persons",
        recordIndex: i,
        sourceId: p.sourceId,
        fieldPath: `persons[${i}].deathYear`,
        code: BACKUP_ERROR_CODES.SEMANTIC_INVALID,
        message: `Năm mất (${p.deathYear}) không thể nhỏ hơn năm sinh (${p.birthYear}) của "${p.fullName}".`,
        severity: "error",
        blocking: true,
      });
    }
  }

  // Validate Parent-Child Relationships
  const relIds = new Set<string>();
  const relPairs = new Set<string>();
  for (let i = 0; i < doc.parentChildRelationships.length; i++) {
    const r = doc.parentChildRelationships[i];
    if (relIds.has(r.sourceId)) {
      errors.push({
        section: "parentChildRelationships",
        recordIndex: i,
        sourceId: r.sourceId,
        fieldPath: `parentChildRelationships[${i}].sourceId`,
        code: BACKUP_ERROR_CODES.DUPLICATE_ID,
        message: `Trùng lặp sourceId quan hệ: "${r.sourceId}".`,
        severity: "error",
        blocking: true,
      });
    }
    relIds.add(r.sourceId);

    // Dangling Parent / Child
    if (!personIds.has(r.parentId)) {
      errors.push({
        section: "parentChildRelationships",
        recordIndex: i,
        sourceId: r.sourceId,
        fieldPath: `parentChildRelationships[${i}].parentId`,
        code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
        message: `parentId "${r.parentId}" không tồn tại trong danh sách nhân vật.`,
        severity: "error",
        blocking: true,
      });
    }
    if (!personIds.has(r.childId)) {
      errors.push({
        section: "parentChildRelationships",
        recordIndex: i,
        sourceId: r.sourceId,
        fieldPath: `parentChildRelationships[${i}].childId`,
        code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
        message: `childId "${r.childId}" không tồn tại trong danh sách nhân vật.`,
        severity: "error",
        blocking: true,
      });
    }

    // Self-link
    if (r.parentId === r.childId) {
      errors.push({
        section: "parentChildRelationships",
        recordIndex: i,
        sourceId: r.sourceId,
        fieldPath: `parentChildRelationships[${i}]`,
        code: BACKUP_ERROR_CODES.SEMANTIC_INVALID,
        message: `Quan hệ tự liên kết (Self-link): parentId và childId cùng là "${r.parentId}".`,
        severity: "error",
        blocking: true,
      });
    }

    // Duplicate relationship pair
    const pairKey = `${r.parentId}:${r.childId}`;
    if (relPairs.has(pairKey)) {
      errors.push({
        section: "parentChildRelationships",
        recordIndex: i,
        sourceId: r.sourceId,
        fieldPath: `parentChildRelationships[${i}]`,
        code: BACKUP_ERROR_CODES.SEMANTIC_INVALID,
        message: `Trùng lặp cặp quan hệ cha/mẹ - con giữa "${r.parentId}" và "${r.childId}".`,
        severity: "error",
        blocking: true,
      });
    }
    relPairs.add(pairKey);
  }

  // Cycle Detection
  if (personIds.size > 0 && doc.parentChildRelationships.length > 0) {
    const hasCycle = detectGenealogicalCycles(personIds, doc.parentChildRelationships);
    if (hasCycle) {
      errors.push({
        section: "parentChildRelationships",
        code: BACKUP_ERROR_CODES.CYCLE_DETECTED,
        message: "Phát hiện chu trình phả hệ tổ tiên - hậu duệ không hợp lệ trong các mối quan hệ.",
        severity: "error",
        blocking: true,
      });
    }
  }

  // Validate Unions & Union Members
  const unionIds = new Set<string>();
  for (let i = 0; i < doc.unions.length; i++) {
    const u = doc.unions[i];
    if (unionIds.has(u.sourceId)) {
      errors.push({
        section: "unions",
        recordIndex: i,
        sourceId: u.sourceId,
        fieldPath: `unions[${i}].sourceId`,
        code: BACKUP_ERROR_CODES.DUPLICATE_ID,
        message: `Trùng lặp sourceId hôn nhân: "${u.sourceId}".`,
        severity: "error",
        blocking: true,
      });
    }
    unionIds.add(u.sourceId);
  }

  for (let i = 0; i < doc.unionMembers.length; i++) {
    const m = doc.unionMembers[i];
    if (!unionIds.has(m.unionId)) {
      errors.push({
        section: "unionMembers",
        recordIndex: i,
        fieldPath: `unionMembers[${i}].unionId`,
        code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
        message: `unionId "${m.unionId}" không tồn tại trong danh sách hôn nhân.`,
        severity: "error",
        blocking: true,
      });
    }
    if (!personIds.has(m.personId)) {
      errors.push({
        section: "unionMembers",
        recordIndex: i,
        fieldPath: `unionMembers[${i}].personId`,
        code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
        message: `personId "${m.personId}" không tồn tại trong danh sách nhân vật.`,
        severity: "error",
        blocking: true,
      });
    }
  }

  // Validate Generation Anchor & Default Person
  if (doc.tree.generationAnchorPersonId && !personIds.has(doc.tree.generationAnchorPersonId)) {
    errors.push({
      section: "tree",
      fieldPath: "tree.generationAnchorPersonId",
      code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
      message: `generationAnchorPersonId "${doc.tree.generationAnchorPersonId}" không tồn tại trong danh sách nhân vật.`,
      severity: "error",
      blocking: true,
    });
  }

  if (doc.tree.defaultPersonId && !personIds.has(doc.tree.defaultPersonId)) {
    errors.push({
      section: "tree",
      fieldPath: "tree.defaultPersonId",
      code: BACKUP_ERROR_CODES.REFERENCE_MISSING,
      message: `defaultPersonId "${doc.tree.defaultPersonId}" không tồn tại trong danh sách nhân vật.`,
      severity: "error",
      blocking: true,
    });
  }

  // Validate Manifest Counts
  if (doc.manifest.personCount !== doc.persons.length) {
    errors.push({
      section: "manifest",
      fieldPath: "manifest.personCount",
      code: BACKUP_ERROR_CODES.MANIFEST_MISMATCH,
      message: `Manifest personCount (${doc.manifest.personCount}) không khớp với số lượng nhân vật thực tế (${doc.persons.length}).`,
      severity: "error",
      blocking: true,
    });
  }

  if (doc.manifest.relationshipCount !== doc.parentChildRelationships.length) {
    errors.push({
      section: "manifest",
      fieldPath: "manifest.relationshipCount",
      code: BACKUP_ERROR_CODES.MANIFEST_MISMATCH,
      message: `Manifest relationshipCount (${doc.manifest.relationshipCount}) không khớp với số lượng quan hệ thực tế (${doc.parentChildRelationships.length}).`,
      severity: "error",
      blocking: true,
    });
  }

  if (doc.manifest.unionCount !== doc.unions.length) {
    errors.push({
      section: "manifest",
      fieldPath: "manifest.unionCount",
      code: BACKUP_ERROR_CODES.MANIFEST_MISMATCH,
      message: `Manifest unionCount (${doc.manifest.unionCount}) không khớp với số lượng hôn nhân thực tế (${doc.unions.length}).`,
      severity: "error",
      blocking: true,
    });
  }

  // 6. Quét Secret & Signed URLs
  const secretViolations = scanForSecretsAndTokens(parsed);
  for (const violation of secretViolations) {
    errors.push({
      section: "file",
      code: BACKUP_ERROR_CODES.SECRET_FIELD_DETECTED,
      message: violation,
      severity: "error",
      blocking: true,
    });
  }

  // Cảnh báo media binary không bao gồm
  if (doc.mediaMetadata.length > 0) {
    warnings.push({
      section: "mediaMetadata",
      code: "MEDIA_BINARY_NOT_INCLUDED",
      message: `Tệp chứa siêu dữ liệu của ${doc.mediaMetadata.length} ảnh. Dữ liệu nhị phân của ảnh không được bao gồm trong file JSON, các nhân vật sẽ sử dụng avatar mặc định sau khi nhập.`,
      severity: "warning",
      blocking: false,
    });
  }

  const isValid = errors.length === 0;
  const limitedErrors = errors.slice(0, MAX_REPORTED_ERRORS);
  const additionalErrorsCount =
    errors.length > MAX_REPORTED_ERRORS ? errors.length - MAX_REPORTED_ERRORS : 0;

  const report: BackupValidationReport = {
    isValid,
    errors: limitedErrors,
    warnings,
    additionalErrorsCount,
  };

  const preview: BackupImportPreviewDto = {
    schemaVersion: doc.schemaVersion,
    sourceTreeName: doc.tree.name,
    estimatedNewTreeName: `${doc.tree.name} (Bản nhập)`,
    targetPrivacy: "private",
    isVersionSupported: versionInfo.isSupported,
    versionStatus: versionInfo.status,
    personCount: doc.persons.length,
    relationshipCount: doc.parentChildRelationships.length,
    unionCount: doc.unions.length,
    unionMemberCount: doc.unionMembers.length,
    mediaCount: doc.mediaMetadata.length,
    mediaBinaryIncluded: false,
    digestSha256,
    hasAnchorPerson: !!doc.tree.generationAnchorPersonId,
    hasDefaultPerson: !!doc.tree.defaultPersonId,
    validationReport: report,
  };

  return {
    isValid,
    doc: isValid ? doc : null,
    preview,
    report,
  };
}

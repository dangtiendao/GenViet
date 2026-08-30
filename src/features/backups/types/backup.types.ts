export const BACKUP_CURRENT_SCHEMA_VERSION = 1;
export const BACKUP_SUPPORTED_SCHEMA_VERSIONS = [1] as const;

export type SupportedSchemaVersion = (typeof BACKUP_SUPPORTED_SCHEMA_VERSIONS)[number];

export interface BackupGeneratorDto {
  name: "GenViet";
  version: string;
}

export interface BackupTreeDto {
  sourceId?: string;
  name: string;
  description: string | null;
  privacyLevel: "private" | "public";
  generationAnchorPersonId: string | null;
  defaultPersonId: string | null;
}

export interface BackupPersonDto {
  sourceId: string;
  fullName: string;
  gender: "male" | "female" | "other" | "unknown";
  livingStatus: "living" | "deceased" | "unknown";
  birthDate: string | null;
  birthYear: number | null;
  birthDatePrecision: "exact" | "year" | "unknown";
  birthIsEstimated: boolean;
  deathDate: string | null;
  deathYear: number | null;
  deathDatePrecision: "exact" | "year" | "unknown";
  deathIsEstimated: boolean;
  birthPlaceText: string | null;
  deathPlaceText: string | null;
  hometownText: string | null;
  burialPlaceText: string | null;
  occupationText: string | null;
  biography: string | null;
  verificationStatus: "unverified" | "verified" | "disputed";
  avatarPath: string | null;
}

export interface BackupRelationshipDto {
  sourceId: string;
  parentId: string;
  childId: string;
  parentRole: "father" | "mother" | "unspecified";
  relationshipKind: "biological" | "adoptive" | "step" | "foster";
  verificationStatus: "unverified" | "verified" | "disputed";
}

export interface BackupUnionDto {
  sourceId: string;
  status: "active" | "separated" | "divorced" | "widowed" | "former";
  startDate: string | null;
  startYear: number | null;
  startDatePrecision: "exact" | "year" | "unknown";
  startIsEstimated: boolean;
  endDate: string | null;
  endYear: number | null;
  endDatePrecision: "exact" | "year" | "unknown";
  endIsEstimated: boolean;
  notes: string | null;
  verificationStatus: "unverified" | "verified" | "disputed";
}

export interface BackupUnionMemberDto {
  sourceId?: string | null;
  unionId: string;
  personId: string;
  memberRole: "spouse" | "partner" | "unspecified";
}

export interface BackupMediaMetadataDto {
  sourceId: string;
  personId: string;
  mimeType: string;
  fileSizeBytes: number | null;
  binaryIncluded: false;
  availability: "metadata_only" | "unavailable" | "detached";
}

export interface BackupManifestDto {
  personCount: number;
  relationshipCount: number;
  unionCount: number;
  mediaCount: number;
}

export interface BackupDocumentDto {
  schemaVersion: 1;
  exportedAt: string;
  generator: BackupGeneratorDto;
  tree: BackupTreeDto;
  persons: BackupPersonDto[];
  parentChildRelationships: BackupRelationshipDto[];
  unions: BackupUnionDto[];
  unionMembers: BackupUnionMemberDto[];
  mediaMetadata: BackupMediaMetadataDto[];
  manifest: BackupManifestDto;
}

export interface BackupValidationErrorItem {
  section:
    | "file"
    | "tree"
    | "persons"
    | "parentChildRelationships"
    | "unions"
    | "unionMembers"
    | "mediaMetadata"
    | "manifest";
  recordIndex?: number;
  sourceId?: string;
  fieldPath?: string;
  code: string;
  message: string;
  severity: "error" | "warning";
  blocking: boolean;
}

export interface BackupValidationReport {
  isValid: boolean;
  errors: BackupValidationErrorItem[];
  warnings: BackupValidationErrorItem[];
  additionalErrorsCount?: number;
}

export interface BackupImportPreviewDto {
  schemaVersion: number;
  sourceTreeName: string;
  estimatedNewTreeName: string;
  targetPrivacy: "private";
  isVersionSupported: boolean;
  versionStatus: "current" | "supported_old" | "unsupported_old" | "future" | "missing" | "invalid";
  personCount: number;
  relationshipCount: number;
  unionCount: number;
  unionMemberCount: number;
  mediaCount: number;
  mediaBinaryIncluded: false;
  digestSha256: string;
  hasAnchorPerson: boolean;
  hasDefaultPerson: boolean;
  validationReport: BackupValidationReport;
}

export interface BackupImportResultDto {
  success: boolean;
  treeId?: string;
  treeName?: string;
  personCount?: number;
  relationshipCount?: number;
  unionCount?: number;
  error?: string;
  errorCode?: string;
  validationReport?: BackupValidationReport;
}

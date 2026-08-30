export interface FieldResolutionChoice {
  fieldName: string;
  chosenValue: any;
  sourcePersonId: string;
}

export interface MergeProfileInput {
  treeId: string;
  survivorPersonId: string;
  duplicatePersonId: string;
  survivorBaseVersion: number;
  duplicateBaseVersion: number;
  fieldResolutions: FieldResolutionChoice[];
}

export interface MergePreview {
  survivorPersonId: string;
  duplicatePersonId: string;
  resolvedPersonData: Record<string, any>;
  relationshipsToTransferCount: number;
  eventsToTransferCount: number;
  mediaToTransferCount: number;
  isSafe: boolean;
  warnings: string[];
}

export interface MergeResult {
  success: boolean;
  mergedPersonId: string;
  tombstonedPersonId: string;
  auditEventId: string;
}

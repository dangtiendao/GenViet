import type {
  BackupDocumentDto,
  BackupPersonDto,
  BackupRelationshipDto,
  BackupUnionDto,
  BackupUnionMemberDto,
  BackupMediaMetadataDto,
} from "../types/backup.types";

export interface GeneratedIdMaps {
  newTreeId: string;
  personMap: Map<string, string>; // sourcePersonId -> newPersonId
  relationshipMap: Map<string, string>; // sourceRelationshipId -> newRelationshipId
  unionMap: Map<string, string>; // sourceUnionId -> newUnionId
  mediaMap: Map<string, string>; // sourceMediaId -> newMediaId
}

/**
 * Sinh UUID ngẫu nhiên theo chuẩn RFC4122 v4
 */
export function generateRandomUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Khởi tạo bảng ánh xạ ID cũ sang UUID mới cho toàn bộ các thực thể trong tài liệu backup
 */
export function buildIdMaps(doc: BackupDocumentDto): GeneratedIdMaps {
  const newTreeId = generateRandomUuid();
  const personMap = new Map<string, string>();
  const relationshipMap = new Map<string, string>();
  const unionMap = new Map<string, string>();
  const mediaMap = new Map<string, string>();

  // 1. Ánh xạ Persons
  for (const p of doc.persons) {
    personMap.set(p.sourceId, generateRandomUuid());
  }

  // 2. Ánh xạ Relationships
  for (const r of doc.parentChildRelationships) {
    relationshipMap.set(r.sourceId, generateRandomUuid());
  }

  // 3. Ánh xạ Unions
  for (const u of doc.unions) {
    unionMap.set(u.sourceId, generateRandomUuid());
  }

  // 4. Ánh xạ Media Metadata
  for (const m of doc.mediaMetadata) {
    mediaMap.set(m.sourceId, generateRandomUuid());
  }

  return {
    newTreeId,
    personMap,
    relationshipMap,
    unionMap,
    mediaMap,
  };
}

/**
 * Chuẩn bị payload dữ liệu đã được ánh xạ ID mới toàn diện để chuyển giao cho database transaction
 */
export function remapBackupDocument(
  doc: BackupDocumentDto,
  maps: GeneratedIdMaps
): {
  tree: {
    id: string;
    name: string;
    description: string | null;
    privacyLevel: "private";
    generationAnchorPersonId: string | null;
    defaultPersonId: string | null;
  };
  persons: (Omit<BackupPersonDto, "sourceId"> & { id: string; treeId: string })[];
  parentChildRelationships: (Omit<BackupRelationshipDto, "sourceId" | "parentId" | "childId"> & {
    id: string;
    treeId: string;
    parentId: string;
    childId: string;
  })[];
  unions: (Omit<BackupUnionDto, "sourceId"> & { id: string; treeId: string })[];
  unionMembers: (Omit<BackupUnionMemberDto, "sourceId" | "unionId" | "personId"> & {
    id: string;
    treeId: string;
    unionId: string;
    personId: string;
  })[];
  mediaMetadata: (Omit<BackupMediaMetadataDto, "sourceId" | "personId"> & {
    id: string;
    treeId: string;
    personId: string;
  })[];
} {
  const { newTreeId, personMap, relationshipMap, unionMap, mediaMap } = maps;

  // 1. Remap Tree
  const mappedAnchorId = doc.tree.generationAnchorPersonId
    ? personMap.get(doc.tree.generationAnchorPersonId) || null
    : null;

  const mappedDefaultPersonId = doc.tree.defaultPersonId
    ? personMap.get(doc.tree.defaultPersonId) || null
    : null;

  const tree = {
    id: newTreeId,
    name: doc.tree.name,
    description: doc.tree.description || null,
    privacyLevel: "private" as const, // Luôn mặc định là private
    generationAnchorPersonId: mappedAnchorId,
    defaultPersonId: mappedDefaultPersonId,
  };

  // 2. Remap Persons
  const persons = doc.persons.map((p) => {
    const newId = personMap.get(p.sourceId)!;
    const { sourceId, ...rest } = p;
    return {
      ...rest,
      id: newId,
      treeId: newTreeId,
      avatarPath: null, // Không trỏ tới file Storage cũ
    };
  });

  // 3. Remap Relationships
  const parentChildRelationships = doc.parentChildRelationships.map((r) => {
    const newId = relationshipMap.get(r.sourceId)!;
    const newParentId = personMap.get(r.parentId)!;
    const newChildId = personMap.get(r.childId)!;
    const { sourceId, parentId, childId, ...rest } = r;
    return {
      ...rest,
      id: newId,
      treeId: newTreeId,
      parentId: newParentId,
      childId: newChildId,
    };
  });

  // 4. Remap Unions
  const unions = doc.unions.map((u) => {
    const newId = unionMap.get(u.sourceId)!;
    const { sourceId, ...rest } = u;
    return {
      ...rest,
      id: newId,
      treeId: newTreeId,
    };
  });

  // 5. Remap Union Members
  const unionMembers = doc.unionMembers.map((m) => {
    const newUnionId = unionMap.get(m.unionId)!;
    const newPersonId = personMap.get(m.personId)!;
    const { sourceId, unionId, personId, ...rest } = m;
    return {
      ...rest,
      id: generateRandomUuid(),
      treeId: newTreeId,
      unionId: newUnionId,
      personId: newPersonId,
    };
  });

  // 6. Remap Media Metadata
  const mediaMetadata = doc.mediaMetadata.map((m) => {
    const newId = mediaMap.get(m.sourceId)!;
    const newPersonId = personMap.get(m.personId)!;
    const { sourceId, personId, ...rest } = m;
    return {
      ...rest,
      id: newId,
      treeId: newTreeId,
      personId: newPersonId,
    };
  });

  return {
    tree,
    persons,
    parentChildRelationships,
    unions,
    unionMembers,
    mediaMetadata,
  };
}

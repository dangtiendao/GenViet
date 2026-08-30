import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { buildIdMaps, remapBackupDocument } from "@/features/backups/utils/import-id-map";
import type { BackupDocumentDto } from "@/features/backups/types/backup.types";

describe("Backup ID Mapping & Foreign Key Rewrite", () => {
  const filePath = resolve(__dirname, "../../fixtures/backups/valid-v1.json");
  const doc = JSON.parse(readFileSync(filePath, "utf-8")) as BackupDocumentDto;

  it("sinh ID mới cho toàn bộ các thực thể khác biệt với source IDs", () => {
    const maps = buildIdMaps(doc);

    expect(maps.newTreeId).not.toBe(doc.tree.sourceId);
    expect(maps.personMap.size).toBe(doc.persons.length);

    for (const p of doc.persons) {
      const mappedId = maps.personMap.get(p.sourceId);
      expect(mappedId).toBeDefined();
      expect(mappedId).not.toBe(p.sourceId);
    }
  });

  it("rewrite toàn bộ foreign keys cha/con và mốc thế hệ chính xác", () => {
    const maps = buildIdMaps(doc);
    const remapped = remapBackupDocument(doc, maps);

    expect(remapped.tree.id).toBe(maps.newTreeId);
    expect(remapped.tree.privacyLevel).toBe("private");
    expect(remapped.tree.generationAnchorPersonId).toBe(
      maps.personMap.get(doc.tree.generationAnchorPersonId!)
    );

    // Kiểm tra quan hệ
    for (const r of remapped.parentChildRelationships) {
      expect(r.treeId).toBe(maps.newTreeId);
      expect(Array.from(maps.personMap.values())).toContain(r.parentId);
      expect(Array.from(maps.personMap.values())).toContain(r.childId);
    }
  });
});

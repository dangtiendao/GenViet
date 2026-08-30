import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { backupDocumentSchema } from "@/features/backups/schemas/backup-document.schema";

describe("Backup Document Zod Schema Validation", () => {
  it("chấp nhận fixture valid-v1.json chuẩn", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/valid-v1.json");
    const json = JSON.parse(readFileSync(filePath, "utf-8"));

    const result = backupDocumentSchema.safeParse(json);
    expect(result.success).toBe(true);
  });

  it("từ chối fixture invalid-schema.json", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/invalid-schema.json");
    const json = JSON.parse(readFileSync(filePath, "utf-8"));

    const result = backupDocumentSchema.safeParse(json);
    expect(result.success).toBe(false);
  });

  it("từ chối document khi xuất hiện trường lạ (strict rejection)", () => {
    const filePath = resolve(__dirname, "../../fixtures/backups/valid-v1.json");
    const json = JSON.parse(readFileSync(filePath, "utf-8"));

    json.tree.unknown_extra_field = "dangerous_data";

    const result = backupDocumentSchema.safeParse(json);
    expect(result.success).toBe(false);
  });
});

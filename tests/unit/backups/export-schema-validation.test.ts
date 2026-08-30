import { describe, it, expect } from "vitest";
import { validateBackupFile } from "@/features/backups/services/backup-import-validator";
import { scanForSecretsAndTokens } from "@/features/backups/mappers/backup-redaction";
import type { BackupDocumentDto } from "@/features/backups/types/backup.types";

describe("P22-T06: Kiểm thử JSON Schema sao lưu & Loại bỏ dữ liệu nhạy cảm (Export Schema)", () => {
  const validDoc: BackupDocumentDto = {
    schemaVersion: 1,
    generator: {
      name: "GenViet",
      version: "0.1.0",
    },
    exportedAt: "2026-08-30T10:00:00Z",
    tree: {
      sourceId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      name: "Gia Phả Họ Nguyễn",
      description: "Cây gia phả chi trưởng",
      privacyLevel: "private",
      generationAnchorPersonId: null,
      defaultPersonId: null,
    },
    persons: [
      {
        sourceId: "11111111-1111-4111-a111-111111111111",
        fullName: "Nguyễn Văn A",
        gender: "male",
        livingStatus: "living",
        birthDate: "1980-05-15",
        birthYear: 1980,
        birthDatePrecision: "exact",
        birthIsEstimated: false,
        deathDate: null,
        deathYear: null,
        deathDatePrecision: "unknown",
        deathIsEstimated: false,
        birthPlaceText: null,
        deathPlaceText: null,
        hometownText: null,
        burialPlaceText: null,
        occupationText: null,
        biography: null,
        verificationStatus: "verified",
        avatarPath: null,
      },
    ],
    parentChildRelationships: [],
    unions: [],
    unionMembers: [],
    mediaMetadata: [],
    manifest: {
      personCount: 1,
      relationshipCount: 0,
      unionCount: 0,
      mediaCount: 0,
    },
  };

  it("tài liệu hợp lệ vượt qua kiểm tra JSON Schema với 0 lỗi", () => {
    const fileContent = JSON.stringify(validDoc);
    const result = validateBackupFile(fileContent);
    expect(result.isValid).toBe(true);
    expect(result.report.errors.length).toBe(0);
  });

  it("hàm scanForSecretsAndTokens phát hiện chính xác signed URLs hoặc tokens bí mật", () => {
    const docWithSecrets: any = {
      ...validDoc,
      persons: [
        {
          ...validDoc.persons[0],
          avatarThumbnailUrl:
            "https://supabase.co/storage/v1/object/sign/avatar.webp?token=secret123",
        },
      ],
    };

    const violations = scanForSecretsAndTokens(docWithSecrets);
    expect(violations.length).toBeGreaterThan(0);
  });
});

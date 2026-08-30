import { describe, it, expect } from "vitest";
import {
  scanForSecretsAndTokens,
  assertNoSecretsInBackup,
} from "@/features/backups/mappers/backup-redaction";

describe("Backup Redaction & Secret Scanner", () => {
  it("phát hiện các từ khóa token/password/signed_url trong các thuộc tính lồng nhau", () => {
    const payload = {
      tree: {
        name: "Cây an toàn",
      },
      persons: [
        {
          fullName: "Nguyễn Văn Test",
          password: "plain_password",
          details: {
            signed_url: "https://storage.supabase.co/v1/object/sign/avatars/x?token=123",
          },
        },
      ],
    };

    const violations = scanForSecretsAndTokens(payload);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some((v) => v.includes("password"))).toBe(true);
    expect(violations.some((v) => v.includes("signed_url"))).toBe(true);
  });

  it("assertNoSecretsInBackup ném ngoại lệ khi có secret", () => {
    const payload = {
      access_token: "jwt.secret.token",
    };

    expect(() => assertNoSecretsInBackup(payload)).toThrowError();
  });

  it("chấp nhận payload hoàn toàn sạch", () => {
    const payload = {
      schemaVersion: 1,
      tree: { name: "Cây sạch" },
      persons: [{ fullName: "Nguyễn Văn A" }],
    };

    expect(() => assertNoSecretsInBackup(payload)).not.toThrow();
  });
});

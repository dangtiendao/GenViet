import { describe, it, expect } from "vitest";
import {
  redactLivingPerson,
  type RawPersonEntity,
} from "@/features/public-trees/privacy/living-person-redaction";

describe("P30-T48, AC-P30-039..044: Living Person PII Leakage Sentinel Security Tests", () => {
  const sensitiveLivingPerson: RawPersonEntity & {
    email?: string;
    phone?: string;
    address?: string;
    privateNotes?: string;
    biography?: string;
  } = {
    id: "p-sensitive-999",
    fullName: "Nguyễn Văn Nhạy Cảm",
    gender: "male",
    livingStatus: "living",
    birthDate: "1995-12-31",
    birthYear: 1995,
    email: "nguyen.nhaycam@gmail.com",
    phone: "+84901234567",
    address: "Số 123 Đường Nhạy Cảm, Quận 1, TP.HCM",
    privateNotes: "Ghi chú tài sản thừa kế nội bộ gia đình",
    biography: "Tiểu sử chi tiết riêng tư",
  };

  it("đảm bảo không một trường PII nhạy cảm nào rò rỉ vào PublicPersonDto", () => {
    const publicDto = redactLivingPerson(sensitiveLivingPerson, "REDACTED");

    // 1. Kiểm tra allowlist fields
    const allowedKeys = new Set([
      "id",
      "displayName",
      "gender",
      "livingState",
      "birthYear",
      "deathYear",
      "isEstimated",
      "isCenter",
      "publicThumbnail",
      "visibility",
    ]);

    const dtoKeys = Object.keys(publicDto);
    for (const key of dtoKeys) {
      expect(allowedKeys.has(key)).toBe(true);
    }

    // 2. Kiểm tra các trường bị cấm tuyệt đối
    const forbiddenValues = [
      sensitiveLivingPerson.email,
      sensitiveLivingPerson.phone,
      sensitiveLivingPerson.address,
      sensitiveLivingPerson.privateNotes,
      sensitiveLivingPerson.biography,
      sensitiveLivingPerson.birthDate,
    ];

    const dtoJsonString = JSON.stringify(publicDto);
    for (const forbidden of forbiddenValues) {
      if (forbidden) {
        expect(dtoJsonString).not.toContain(forbidden);
      }
    }
  });
});

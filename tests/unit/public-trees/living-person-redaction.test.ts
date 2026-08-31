import { describe, it, expect } from "vitest";
import {
  redactLivingPerson,
  type RawPersonEntity,
} from "@/features/public-trees/privacy/living-person-redaction";

describe("P30-T03, P30-T20: Living Person Redaction & Privacy Projections", () => {
  const sampleLivingPerson: RawPersonEntity = {
    id: "p-living-1",
    fullName: "Nguyễn Văn A",
    gender: "male",
    livingStatus: "living",
    birthDate: "1990-05-15",
    birthYear: 1990,
    deathDate: null,
    deathYear: null,
    birthIsEstimated: false,
    deathIsEstimated: false,
  };

  const sampleDeceasedPerson: RawPersonEntity = {
    id: "p-deceased-1",
    fullName: "Nguyễn Văn B",
    gender: "male",
    livingStatus: "deceased",
    birthDate: "1920-01-01",
    birthYear: 1920,
    deathDate: "1995-10-20",
    deathYear: 1995,
    birthIsEstimated: false,
    deathIsEstimated: false,
  };

  const sampleUnknownLivingStatus: RawPersonEntity = {
    id: "p-unknown-1",
    fullName: "Trần Thị C",
    gender: "female",
    livingStatus: "unknown",
    birthDate: "1980-03-04",
    birthYear: 1980,
    deathDate: null,
    deathYear: null,
  };

  it("ẩn hoàn toàn thông tin chi tiết và gắn nhãn PUBLIC_REDACTED cho người còn sống (REDACTED Policy)", () => {
    const redacted = redactLivingPerson(sampleLivingPerson, "REDACTED");

    expect(redacted.id).toBe(sampleLivingPerson.id);
    expect(redacted.displayName).toBe("Nguyễn Văn A");
    expect(redacted.livingState).toBe("LIVING");
    expect(redacted.birthYear).toBe(1990); // Giữ năm sinh
    expect(redacted.deathYear).toBeNull();
    expect(redacted.publicThumbnail).toBeNull(); // Avatar người sống mặc định ẩn
    expect(redacted.visibility).toBe("PUBLIC_REDACTED");
    // Không có các trường nhạy cảm
    expect((redacted as any).birthDate).toBeUndefined();
    expect((redacted as any).biography).toBeUndefined();
  });

  it("áp dụng chính sách STRICT: ẩn tên đầy đủ và năm sinh của người còn sống", () => {
    const strictRedacted = redactLivingPerson(sampleLivingPerson, "STRICT");

    expect(strictRedacted.displayName).toBe("Thành viên gia đình");
    expect(strictRedacted.birthYear).toBeNull();
    expect(strictRedacted.livingState).toBe("LIVING");
    expect(strictRedacted.visibility).toBe("PUBLIC_REDACTED");
  });

  it("xử lý bảo thủ trạng thái sống UNKNOWN như người còn sống", () => {
    const redactedUnknown = redactLivingPerson(sampleUnknownLivingStatus, "REDACTED");

    expect(redactedUnknown.livingState).toBe("UNKNOWN");
    expect(redactedUnknown.deathYear).toBeNull();
    expect(redactedUnknown.publicThumbnail).toBeNull();
    expect(redactedUnknown.visibility).toBe("PUBLIC_REDACTED");
  });

  it("giữ nguyên thông tin công khai hợp lệ cho người đã mất", () => {
    const deceased = redactLivingPerson(sampleDeceasedPerson, "REDACTED");

    expect(deceased.displayName).toBe("Nguyễn Văn B");
    expect(deceased.livingState).toBe("DECEASED");
    expect(deceased.birthYear).toBe(1920);
    expect(deceased.deathYear).toBe(1995);
    expect(deceased.visibility).toBe("PUBLIC");
  });
});

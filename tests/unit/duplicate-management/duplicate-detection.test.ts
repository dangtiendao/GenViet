import { describe, it, expect } from "vitest";
import { calculateDuplicateScore } from "@/features/duplicate-management/detection/scoring-model";
import { findDuplicateCandidates } from "@/features/duplicate-management/detection/duplicate-detector";

describe("P27-T15: Duplicate Detection Pipeline Tests", () => {
  it("tính điểm trùng khớp cao cho hai hồ sơ cùng tên, ngày sinh và tên cha", () => {
    const pA = {
      id: "1",
      fullName: "Nguyễn Văn An",
      gender: "male",
      birthDate: "1980-01-01",
      fatherName: "Nguyễn Văn Ba",
    };
    const pB = {
      id: "2",
      fullName: "Nguyễn Văn An",
      gender: "male",
      birthDate: "1980-01-01",
      fatherName: "Nguyễn Văn Ba",
    };

    const scoreResult = calculateDuplicateScore(pA, pB);
    expect(scoreResult.score).toBe(100);
    expect(scoreResult.classification).toBe("likely");
  });

  it("quét tìm ứng viên trùng khớp chính xác từ danh sách nhân vật", () => {
    const persons = [
      { id: "1", fullName: "Nguyễn Văn An", gender: "male" },
      { id: "2", fullName: "Nguyễn Văn An", gender: "male" },
      { id: "3", fullName: "Trần Thị Mai", gender: "female" },
    ];

    const candidates = findDuplicateCandidates(persons, 40);
    expect(candidates).toHaveLength(1);
    expect(candidates[0].personA.id).toBe("1");
    expect(candidates[0].personB.id).toBe("2");
  });
});

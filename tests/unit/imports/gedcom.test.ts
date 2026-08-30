import { describe, it, expect } from "vitest";
import { parseGedcomText } from "@/features/imports/gedcom/gedcom-parser";
import { evaluateGedcomCompatibility } from "@/features/imports/gedcom/gedcom-compatibility";

describe("P27-T12: GEDCOM Compatibility Spike Tests", () => {
  it("phân tích cú pháp các thẻ INDI và FAM trong chuỗi GEDCOM chuẩn", () => {
    const gedcomText = `
0 HEAD
1 SOUR GenViet
0 @I1@ INDI
1 NAME Nguyễn /Văn A/
1 SEX M
0 @I2@ INDI
1 NAME Trần /Thị B/
1 SEX F
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
0 TRLR
    `.trim();

    const result = parseGedcomText(gedcomText);
    expect(result.individuals).toHaveLength(2);
    expect(result.individuals[0].name).toBe("Nguyễn Văn A");
    expect(result.individuals[0].gender).toBe("M");
    expect(result.families).toHaveLength(1);
    expect(result.families[0].husbandId).toBe("@I1@");
  });

  it("cảnh báo các rủi ro mất mát dữ liệu đối với thẻ không hỗ trợ", () => {
    const report = evaluateGedcomCompatibility(["NOTE", "OBJE"]);
    expect(report.isCompatible).toBe(true);
    expect(report.dataLossRisks.length).toBeGreaterThan(0);
  });
});

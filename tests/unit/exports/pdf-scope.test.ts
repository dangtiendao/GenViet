import { describe, it, expect } from "vitest";
import { generatePrintableHtml } from "@/features/exports/pdf/pdf-generator";
import { PdfExportOptionsSchema } from "@/features/exports/pdf/pdf-options";

describe("PDF Scope & Traversal Mode Disclosure Tests (P28-T49 -> P28-T52)", () => {
  const persons = [
    {
      id: "p1",
      fullName: "Nguyễn Văn A",
      gender: "male",
      birthDate: "1950-01-01",
      isLiving: true,
    },
    {
      id: "p2",
      fullName: "Nguyễn Thị B",
      gender: "female",
      birthDate: "1980-05-15",
      isLiving: true,
    },
  ];

  it("gắn thông điệp công bố phạm vi dòng họ mặc định khi descendantTraversalMode = PATERNAL_LINE", () => {
    const options = PdfExportOptionsSchema.parse({
      descendantTraversalMode: "PATERNAL_LINE",
    });

    const html = generatePrintableHtml("Gia Phả Họ Nguyễn", persons, options);

    expect(html).toContain("Phạm vi hiển thị: Chế độ dòng họ mặc định");
    expect(html).toContain("hậu duệ qua nhánh nữ không mở rộng");
  });

  it("gắn thông điệp công bố toàn bộ con cháu khi descendantTraversalMode = ALL_DESCENDANTS", () => {
    const options = PdfExportOptionsSchema.parse({
      descendantTraversalMode: "ALL_DESCENDANTS",
    });

    const html = generatePrintableHtml("Gia Phả Họ Nguyễn", persons, options);

    expect(html).toContain("Phạm vi hiển thị: Toàn bộ con cháu (dòng nội & dòng ngoại)");
  });
});

import { describe, it, expect } from "vitest";
import { sanitizeCellValue } from "@/features/imports/excel/excel-parser";
import { generateExcelImportPreview } from "@/features/imports/excel/excel-preview";

describe("P27-T10: Excel Import Pipeline Tests", () => {
  it("loại bỏ mã công thức Formula Injection trong ô dữ liệu", () => {
    expect(sanitizeCellValue("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCellValue("+CMD|' /C calc'!A0")).toBe("'+CMD|' /C calc'!A0");
    expect(sanitizeCellValue("Nguyễn Văn A")).toBe("Nguyễn Văn A");
  });

  it("sinh bản xem trước Preview chính xác từ kết quả phân tích bảng tính", () => {
    const parseResult = {
      sheetName: "Sheet1",
      totalRows: 2,
      validRows: [
        { rowNumber: 1, fullName: "Nguyễn Văn A", fatherName: "Nguyễn Văn Gốc" },
        { rowNumber: 2, fullName: "Nguyễn Thị B" },
      ],
      errors: [],
    };

    const preview = generateExcelImportPreview(parseResult);
    expect(preview.newPersonsCount).toBe(2);
    expect(preview.relationshipsDetected).toBe(1);
    expect(preview.validationWarnings).toHaveLength(0);
  });
});

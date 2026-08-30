import { ParsedExcelRow, ExcelParseResult } from "./excel-parser";

export interface ExcelImportPreview {
  sheetName: string;
  totalParsedPersons: number;
  newPersonsCount: number;
  relationshipsDetected: number;
  validationWarnings: string[];
  sampleRows: ParsedExcelRow[];
}

export function generateExcelImportPreview(parseResult: ExcelParseResult): ExcelImportPreview {
  const warnings: string[] = [];

  parseResult.errors.forEach((err) => {
    warnings.push(`Dòng ${err.row}, Cột ${err.column}: ${err.message}`);
  });

  let detectedRels = 0;
  parseResult.validRows.forEach((row) => {
    if (row.fatherName) detectedRels++;
    if (row.motherName) detectedRels++;
    if (row.spouseName) detectedRels++;
  });

  return {
    sheetName: parseResult.sheetName,
    totalParsedPersons: parseResult.totalRows,
    newPersonsCount: parseResult.validRows.length,
    relationshipsDetected: detectedRels,
    validationWarnings: warnings,
    sampleRows: parseResult.validRows.slice(0, 5),
  };
}

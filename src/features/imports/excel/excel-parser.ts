export interface ParsedExcelRow {
  rowNumber: number;
  fullName: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  isLiving?: boolean;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  notes?: string;
}

export interface ExcelParseResult {
  sheetName: string;
  totalRows: number;
  validRows: ParsedExcelRow[];
  errors: { row: number; column: string; message: string }[];
}

/**
 * Phân tích tệp bảng tính Excel (P27-T10)
 * Chống Formula Injection: Tuyệt đối không thực thi các ký tự `=, +, -, @` trong ô dữ liệu
 */
export function sanitizeCellValue(val: any): string {
  if (val === null || val === undefined) return "";
  let str = String(val).trim();
  if (str.startsWith("=") || str.startsWith("+") || str.startsWith("-") || str.startsWith("@")) {
    str = `'${str}`; // Thoát ký tự công thức chống Formula Injection
  }
  return str;
}

import { PdfExportOptions } from "./pdf-options";

export interface PrintablePersonRecord {
  id: string;
  fullName: string;
  gender?: string;
  birthDate?: string;
  deathDate?: string;
  isLiving?: boolean;
}

/**
 * Tạo tài liệu HTML/PDF có thể in chuẩn Unicode tiếng Việt (P27-T11)
 * Bảo vệ quyền riêng tư: Ẩn người còn sống nếu tùy chọn hideLivingPersons = true
 */
export function generatePrintableHtml(
  treeName: string,
  persons: PrintablePersonRecord[],
  options: PdfExportOptions
): string {
  const filteredPersons = persons.filter((p) => !(options.hideLivingPersons && p.isLiving));

  const rowsHtml = filteredPersons
    .map(
      (p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${p.fullName}</strong></td>
      <td>${p.gender || "Không rõ"}</td>
      <td>${options.hideDates ? "[ĐÃ ẨN]" : p.birthDate || "-"}</td>
      <td>${options.hideDates ? "[ĐÃ ẨN]" : p.deathDate || (p.isLiving ? "Còn sống" : "-")}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>${treeName} - Báo Cáo Gia Phả GenViet</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; }
        h1 { color: #1e293b; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        th { background-color: #f1f5f9; font-weight: bold; }
        @media print {
          @page { size: ${options.pageSize} ${options.orientation}; margin: 15mm; }
        }
      </style>
    </head>
    <body>
      <h1>${treeName}</h1>
      <p style="text-align: center; color: #64748b;">Xuất dữ liệu từ nền tảng GenViet - Ngày: ${new Date().toLocaleDateString("vi-VN")}</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và Tên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Ngày mất</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

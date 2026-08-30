import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BackupExportCard } from "@/features/backups/components/backup-export-card";
import { BackupPreviewSummary } from "@/features/backups/components/backup-preview-summary";
import { BackupValidationErrors } from "@/features/backups/components/backup-validation-errors";
import type {
  BackupImportPreviewDto,
  BackupValidationReport,
} from "@/features/backups/types/backup.types";

describe("Backup UI Components", () => {
  it("render BackupExportCard hiển thị nút xuất tệp và tên cây", () => {
    const html = renderToStaticMarkup(
      <BackupExportCard treeId="11111111-1111-4111-a111-111111111111" treeName="Họ Nguyễn" />
    );
    expect(html).toContain("Xuất Bản Sao Lưu (JSON)");
    expect(html).toContain("Họ Nguyễn");
    expect(html).toContain("Tải tệp sao lưu (.json)");
  });

  it("render BackupPreviewSummary hiển thị đúng các số lượng thống kê", () => {
    const samplePreview: BackupImportPreviewDto = {
      schemaVersion: 1,
      sourceTreeName: "Cây Gốc",
      estimatedNewTreeName: "Cây Gốc (Bản nhập)",
      targetPrivacy: "private",
      isVersionSupported: true,
      versionStatus: "current",
      personCount: 15,
      relationshipCount: 14,
      unionCount: 5,
      unionMemberCount: 10,
      mediaCount: 2,
      mediaBinaryIncluded: false,
      digestSha256: "abcd",
      hasAnchorPerson: true,
      hasDefaultPerson: false,
      validationReport: { isValid: true, errors: [], warnings: [] },
    };

    const html = renderToStaticMarkup(<BackupPreviewSummary preview={samplePreview} />);
    expect(html).toContain("Cây Gốc");
    expect(html).toContain("Cây Gốc (Bản nhập)");
    expect(html).toContain("15");
    expect(html).toContain("14");
  });

  it("render BackupValidationErrors hiển thị danh sách lỗi chi tiết", () => {
    const report: BackupValidationReport = {
      isValid: false,
      errors: [
        {
          section: "persons",
          recordIndex: 0,
          fieldPath: "persons[0].fullName",
          code: "REQUIRED",
          message: "Họ và tên không được để trống",
          severity: "error",
          blocking: true,
        },
      ],
      warnings: [],
    };

    const html = renderToStaticMarkup(<BackupValidationErrors report={report} />);
    expect(html).toContain("Nhân vật");
    expect(html).toContain("Họ và tên không được để trống");
  });
});

export interface GedcomCompatibilityReport {
  isCompatible: boolean;
  supportedTagsCount: number;
  unsupportedTags: string[];
  dataLossRisks: string[];
}

export function evaluateGedcomCompatibility(unsupportedTags: string[]): GedcomCompatibilityReport {
  const risks: string[] = [];

  if (unsupportedTags.includes("NOTE")) {
    risks.push("Ghi chú chi tiết có thể bị lược bỏ");
  }
  if (unsupportedTags.includes("OBJE")) {
    risks.push("Tệp đính kèm nhị phân không được tự động tải");
  }

  return {
    isCompatible: true,
    supportedTagsCount: 4,
    unsupportedTags,
    dataLossRisks: risks,
  };
}

/**
 * Quản lý Feature Flags của hệ thống GenViet (P27-WP01)
 * Đảm bảo các tính năng mở rộng/thử nghiệm (Proposals, Lunar, GEDCOM, Address Terms, R2)
 * được kiểm soát an toàn và mặc định OFF trên Production khi chưa chính thức kích hoạt.
 */

export interface FeatureFlags {
  enableMultiRoles: boolean;
  enableInvitations: boolean;
  enableProposals: boolean;
  enableAccountLinking: boolean;
  enableEvents: boolean;
  enableDeathAnniversaries: boolean;
  enableLunarCalendar: boolean;
  enableAlbums: boolean;
  enableDocuments: boolean;
  enableExcelImport: boolean;
  enablePdfExport: boolean;
  enableGedcomSpike: boolean;
  enableRelationshipPath: boolean;
  enableAddressTerms: boolean;
  enableDuplicateDetection: boolean;
  enableProfileMerge: boolean;
  enableLargeTreePrint: boolean;
  storageProvider: "supabase" | "r2";
  enableCloudflareStaging: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableMultiRoles: true,
  enableInvitations: true,
  enableProposals: false, // Feature flag mặc định OFF cho quy trình duyệt đề xuất
  enableAccountLinking: true,
  enableEvents: true,
  enableDeathAnniversaries: true,
  enableLunarCalendar: false, // Feature flag mặc định OFF cho thuật toán Âm lịch thử nghiệm
  enableAlbums: true,
  enableDocuments: true,
  enableExcelImport: true,
  enablePdfExport: true,
  enableGedcomSpike: false, // Feature flag mặc định OFF cho GEDCOM parser thử nghiệm
  enableRelationshipPath: true,
  enableAddressTerms: false, // Feature flag mặc định OFF cho gợi ý xưng hô thử nghiệm
  enableDuplicateDetection: true,
  enableProfileMerge: true,
  enableLargeTreePrint: true,
  storageProvider: "supabase", // Mặc định sử dụng Supabase Storage Private Bucket
  enableCloudflareStaging: false,
};

export function getFeatureFlags(): FeatureFlags {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    enableProposals: process.env.NEXT_PUBLIC_ENABLE_PROPOSALS === "true",
    enableLunarCalendar: process.env.NEXT_PUBLIC_ENABLE_LUNAR === "true",
    enableGedcomSpike: process.env.NEXT_PUBLIC_ENABLE_GEDCOM === "true",
    enableAddressTerms: process.env.NEXT_PUBLIC_ENABLE_ADDRESS_TERMS === "true",
    storageProvider: process.env.STORAGE_PROVIDER === "r2" ? "r2" : "supabase",
    enableCloudflareStaging: process.env.ENABLE_CLOUDFLARE_STAGING === "true",
  };
}

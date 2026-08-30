#!/usr/bin/env node

/**
 * Script thống kê danh mục tệp đa phương tiện riêng tư (P27-T18)
 */

function inventoryMedia() {
  console.log("=== THỐNG KÊ TỆP ĐA PHƯƠNG TIỆN RIÊNG TƯ (STORAGE INVENTORY) ===");

  const mockInventory = [
    {
      bucket: "avatars",
      objectCount: 42,
      totalSizeBytes: 12582912,
      formatDistribution: { jpg: 30, png: 10, webp: 2 },
    },
    {
      bucket: "documents",
      objectCount: 15,
      totalSizeBytes: 45000000,
      formatDistribution: { pdf: 12, jpg: 3 },
    },
  ];

  let totalObjects = 0;
  let totalBytes = 0;

  mockInventory.forEach((b) => {
    console.log(
      `[BUCKET: ${b.bucket}] - ${b.objectCount} tệp (${(b.totalSizeBytes / 1024 / 1024).toFixed(2)} MB)`
    );
    totalObjects += b.objectCount;
    totalBytes += b.totalSizeBytes;
  });

  console.log(`[TỔNG SỐ TỆP]: ${totalObjects}`);
  console.log(`[TỔNG DUNG LƯỢNG]: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log("=== HOÀN TẤT THỐNG KÊ MEDIA ===");
}

inventoryMedia();

import { describe, it, expect } from "vitest";
import { generatePrintableHtml } from "@/features/exports/pdf/pdf-generator";
import { calculatePrintTiles } from "@/features/exports/large-tree-print/large-tree-tiler";

describe("P27-T11 & P27-T17: PDF Export and Large-Tree Print Tests", () => {
  it("tạo mã HTML in ấn chuẩn Unicode và tôn trọng tùy chọn ẩn người còn sống", () => {
    const persons = [
      { id: "1", fullName: "Nguyễn Văn Cụ", isLiving: false, birthDate: "1900" },
      { id: "2", fullName: "Nguyễn Văn Cháu", isLiving: true, birthDate: "2010" },
    ];

    const html = generatePrintableHtml("Gia Phả Họ Nguyễn", persons, {
      pageSize: "A4",
      orientation: "portrait",
      hideLivingPersons: true,
      hideDates: false,
      hideAvatars: false,
      maxPages: 50,
    });

    expect(html).toContain("Nguyễn Văn Cụ");
    expect(html).not.toContain("Nguyễn Văn Cháu"); // Đã bị ẩn do còn sống
  });

  it("phân mảnh lưới in cây lớn (Tiled Grid) chính xác theo kích thước khung vẽ", () => {
    const tiles = calculatePrintTiles({
      totalWidth: 2000,
      totalHeight: 1500,
      pageWidth: 800,
      pageHeight: 600,
      overlapPx: 20,
    });

    expect(tiles.length).toBeGreaterThan(1);
    expect(tiles[0].pageNumber).toBe(1);
    expect(tiles[0].viewBox.width).toBe(800);
  });
});

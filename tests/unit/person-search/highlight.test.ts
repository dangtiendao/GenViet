import { describe, it, expect } from "vitest";
import { extractHighlightChunks } from "@/features/person-search/utils/search-highlight";

describe("Search Keyword Highlighting Tests (P16-T15)", () => {
  it("tách chuỗi chính xác khi từ khóa có dấu", () => {
    const chunks = extractHighlightChunks("Nguyễn Văn An", "Nguyễn");
    expect(chunks).toHaveLength(5); // ["Nguyễn", " ", "Văn", " ", "An"]
    expect(chunks[0]).toEqual({ text: "Nguyễn", isMatch: true });
    expect(chunks[1]).toEqual({ text: " ", isMatch: false });
    expect(chunks[2]).toEqual({ text: "Văn", isMatch: false });
    expect(chunks[3]).toEqual({ text: " ", isMatch: false });
    expect(chunks[4]).toEqual({ text: "An", isMatch: false });
  });

  it("tách chuỗi chính xác khi từ khóa không dấu so khớp văn bản có dấu", () => {
    const chunks = extractHighlightChunks("Đặng Tiến Đạo", "dang");
    const matched = chunks.filter((c) => c.isMatch);
    expect(matched).toHaveLength(1);
    expect(matched[0].text).toBe("Đặng");
  });

  it("xử lý an toàn chuỗi chứa ký tự regex đặc biệt và HTML-like characters mà không lỗi", () => {
    const chunks1 = extractHighlightChunks("Lê Văn A (Trưởng)", "(Trưởng)");
    expect(chunks1.length).toBeGreaterThan(0);

    const chunks2 = extractHighlightChunks("<script>alert(1)</script>", "<script>");
    expect(chunks2.length).toBeGreaterThan(0);
  });

  it("trả về toàn bộ chuỗi không match khi query rỗng hoặc null", () => {
    const chunks = extractHighlightChunks("Nguyễn Văn An", "");
    expect(chunks).toEqual([{ text: "Nguyễn Văn An", isMatch: false }]);
  });
});

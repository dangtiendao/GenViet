import { describe, it, expect } from "vitest";
import {
  encodeSearchCursor,
  decodeSearchCursor,
  type SearchCursorPayload,
} from "@/features/person-search/utils/search-cursor";

describe("Search Cursor Encoding & Decoding Tests (P16-T13)", () => {
  const samplePayload: SearchCursorPayload = {
    rankTier: 2,
    similarity: 0.8542,
    normalizedName: "nguyen van an",
    birthYear: 1980,
    id: "p1111111-1111-4111-a111-111111111111",
  };

  it("mã hóa và giải mã cursor toàn vẹn dữ liệu", () => {
    const encoded = encodeSearchCursor(samplePayload);
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeSearchCursor(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.rankTier).toBe(samplePayload.rankTier);
    expect(decoded?.similarity).toBeCloseTo(samplePayload.similarity, 3);
    expect(decoded?.normalizedName).toBe(samplePayload.normalizedName);
    expect(decoded?.birthYear).toBe(samplePayload.birthYear);
    expect(decoded?.id).toBe(samplePayload.id);
  });

  it("hỗ trợ birthYear là null", () => {
    const payloadWithNullBirth: SearchCursorPayload = {
      ...samplePayload,
      birthYear: null,
    };

    const encoded = encodeSearchCursor(payloadWithNullBirth);
    const decoded = decodeSearchCursor(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.birthYear).toBeNull();
  });

  it("từ chối chuỗi cursor không hợp lệ hoặc bị can thiệp", () => {
    expect(decodeSearchCursor("")).toBeNull();
    expect(decodeSearchCursor("invalid_base64_string_xyz")).toBeNull();
    expect(decodeSearchCursor(null)).toBeNull();
    expect(decodeSearchCursor(undefined)).toBeNull();
  });
});

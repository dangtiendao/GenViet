import { describe, it, expect } from "vitest";
import {
  isValidSlug,
  normalizeSlug,
  RESERVED_SLUGS,
  DEFAULT_TREE_VISIBILITY,
  DEFAULT_SEARCH_ENGINE_VISIBILITY,
  DEFAULT_LIVING_PERSON_POLICY,
  DEFAULT_PERSON_PUBLIC_VISIBILITY,
} from "@/features/public-trees/contracts/tree-visibility";

describe("P30-T02, P30-T08, P30-T09: Public Tree Visibility & Slug Contracts", () => {
  it("chứa các giá trị mặc định chuẩn", () => {
    expect(DEFAULT_TREE_VISIBILITY).toBe("PRIVATE");
    expect(DEFAULT_SEARCH_ENGINE_VISIBILITY).toBe("NOINDEX");
    expect(DEFAULT_LIVING_PERSON_POLICY).toBe("REDACTED");
    expect(DEFAULT_PERSON_PUBLIC_VISIBILITY).toBe("INHERIT_TREE");
  });

  describe("normalizeSlug", () => {
    it("chuẩn hóa chuỗi tiếng Việt có dấu sang kebab-case không dấu", () => {
      expect(normalizeSlug("Gia Phả Họ Nguyễn")).toBe("gia-pha-ho-nguyen");
      expect(normalizeSlug("Dòng Họ Đặng (Tiến Đạo)")).toBe("dong-ho-dang-tien-dao");
      expect(normalizeSlug("  Tộc Trần Văn - Chi 2  ")).toBe("toc-tran-van-chi-2");
    });

    it("loại bỏ ký tự đặc biệt và dấu gạch ngang liên tiếp", () => {
      expect(normalizeSlug("Họ Lê @@@ 2026 !!")).toBe("ho-le-2026");
      expect(normalizeSlug("---slug---test---")).toBe("slug-test");
    });

    it("cắt ngắn nếu vượt quá 60 ký tự", () => {
      const longName = "a".repeat(100);
      const slug = normalizeSlug(longName);
      expect(slug.length).toBeLessThanOrEqual(60);
    });
  });

  describe("isValidSlug", () => {
    it("chấp nhận slug hợp lệ (3-60 ký tự, chữ cái thường, số, dấu gạch đơn)", () => {
      expect(isValidSlug("ho-nguyen")).toBe(true);
      expect(isValidSlug("gia-pha-dong-ho-dang-1945")).toBe(true);
      expect(isValidSlug("abc")).toBe(true);
    });

    it("từ chối slug quá ngắn (< 3 ký tự)", () => {
      expect(isValidSlug("ab")).toBe(false);
      expect(isValidSlug("a")).toBe(false);
      expect(isValidSlug("")).toBe(false);
    });

    it("từ chối slug chứa ký tự hoa, khoảng trắng, hoặc ký tự đặc biệt", () => {
      expect(isValidSlug("Ho-Nguyen")).toBe(false);
      expect(isValidSlug("ho nguyen")).toBe(false);
      expect(isValidSlug("ho_nguyen")).toBe(false);
      expect(isValidSlug("ho.nguyen")).toBe(false);
      expect(isValidSlug("ho@nguyen")).toBe(false);
    });

    it("từ chối slug có dấu gạch ngang liên tiếp hoặc ở đầu/cuối", () => {
      expect(isValidSlug("ho--nguyen")).toBe(false);
      expect(isValidSlug("-ho-nguyen")).toBe(false);
      expect(isValidSlug("ho-nguyen-")).toBe(false);
    });

    it("từ chối các reserved keywords hệ thống", () => {
      for (const reserved of RESERVED_SLUGS) {
        expect(isValidSlug(reserved)).toBe(false);
      }
      expect(isValidSlug("admin")).toBe(false);
      expect(isValidSlug("api")).toBe(false);
      expect(isValidSlug("dashboard")).toBe(false);
      expect(isValidSlug("public")).toBe(false);
      expect(isValidSlug("trees")).toBe(false);
      expect(isValidSlug("login")).toBe(false);
    });
  });
});

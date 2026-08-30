import { describe, it, expect } from "vitest";
import { suggestVietnameseAddressTerm } from "@/features/kinship/address-terms/address-term-engine";

describe("P27-T14: Vietnamese Kinship Address Terms Tests", () => {
  it("gợi ý chính xác vai xưng Cha / Mẹ cho quan hệ 1 bước cha mẹ", () => {
    const suggestion = suggestVietnameseAddressTerm(
      [
        {
          fromPersonId: "p1",
          toPersonId: "p2",
          relationType: "parent",
          description: "p1 là cha của p2",
        },
      ],
      { targetGender: "male" }
    );

    expect(suggestion.suggestedTerm).toBe("Cha/Bố");
    expect(suggestion.confidence).toBe("exact");
  });

  it("gợi ý chính xác danh xưng Ông Nội cho quan hệ 2 bước bên nội", () => {
    const suggestion = suggestVietnameseAddressTerm(
      [
        { fromPersonId: "p1", toPersonId: "p2", relationType: "parent", description: "" },
        { fromPersonId: "p2", toPersonId: "p3", relationType: "parent", description: "" },
      ],
      { targetGender: "male", isPaternalBranch: true }
    );

    expect(suggestion.suggestedTerm).toBe("Ông Nội");
    expect(suggestion.confidence).toBe("probable");
  });
});

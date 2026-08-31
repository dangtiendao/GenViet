import { describe, it, expect } from "vitest";
import { isPersonPubliclyVisible } from "@/features/public-trees/privacy/person-visibility";
import type { RawPersonEntity } from "@/features/public-trees/privacy/living-person-redaction";

describe("P30-T04, P30-T21: Private Person & CUT_BRANCH Topology", () => {
  it("trả về false đối với nhân vật có publicVisibility là PRIVATE (cắt nhánh)", () => {
    const privatePerson: RawPersonEntity = {
      id: "p-private-1",
      fullName: "Nhân vật riêng tư",
      gender: "male",
      livingStatus: "living",
      publicVisibility: "PRIVATE",
    };

    expect(isPersonPubliclyVisible(privatePerson)).toBe(false);
  });

  it("trả về true đối với nhân vật có publicVisibility là INHERIT_TREE hoặc PUBLIC", () => {
    const normalPerson: RawPersonEntity = {
      id: "p-normal-1",
      fullName: "Nhân vật bình thường",
      gender: "female",
      livingStatus: "living",
      publicVisibility: "INHERIT_TREE",
    };

    const explicitlyPublicPerson: RawPersonEntity = {
      id: "p-pub-1",
      fullName: "Nhân vật công khai",
      gender: "male",
      livingStatus: "deceased",
      publicVisibility: "PUBLIC",
    };

    expect(isPersonPubliclyVisible(normalPerson)).toBe(true);
    expect(isPersonPubliclyVisible(explicitlyPublicPerson)).toBe(true);
  });
});
